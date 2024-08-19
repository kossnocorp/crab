export function cn(...classNames) {
  if (classNames.length) return classNames.filter(Boolean).join(" ");

  const maps = {};
  let base;

  const groupProxy = new Proxy(cn, {
    get(_, name) {
      if (name === "base") return cn().base;
    },
  });

  const proxy = new Proxy(() => {}, {
    get(_, name) {
      return (...args) => {
        if (name === "group") {
          const maps = args[0](groupProxy);
          return (props) =>
            Object.fromEntries(
              Object.entries(maps).map(([key, value]) => [key, value(props)])
            );
        }

        if (name === "base") base = args[0];
        else maps[name] = args;
        return proxy;
      };
    },

    apply(_, __, args) {
      const props = args[0] || {};

      const variants = Object.entries(maps).flatMap(([name, [dflt, map]]) => {
        let value = map?.[props[name] || dflt];
        if (typeof value === "string" || !value) return value;
        // Normalize compound shortcut to array
        value = [].concat(value);

        const values = [typeof value[0] === "string" && value[0]];
        value.forEach((vars) => {
          if (typeof vars === "string") return;

          if (Array.isArray(vars)) {
            let matches = Object.entries(vars[0]).every(
              ([prop, val]) => (props[prop] || maps[prop][0]) === val
            );
            if (matches) values.push(vars[1]);
            return;
          }

          Object.entries(vars).forEach(([prop, map]) =>
            Object.entries(map).forEach(
              ([val, classNames]) =>
                (props[prop] || maps[prop][0]) === val &&
                values.push(classNames)
            )
          );
        });
        return values;
      });

      return cn(base, ...variants, props.className);
    },
  });

  return proxy;
}
