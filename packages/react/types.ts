import type { BaseArgs, BaseMeta, BaseStoryObj } from "@csf-renderer/core";
import type { FC, ReactNode } from "react";
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type DefaultFC = FC<any>;
export type ReactRenderer<C extends DefaultFC = DefaultFC> = {
  component: C;
  storyResult: ReactNode;
  canvasElement: HTMLElement;
  T: C extends FC<infer A extends BaseArgs> ? A : unknown;
};
export type Meta<C extends DefaultFC = DefaultFC> = BaseMeta<
  ReactRenderer<C>,
  C extends FC<infer A extends BaseArgs> ? A : BaseArgs
>;
export type StoryObj<C extends DefaultFC = DefaultFC> = BaseStoryObj<
  ReactRenderer<C>,
  C extends FC<infer A extends BaseArgs> ? A : BaseArgs
>;
