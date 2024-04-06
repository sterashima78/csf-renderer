import type { BaseMeta, BaseStoryObj } from "@csf-renderer/core";
import type { AllowedComponentProps, Component, VNodeProps } from "vue";

export type VueRenderer<C extends Component = Component> = {
  component: C;
  storyResult: Component;
  canvasElement: HTMLElement;
};

type ComponentProps<C extends Component> = C extends new (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ...args: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) => any
  ? Omit<
      InstanceType<C>["$props"],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never;

export type Meta<C extends Component> = BaseMeta<
  VueRenderer<C>,
  ComponentProps<C>
>;
export type StoryObj<C extends Component> = BaseStoryObj<
  VueRenderer<C>,
  ComponentProps<C>
>;
