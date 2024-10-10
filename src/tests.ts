import { describe, expect, it, vi } from "vitest";
import { cn } from ".";

describe("crab", () => {
  describe("inline", () => {
    it("compiles inline class names", () => {
      const className = cn(
        "inline-flex",
        false && "text-gray-800",
        null,
        undefined,
        "text-sm"
      );
      expect(className).toBe("inline-flex text-sm");
    });
  });

  describe("variants", () => {
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
          "cursor-pointer",
          [{ color: "main" }, "hover:text-gray-900"],
          [{ color: "support" }, "hover:text-gray-600"],
          [{ color: "detail" }, "hover:text-gray-500"],
        ],
      });

    it("compiles class names", () => {
      const className = iconCn();
      expect(className).toBe("inline-flex h-5 text-gray-800");
    });

    it("accepts variants", () => {
      const className = iconCn({ size: "large", color: "support" });
      expect(className).toBe("inline-flex h-6 text-gray-500");
    });

    it("compiles compound class names", () => {
      const className = iconCn({
        size: "large",
        color: "support",
        trigger: true,
      });
      expect(className).toBe(
        "inline-flex h-6 text-gray-500 cursor-pointer hover:text-gray-600"
      );
    });

    it("allows to omit the compound class names", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .base("inline-flex")
        .color("main", {
          main: "text-gray-800",
          support: "text-gray-500",
          detail: "text-gray-400",
          brand: "text-lime-500",
        })
        .trigger(false, {
          true: [
            // We're skipping this:
            // "cursor-pointer",
            [{ color: "main" }, "hover:text-gray-900"],
            [{ color: "support" }, "hover:text-gray-600"],
            [{ color: "detail" }, "hover:text-gray-500"],
          ],
        });

      const className = iconCn({
        color: "support",
        trigger: true,
      });
      expect(className).toBe("inline-flex text-gray-500 hover:text-gray-600");
    });

    it("uses default values for compound class names", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .base("inline-flex")
        .color("main", {
          main: "text-gray-800",
          support: "text-gray-500",
          detail: "text-gray-400",
          brand: "text-lime-500",
        })
        .trigger(false, {
          true: [
            "cursor-pointer",
            [{ color: "main" }, "hover:text-gray-900"],
            [{ color: "support" }, "hover:text-gray-600"],
            [{ color: "detail" }, "hover:text-gray-500"],
          ],
        });

      const className = iconCn({
        trigger: true,
      });
      expect(className).toBe(
        "inline-flex text-gray-800 cursor-pointer hover:text-gray-900"
      );
    });

    it("allows to use compound shortcut with default value", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .base("inline-flex")
        .color("main", {
          main: "text-gray-800",
          support: "text-gray-500",
          detail: "text-gray-400",
          brand: "text-lime-500",
        })
        .trigger(false, {
          true: [
            "cursor-pointer",
            {
              color: {
                main: "hover:text-gray-900",
                support: "hover:text-gray-600",
                detail: "hover:text-gray-500",
              },
            },
          ],
        });

      const className = iconCn({
        trigger: true,
      });
      expect(className).toBe(
        "inline-flex text-gray-800 cursor-pointer hover:text-gray-900"
      );
    });

    it("allows to use compound shortcut", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .base("inline-flex")
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

      const className = iconCn({
        color: "support",
        trigger: true,
      });
      expect(className).toBe("inline-flex text-gray-500 hover:text-gray-600");
    });

    it("allows to use compound shortcut without wrapper array", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .base("inline-flex")
        .color("main", {
          main: "text-gray-800",
          support: "text-gray-500",
          detail: "text-gray-400",
          brand: "text-lime-500",
        })
        .trigger(false, {
          true: {
            color: {
              main: "hover:text-gray-900",
              support: "hover:text-gray-600",
              detail: "hover:text-gray-500",
            },
          },
        });

      const className = iconCn({
        color: "support",
        trigger: true,
      });
      expect(className).toBe("inline-flex text-gray-500 hover:text-gray-600");
    });

    it("allows to omit the base class", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .color("main", {
          main: "text-gray-800",
          support: "text-gray-500",
          detail: "text-gray-400",
          brand: "text-lime-500",
        })
        .trigger(false, {
          true: [
            "cursor-pointer",
            [{ color: "main" }, "hover:text-gray-900"],
            [{ color: "support" }, "hover:text-gray-600"],
            [{ color: "detail" }, "hover:text-gray-500"],
          ],
        });

      const className = iconCn({
        color: "support",
        trigger: true,
      });
      expect(className).toBe(
        "text-gray-500 cursor-pointer hover:text-gray-600"
      );
    });

    it("allows to add extra class names", () => {
      const iconCn = cn<{ color: Color; trigger: boolean }>()
        .color("main", {
          main: "text-gray-800",
          support: "text-gray-500",
          detail: "text-gray-400",
          brand: "text-lime-500",
        })
        .trigger(false, {
          true: [
            "cursor-pointer",
            [{ color: "main" }, "hover:text-gray-900"],
            [{ color: "support" }, "hover:text-gray-600"],
            [{ color: "detail" }, "hover:text-gray-500"],
          ],
        });

      const className = iconCn({
        color: "support",
        trigger: true,
        className: "extra-class",
      });
      expect(className).toBe(
        "text-gray-500 cursor-pointer hover:text-gray-600 extra-class"
      );
    });

    it("allows to omit the variants", () => {
      const iconCn = cn<{ size: Size; color: Color; trigger: boolean }>()
        .base("inline-flex")
        .size("medium")
        .color("main")
        .trigger(false);
      const className = iconCn();
      expect(className).toBe("inline-flex");
    });

    it("compound shortcut API works with boolean props", () => {
      type ButtonColor = "default" | "action";

      const buttonCn = cn<{
        color: ButtonColor;
        transparent: boolean;
      }>()
        .color("default", {
          default: {
            transparent: {
              false: "bg-gray-500 text-white hover:bg-gray-400",
              true: "text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400",
            },
          },
          action: {
            transparent: {
              false: "bg-gray-700 text-white hover:bg-gray-600",
              true: "text-gray-800 hover:bg-gray-50 border-gray-400 hover:border-gray-500",
            },
          },
        })
        .transparent(false, {
          true: "bg-transparent border shadow-none",
        });

      expect(buttonCn()).toBe("bg-gray-500 text-white hover:bg-gray-400");
      expect(buttonCn({ color: "action" })).toBe(
        "bg-gray-700 text-white hover:bg-gray-600"
      );
      expect(buttonCn({ transparent: true })).toBe(
        "text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400 bg-transparent border shadow-none"
      );
      expect(buttonCn({ color: "action", transparent: true })).toBe(
        "text-gray-800 hover:bg-gray-50 border-gray-400 hover:border-gray-500 bg-transparent border shadow-none"
      );
    });

    it("normalizes compound variant arrays", () => {
      const truncateCn = cn<{ clamp: boolean | 1 | 2; truncate: boolean }>()
        .truncate(false)
        .clamp(false, {
          true: "line-clamp-1 overflow-hidden text-ellipsis",
          1: "line-clamp-1 overflow-hidden text-ellipsis",
          2: "line-clamp-2 overflow-hidden text-ellipsis",
          false: [{ truncate: true }, "truncate"],
        });

      expect(truncateCn()).toBe("");
      expect(truncateCn({ truncate: true })).toBe("truncate");
      expect(truncateCn({ truncate: true, clamp: 1 })).toBe(
        "line-clamp-1 overflow-hidden text-ellipsis"
      );
      expect(truncateCn({ truncate: true, clamp: 2 })).toBe(
        "line-clamp-2 overflow-hidden text-ellipsis"
      );
    });
  });

  describe("groups", () => {
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

    it("allows to compile grouped class names", () => {
      const classNameGroup = fieldCng({ size: "medium", color: "primary" });
      expect(classNameGroup.label).toBe(
        "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between gap-3"
      );
      expect(classNameGroup.content).toBe(
        "text-sm text-gray-700 font-semibold"
      );
    });
  });
});
