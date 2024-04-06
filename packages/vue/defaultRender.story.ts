import { defineComponent, h } from "vue";
import type { Meta, StoryObj } from "./types.js";

const Comp = defineComponent({
  props: {
    color: {
      type: String,
      default: "red",
    },
    msg: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return () => h("p", { style: { color: props.color } }, [props.msg]);
  },
});

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
