import { type Framework, createRenderer } from "@csf-renderer/core";
import type { Dispatch, SetStateAction } from "react";
import React, { type Reducer } from "react";
import { createRoot } from "react-dom/client";
import type { ReactRenderer } from "./types.js";
export type { Meta, StoryObj, ReactRenderer } from "./types.js";

const framework: Framework<ReactRenderer> = {
  render: (renderStory, host, initArgs) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let updateState: undefined | Dispatch<SetStateAction<any>>;
    type InitArgs = typeof initArgs;
    const reducer = (s: InitArgs, next: InitArgs): InitArgs =>
      Object.assign({}, s, next);
    const root = () => {
      const [s, set] = React.useReducer<Reducer<InitArgs, InitArgs>>(
        reducer,
        initArgs,
      );
      React.useEffect(() => {
        updateState = set;
      }, []);
      // @ts-expect-error context 部分は未実装
      return renderStory(s, {});
    };
    const app = createRoot(host);
    app.render(React.createElement(root));
    return {
      updateArgs: (args) => {
        updateState?.(args);
        return Promise.resolve();
      },
      unmount: () => app.unmount(),
    };
  },
  defaultStoryRenderer: (cmp) => (args) =>
    typeof cmp === "function" ? cmp(args) : cmp,
};
export const createStoryRenderer = createRenderer(framework);

/**
 * @vitest-environment jsdom
 */
if (import.meta.vitest) {
  const { describe, test, vi, expect, beforeEach } = import.meta.vitest;
  describe("react renderer", () => {
    let div = document.createElement("div");
    beforeEach(() => {
      div = document.createElement("div");
      const old = document.querySelector("div");
      old?.parentElement?.removeChild(old);
      document.body.appendChild(div);
    });
    describe("createStoryRenderer", () => {
      describe("default render", async () => {
        const stories = await import("./defaultRender.story.js");
        const renderStory = createStoryRenderer(stories);
        test("default args", async () => {
          const story = renderStory(div, "Story1");
          await vi.waitFor(() => {
            expect(div.querySelector("p")?.textContent).toBe("Hi!");
            expect(div.querySelector("p")?.getAttribute("style")).toBe(
              "color: green;",
            );
          });
          story.unmount();
        });

        test("story args", async () => {
          const story = renderStory(div, "Story2");
          await vi.waitFor(() => {
            expect(div.querySelector("p")?.textContent).toBe("hoge");
            expect(div.querySelector("p")?.getAttribute("style")).toBe(
              "color: green;",
            );
          });
          story.unmount();
        });

        test("update args", async () => {
          const story = renderStory(div, "Story2");

          await vi.waitFor(() => {
            expect(div.querySelector("p")?.textContent).toBe("hoge");
            expect(div.querySelector("p")?.getAttribute("style")).toBe(
              "color: green;",
            );
          });

          await story.updateArgs({ msg: "piyo" });

          await vi.waitFor(() => {
            expect(div.querySelector("p")?.textContent).toBe("piyo");
            expect(div.querySelector("p")?.getAttribute("style")).toBe(
              "color: green;",
            );
          });

          story.unmount();
        });
      });
      describe("custom renderer", async () => {
        const stories = await import("./customRender.story.js");
        const renderStory = createStoryRenderer(stories);
        test("meta render", async () => {
          const story = renderStory(div, "Story1");
          await vi.waitFor(() => {
            expect(div.querySelector("p")?.textContent).toBe("meta");
            expect(div.querySelector("p")?.getAttribute("style")).toBe(
              "color: green;",
            );
          });
          story.unmount();
        });

        test("story render", async () => {
          const story = renderStory(div, "Story2");
          await vi.waitFor(() => {
            expect(div.querySelector("p")?.textContent).toBe("story");
            expect(div.querySelector("p")?.getAttribute("style")).toBe(
              "color: green;",
            );
          });
          story.unmount();
        });
      });
    });
  });
}
