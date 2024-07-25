/**
 * Root Crab namespace. It contains all the Crab types.
 */
export namespace Crab {
  /**
   * Main factory function.
   */
  export interface Factory {
    (className: InlineClassName, ...classNames: InlineClassName[]): string;

    <Variants extends VariantsConstrain>(): BaseBuilder<Variants>;
  }

  /**
   * Inline class name value.
   */
  export type InlineClassName = string | undefined | null | false;

  /**
   * Base builder object. It includes the base method that allows to define the
   * base class name.
   */
  export type BaseBuilder<Variants extends VariantsConstrain> =
    Builder<Variants> & {
      base: (base: string) => Builder<Variants>;
    };

  /**
   * Builder object, which is returned by the factory function. It allows to
   * define the class name variants.
   */
  export type Builder<
    Variants extends VariantsConstrain,
    RemainVariants extends keyof Variants = keyof Variants
  > = {
    [Variant in RemainVariants]: (
      initial: Variants[Variant],
      map?:
        | {
            [Value in StringifyValue<Variants[Variant]>]?:
              | string
              | [string, ...Compound<Variants>[]]
              | Compound<Variants>
              | Compound<Variants>[];
          }
        | undefined
    ) => Exclude<RemainVariants, Variant> extends never
      ? Renderer<Variants>
      : Builder<Variants, Exclude<RemainVariants, Variant>>;
  };

  /**
   * Function that renders class names.
   */
  export type Renderer<Variants extends VariantsConstrain> = (
    props?: RendererProps<Variants>
  ) => string;

  /**
   * Renderer function props.
   */
  export type RendererProps<Variants extends VariantsConstrain> =
    Partial<Variants> & {
      className?: string;
    };

  /**
   * Compound definition
   */
  export type Compound<Variants extends VariantsConstrain> = [
    combination: { [Variant in keyof Variants]?: Variants[Variant] },
    classNames: string
  ];

  /**
   * Variants map constrain.
   */
  export type VariantsConstrain = Record<string, VariantValueConstrain>;

  /**
   * Variant value constrain.
   */
  export type VariantValueConstrain = string | number | boolean;

  /**
   * Stringifies variant value.
   */
  export type StringifyValue<Value extends VariantValueConstrain> =
    Value extends string
      ? Value
      : Value extends number
      ? `${Value}`
      : Value extends boolean
      ? true extends Value
        ? "true"
        : "false"
      : never;
}
