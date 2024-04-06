import type {
  Args,
  ComponentAnnotations,
  Renderer,
  StoryAnnotations,
} from "@storybook/csf";
import type { MakeRequired } from "./utils.js";
export type BaseArgs = Args;
export type BaseRenderer = Renderer;
/**
 * Story のメタデータに相当
 */
export type BaseMeta<
  R extends Renderer = Renderer,
  A extends Args = Args,
> = Pick<
  MakeRequired<ComponentAnnotations<R, A>, "component">,
  "component" | "args" | "render"
>;

/**
 * Story に相当
 */
export type BaseStoryObj<
  R extends Renderer = Renderer,
  A extends Args = Args,
> = Pick<StoryAnnotations<R, A>, "args" | "render">;

/**
 * CSF 3 で記述された Story のモジュールに相当
 */
export type CSFModule<R extends Renderer = Renderer, A extends Args = Args> = {
  default: BaseMeta<R, A>;
} & {
  [storyName: string]: BaseStoryObj<R, A>;
};
