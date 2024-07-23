export function cn(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

cn.var = (base) => {
  const maps = {};

  const proxy = new Proxy(() => {}, {
    get(_, name) {
      return (dflt, map) => {
        maps[name] = [dflt, map];
        return proxy;
      };
    },

    apply(_, __, args) {
      const props = args[0] || {};

      const variants = Object.entries(maps).flatMap(([name, [dflt, map]]) => {
        const value = map?.[props[name] || dflt];
        if (typeof value === "string" || !value) return value;

        const values = [typeof value[0] === "string" && value[0]];
        value.forEach((vars) => {
          if (typeof vars === "string") return;
          let matches = Object.entries(vars[0]).every(
            ([key, val]) => (props[key] || maps[key][0]) === val
          );
          if (matches) values.push(vars[1]);
        });
        return values;
      });

      return cn(base, ...variants, props.className);
    },
  });

  return proxy;
};
