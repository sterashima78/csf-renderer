import { type ReactNode, createElement as h } from "react";
import type { Meta, StoryObj } from "./types.js";

type Args = {
  color: string;
  children?: ReactNode;
};
const Comp = (props: Args) =>
  h("p", { style: { color: props.color } }, [props.children]);

export default {
  component: Comp,
  args: {
    color: "green",
  },
  render: (args) => h(Comp, { color: args.color }, ["meta"]),
} satisfies Meta<typeof Comp>;

export const Story1: StoryObj<typeof Comp> = {};
export const Story2: StoryObj<typeof Comp> = {
  render: (args) => h(Comp, { color: args.color }, ["story"]),
};
