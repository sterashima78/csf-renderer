import { createElement as h } from "react";
import type { Meta, StoryObj } from "./types.js";

type Props = {
  color: string;
  msg: string;
};
const Comp = (props: Props) =>
  h("p", { style: { color: props.color } }, [props.msg]);

export default {
  component: Comp,
  args: {
    color: "green",
    msg: "Hi!",
  },
} satisfies Meta<typeof Comp>;

export const Story1: StoryObj<typeof Comp> = {};
export const Story2: StoryObj<typeof Comp> = {
  args: {
    msg: "hoge",
  },
};
