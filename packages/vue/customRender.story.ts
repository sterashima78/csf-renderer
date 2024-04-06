import { defineComponent, h, useSlots } from "vue";
import type { Meta, StoryObj } from "./types.js";

const Comp = defineComponent({
  props: {
    color: {
      type: String,
      default: "red",
    },
  },
  setup(props) {
    const slot = useSlots();
    return () => h("p", { style: { color: props.color } }, [slot.default?.()]);
  },
});

export default {
  component: Comp,
  args: {
    color: "green",
  },
  render: (args) =>
    defineComponent({
      components: {
        Comp,
      },
      setup() {
        return () => h(Comp, { color: args.color }, () => ["meta"]);
      },
    }),
} satisfies Meta<typeof Comp>;

export const Story1: StoryObj<typeof Comp> = {};
export const Story2: StoryObj<typeof Comp> = {
  render: (args) =>
    defineComponent({
      components: {
        Comp,
      },
      setup() {
        return () => h(Comp, { color: args.color }, () => ["story"]);
      },
    }),
};
