import { cn } from ".";

// Inline class names
{
  const trigger = false;
  const className = cn("inline-flex", trigger && "text-gray-800");
  className satisfies string;
  // @ts-expect-error
  className.notAny;
}

// Variant class names builder
{
  type Size = "xsmall" | "small" | "medium" | "large" | "xlarge";

  type Color = "main" | "support" | "detail" | "brand";

  const iconCn = cn<{
    size: Size;
    color: Color;
    trigger: boolean;
    flags: number;
  }>()
    .base("inline-flex")
    .size("medium", {
      xsmall: "h-3",
      small: "h-4",
      medium: "h-5",
      large: "h-6",
      xlarge: "h-9",
    })
    .color("main", {
      main: "text-gray-800",
      support: "text-gray-500",
      detail: "text-gray-400",
      brand: "text-lime-500",
    })
    .trigger(false, {
      true: [
        [{ color: "main" }, "hover:text-gray-900"],
        [{ color: "support" }, "hover:text-gray-600"],
        [{ color: "detail" }, "hover:text-gray-500"],
      ],
    })
    .flags(0, {
      [2 ** 0]: "flag-1",
      [(2 ** 0) | (2 ** 1)]: [{ color: "main" }, "flag-2"],
    });

  const className = iconCn({ size: "large" });
  typeof className satisfies string;
  // @ts-expect-error
  className.notAny;

  // Props inferring
  type Props = cn.Props<typeof iconCn>;
  assertType<
    TypeEqual<
      Props,
      {
        size?: Size | undefined;
        color?: Color | undefined;
        trigger?: boolean | undefined;
      }
    >
  >(true);

  // It allows passing undefined
  iconCn({ size: undefined });
}

// No variants class name
{
  const inlineFlex = cn().base("inline-flex");
  inlineFlex({ className: "text-gray-800" });
  // @ts-expect-error
  inlineFlex.notAny;
}

// Variant class names shortcut
{
  type Size = "xsmall" | "small" | "medium" | "large" | "xlarge";

  type Color = "main" | "support" | "detail" | "brand";

  const iconCn = cn<{ size: Size; color: Color; trigger: boolean }>()
    .base("inline-flex")
    .size("medium", {
      xsmall: "h-3",
      small: "h-4",
      medium: "h-5",
      large: "h-6",
      xlarge: "h-9",
    })
    .color("main", {
      main: "text-gray-800",
      support: "text-gray-500",
      detail: "text-gray-400",
      brand: "text-lime-500",
    })
    .trigger(false, {
      true: [
        {
          color: {
            main: "hover:text-gray-900",
            support: "hover:text-gray-600",
            detail: "hover:text-gray-500",
          },
        },
      ],
    });

  // Even shorter API
  cn<{ size: Size; color: Color; trigger: boolean }>()
    .base("inline-flex")
    .size("medium")
    .color("main")
    .trigger(false, {
      true: {
        color: {
          main: "hover:text-gray-900",
          support: "hover:text-gray-600",
          detail: "hover:text-gray-500",
        },
      },
    });

  const className = iconCn({ size: "large" });
  typeof className satisfies string;
  // @ts-expect-error
  className.notAny;

  // Props inferring
  type Props = cn.Props<typeof iconCn>;
  assertType<
    TypeEqual<
      Props,
      {
        size?: Size | undefined;
        color?: Color | undefined;
        trigger?: boolean | undefined;
      }
    >
  >(true);
}

// Class names groups
{
  type Size = "xsmall" | "small" | "medium" | "large" | "xlarge";

  type Color = "primary" | "secondary";

  const fieldCng = cn<{ size: Size }>().group(($) => ({
    label: $.base(
      "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between"
    ).size("medium", {
      xsmall: "gap-2",
      small: "gap-2",
      medium: "gap-3",
      large: "gap-3",
      xlarge: "gap-4",
    }),

    content: $<{ color: Color }>()
      .base("font-medium")
      .size("medium", {
        xsmall: "text-xs",
        small: "text-xs",
        medium: "text-sm",
        xlarge: "text-lg",
      })
      .color("primary", {
        primary: "text-gray-700 font-semibold",
        secondary: "text-gray-500",
      }),
  }));

  const classNameGroup = fieldCng({ size: "medium", color: "primary" });

  typeof classNameGroup.label satisfies string;
  // @ts-expect-error
  classNameGroup.label.notAny;

  typeof classNameGroup.content satisfies string;
  // @ts-expect-error
  classNameGroup.content.notAny;

  // Props inferring
  type Props = cn.Props<typeof fieldCng>;
  assertType<
    TypeEqual<
      Props,
      {
        size?: Size | undefined;
        color?: Color | undefined;
      }
    >
  >(true);
  assertType<TypeEqual<keyof Props, "size" | "color">>(true);

  // It allows passing undefined
  fieldCng({ size: undefined });
}

// Group without shared variants
{
  type Size = "xsmall" | "small" | "medium" | "large" | "xlarge";

  type Color = "primary" | "secondary";

  const fieldCng = cn().group(($) => ({
    label: $<{ size: Size }>()
      .base(
        "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between"
      )
      .size("medium", {
        xsmall: "gap-2",
        small: "gap-2",
        medium: "gap-3",
        large: "gap-3",
        xlarge: "gap-4",
      }),

    description: $.base(""),

    content: $<{ color: Color }>().base("font-medium").color("primary", {
      primary: "text-gray-700 font-semibold",
      secondary: "text-gray-500",
    }),
  }));

  const classNameGroup = fieldCng({ size: "medium", color: "primary" });

  typeof classNameGroup.label satisfies string;
  // @ts-expect-error
  classNameGroup.label.notAny;

  typeof classNameGroup.content satisfies string;
  // @ts-expect-error
  classNameGroup.content.notAny;

  // Props inferring
  type Props = cn.Props<typeof fieldCng>;
  assertType<
    TypeEqual<Props, { size?: Size | undefined; color?: Color | undefined }>
  >(true);
  assertType<TypeEqual<keyof Props, "size" | "color">>(true);

  // It allows passing undefined
  fieldCng({ size: undefined });
}

export function assertType<Type>(_value: Type) {}

export type TypeEqual<T, U> = Exclude<T, U> extends never
  ? Exclude<U, T> extends never
    ? true
    : false
  : false;
