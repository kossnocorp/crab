use clap::Parser;
use glob::glob;
use regex::Regex;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

#[derive(Parser)]
struct Args {
    command: String,
    package: String,
    #[clap(long)]
    cwd: Option<PathBuf>,
}

fn main() {
    let args = Args::parse();

    let cwd = args
        .cwd
        .unwrap_or_else(|| std::env::current_dir().expect("Failed to determine current directory"));

    let package_name = match extract_package_name(&args.package) {
        Some(name) => name,
        None => {
            eprintln!("Could not extract package name from: {}", args.package);
            return;
        }
    };

    let package = read_package_json(&cwd).unwrap();
    let package_workspaces = get_package_workspaces(package);
    let workspaces = list_workspaces(&cwd, package_workspaces);
    let workspaces_with_package = list_workspaces_with_package(workspaces);
    let dependant_workspaces = list_dependant_workspaces(workspaces_with_package, &package_name);

    let dependant_workspaces_str: Vec<String> = dependant_workspaces
        .iter()
        .map(|ws| format!("-w {}", ws))
        .collect();

    if dependant_workspaces_str.len() == 0 {
        eprintln!(
            "No dependant workspaces found for package: {}",
            package_name
        );
        return;
    }

    let command = format!(
        "npm install {} {}",
        dependant_workspaces_str.join(" "),
        args.package
    );

    println!("Running command: {}", command);

    let child = Command::new("sh")
        .current_dir(cwd)
        .arg("-c")
        .arg(&command)
        .stdout(std::process::Stdio::inherit())
        .stderr(std::process::Stdio::inherit())
        .spawn()
        .expect("Failed to execute command");

    let output = child.wait_with_output().expect("Failed to wait on child");

    let exit_code = output.status.code().unwrap_or(1);
    std::process::exit(exit_code);
}

fn read_package_json(cwd: &Path) -> Result<serde_json::Value, std::io::Error> {
    let package_json_text = fs::read_to_string(cwd.join("package.json"))?;
    let package = serde_json::from_str(&package_json_text)?;
    Ok(package)
}

fn get_package_workspaces(package: serde_json::Value) -> Vec<String> {
    match package.get("workspaces") {
        Some(workspaces) => workspaces
            .as_array()
            .expect("workspaces not an array")
            .iter()
            .map(|ws| ws.as_str().unwrap().to_owned())
            .collect(),
        None => Vec::new(),
    }
}

fn list_workspaces(cwd: &Path, patterns: Vec<String>) -> Vec<PathBuf> {
    let mut workspaces = Vec::new();

    for pattern in patterns {
        let cwd_pattern = cwd.join(pattern);
        let cwd_pattern_str = cwd_pattern.to_str().unwrap();
        // TODO: glob runs sequentially, so rewrite to use rayon
        let globs = glob(cwd_pattern_str).expect("Failed to read glob pattern");

        for entry in globs {
            if let Ok(path) = entry {
                if path.is_dir() {
                    workspaces.push(path);
                }
            }
        }
    }

    workspaces
}

fn list_workspaces_with_package(workspaces: Vec<PathBuf>) -> Vec<(PathBuf, serde_json::Value)> {
    let mut workspaces_with_package = Vec::new();

    for workspace in workspaces {
        // TODO: Read runs sequentially, so rewrite to use rayon
        let package = match read_package_json(&workspace) {
            Ok(package) => package,
            Err(_) => continue,
        };
        workspaces_with_package.push((workspace, package));
    }

    workspaces_with_package
}

fn list_dependant_workspaces(
    workspaces_with_package: Vec<(PathBuf, serde_json::Value)>,
    package_name: &String,
) -> Vec<String> {
    let mut dependant_workspaces = Vec::new();

    for (_workspace, package) in workspaces_with_package {
        let dependencies = get_package_dependencies(&package, String::from("dependencies"));
        let dev_dependencies = get_package_dependencies(&package, String::from("devDependencies"));
        let all_dependencies: Vec<String> = dependencies
            .into_iter()
            .chain(dev_dependencies.into_iter())
            .collect();

        if all_dependencies.contains(&package_name) {
            let workspace_name = match package.get("name") {
                Some(name) => name.as_str().unwrap().to_owned(),
                None => continue,
            };
            dependant_workspaces.push(workspace_name);
        }
    }

    dependant_workspaces
}

fn get_package_dependencies(package: &serde_json::Value, field: String) -> Vec<String> {
    let dependencies = match package.get(field) {
        Some(dependencies) => dependencies
            .as_object()
            .expect("dependencies not an object")
            .keys()
            .map(|k| k.to_owned())
            .collect(),
        None => Vec::new(),
    };
    dependencies
}

fn extract_package_name(input: &str) -> Option<String> {
    let re = Regex::new(r"^(.*?)(@.*|$)").unwrap();
    re.captures(input)
        .and_then(|caps| caps.get(1))
        .map(|m| m.as_str().to_string())
}
