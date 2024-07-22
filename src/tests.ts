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
      const iconCn = cn
        .var<{ color: Color; trigger: boolean }>("inline-flex")
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
      const iconCn = cn
        .var<{ color: Color; trigger: boolean }>("inline-flex")
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

    it("allows to omit the base class", () => {
      const iconCn = cn
        .var<{ color: Color; trigger: boolean }>()
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
      const iconCn = cn
        .var<{ color: Color; trigger: boolean }>()
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
  });
});
