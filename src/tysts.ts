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

  const iconCn = cn
    .var<{ size: Size; color: Color; trigger: boolean }>("inline-flex")
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
    });

  const className = iconCn({ size: "large" });
  typeof className satisfies string;
  // @ts-expect-error
  className.notAny;
}
