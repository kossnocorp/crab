import { type Crab } from "./types.js";
export type { Crab };

export const cn: Crab.Factory;

export namespace cn {
  export type Props<
    Renderer extends Crab.Renderer<any> | Crab.GroupRenderer<any>
  > = Crab.InferProps<Renderer>;
}

export type CNProps<
  Renderer extends Crab.Renderer<any> | Crab.GroupRenderer<any>
> = Crab.InferProps<Renderer>;
