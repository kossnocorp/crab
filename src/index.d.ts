import { type Crab } from "./types.js";
export type { Crab };

export const cn: Crab.Factory;

export type CNProps<
  Renderer extends Crab.Renderer<any> | Crab.GroupRenderer<any>
> = Crab.InferProps<Renderer>;
