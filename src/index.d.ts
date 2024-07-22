import { type Crab } from "./types.js";
export type { Crab };

export const cn: Crab.Factory;

export type CNProps<Renderer extends Crab.Renderer<Crab.VariantsConstrain>> =
  Renderer extends Crab.Renderer<infer Variants> ? Partial<Variants> : never;
