/**
 * Root Crab namespace. It contains all the Crab types.
 */
export namespace Crab {
  /**
   * Main factory function.
   */
  export interface Factory {
    (className: InlineClassName, ...classNames: InlineClassName[]): string;

    <
      Variants extends VariantsConstraint | undefined = undefined
    >(): BaseBuilder<Variants>;
  }

  /**
   * Infers props type for the renderer.
   */
  export type InferProps<
    Renderer extends Crab.Renderer<any> | GroupRenderer<any>
  > = Renderer extends (props?: infer Variants) => any
    ? Omit<Variants, "className">
    : never;

  /**
   * Inline class name value.
   */
  export type InlineClassName = string | undefined | null | false;

  /**
   * Base builder object. It includes the base method that allows to define the
   * base class name and the group method that allows to define the class name
   * groups.
   */
  export type BaseBuilder<Variants extends VariantsConstraint | undefined> =
    Builder<Variants> & {
      base: (base: string) => Builder<Variants>;

      group: <Group extends GroupConstraint>(
        factory: GroupFactory<Variants, Group>
      ) => GroupRenderer<Group>;
    };

  /**
   * Builder object, which is returned by the factory function. It allows to
   * define the class name variants.
   */
  export type Builder<
    Variants extends VariantsConstraint | undefined,
    RemainVariants extends keyof Variants = keyof Variants
  > = Variants extends VariantsConstraint
    ? {
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
      }
    : Renderer<Variants>;

  /**
   * Function that renders class names.
   */
  export type Renderer<Variants extends VariantsConstraint | undefined> = (
    props?: RendererProps<Variants>
  ) => string;

  /**
   * Renderer function props.
   */
  export type RendererProps<Variants extends VariantsConstraint | undefined> =
    (undefined extends Variants ? {} : PartialUndefined<Variants>) & {
      className?: string;
    };

  /**
   * Compound definition
   */
  export type Compound<Variants extends VariantsConstraint> =
    | CompoundTuple<Variants>
    | CompoundMap<Variants>;

  /**
   * Compound tuple definition
   */
  export type CompoundTuple<Variants extends VariantsConstraint> = [
    combination: { [Variant in keyof Variants]?: Variants[Variant] },
    classNames: string
  ];

  /**
   * Compound map definition
   */
  export type CompoundMap<Variants extends VariantsConstraint> = {
    [Key in keyof Variants]?: {
      [Value in StringifyValue<Variants[Key]>]?: string;
    };
  };

  /**
   * Variants map constraint.
   */
  export type VariantsConstraint = Record<string, VariantValueConstraint>;

  /**
   * Variant value constraint.
   */
  export type VariantValueConstraint = string | number | boolean;

  /**
   * Stringifies variant value.
   */
  export type StringifyValue<Value extends VariantValueConstraint> =
    Value extends string
      ? Value
      : Value extends number
      ? `${Value}`
      : Value extends boolean
      ? true extends Value
        ? "true"
        : "false"
      : never;

  /**
   * Groups factory function.
   */
  export interface GroupFactory<
    GroupVartiants extends VariantsConstraint | undefined,
    Group extends GroupConstraint
  > {
    (helper: GroupHelper<GroupVartiants>): Group;
  }

  /**
   * Groups helper object.
   */
  export interface GroupHelper<
    GroupVartiants extends VariantsConstraint | undefined
  > {
    <Variants>(): BaseBuilder<GroupVartiants & Variants>;

    base: (base: string) => Builder<GroupVartiants>;
  }

  /**
   * Group renderer.
   */
  export type GroupRenderer<Group extends GroupConstraint> = (
    props?: GroupProps<Group>
  ) => GroupRendered<Group>;

  /**
   * Group props.
   */
  export type GroupProps<Group extends GroupConstraint> = UnionToIntersection<
    Group[keyof Group] extends Renderer<infer Variants>
      ? Partial<Variants>
      : never
  >;

  /**
   * Group rendered object.
   */
  export type GroupRendered<Group extends GroupConstraint> = {
    [Key in keyof Group]: string;
  };

  /**
   * Group constraint.
   */
  export type GroupConstraint = Record<string, Renderer<VariantsConstraint>>;

  /**
   * Converts union to an intersection.
   * See: https://stackoverflow.com/a/50375286/75284
   */
  export type UnionToIntersection<Union> = (
    Union extends any ? (x: Union) => void : never
  ) extends (x: infer X) => void
    ? X
    : never;

  /**
   * Partial with undefined as acceptable values.
   */
  export type PartialUndefined<Type> = {
    [Key in keyof Type]?: Type[Key] | undefined;
  };
}
