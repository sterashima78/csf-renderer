import { type Framework, createRenderer } from "@csf-renderer/core";
import { createApp, defineComponent, h, nextTick, reactive } from "vue";
import type { VueRenderer } from "./types.js";

const framework: Framework<VueRenderer> = {
  render: (renderStory, host, initArgs) => {
    const reactiveArgs = reactive(initArgs);
    // @ts-expect-error reactive なので型が合わない
    const app = createApp(renderStory(reactiveArgs, {}));
    app.mount(host);
    return {
      updateArgs: (args) => {
        Object.assign(reactiveArgs, args);
        return nextTick();
      },
      unmount: () => app.unmount(),
    };
  },
  defaultStoryRenderer: (cmp) => (args) =>
    defineComponent({
      setup() {
        return () => h(cmp, args);
      },
    }),
};

export const createStoryRenderer = createRenderer(framework);

/**
 * @vitest-environment jsdom
 */
if (import.meta.vitest) {
  const { describe, test, vi, expect } = import.meta.vitest;
  describe("vue renderer", () => {
    describe("createStoryRenderer", () => {
      describe("default render", async () => {
        const stories = await import("./defaultRender.story.js");
        const renderStory = createStoryRenderer(stories);
        test("default args", async () => {
          const story = renderStory(document.body, "Story1");
          await vi.waitFor(() => {
            expect(document.body.querySelector("p")?.textContent).toBe("Hi!");
            expect(
              document.body.querySelector("p")?.getAttribute("style"),
            ).toBe("color: green;");
          });
          story.unmount();
        });

        test("story args", async () => {
          const story = renderStory(document.body, "Story2");
          await vi.waitFor(() => {
            expect(document.body.querySelector("p")?.textContent).toBe("hoge");
            expect(
              document.body.querySelector("p")?.getAttribute("style"),
            ).toBe("color: green;");
          });
          story.unmount();
        });

        test("update args", async () => {
          const story = renderStory(document.body, "Story2");

          await vi.waitFor(() => {
            expect(document.body.querySelector("p")?.textContent).toBe("hoge");
            expect(
              document.body.querySelector("p")?.getAttribute("style"),
            ).toBe("color: green;");
          });

          await story.updateArgs({ msg: "piyo" });

          await vi.waitFor(() => {
            expect(document.body.querySelector("p")?.textContent).toBe("piyo");
            expect(
              document.body.querySelector("p")?.getAttribute("style"),
            ).toBe("color: green;");
          });
          story.unmount();
        });
      });
      describe("custom renderer", async () => {
        const stories = await import("./customRender.story.js");
        const renderStory = createStoryRenderer(stories);
        test("meta render", async () => {
          const story = renderStory(document.body, "Story1");
          await vi.waitFor(() => {
            expect(document.body.querySelector("p")?.textContent).toBe("meta");
            expect(
              document.body.querySelector("p")?.getAttribute("style"),
            ).toBe("color: green;");
          });
          story.unmount();
        });

        test("story render", async () => {
          const story = renderStory(document.body, "Story2");
          await vi.waitFor(() => {
            expect(document.body.querySelector("p")?.textContent).toBe("story");
            expect(
              document.body.querySelector("p")?.getAttribute("style"),
            ).toBe("color: green;");
          });
          story.unmount();
        });
      });
    });
  });
}
