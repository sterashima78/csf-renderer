import type { Args, BaseAnnotations } from "@storybook/csf";
import type { BaseArgs, BaseRenderer, CSFModule } from "./csf.js";
export type { BaseMeta, BaseStoryObj, BaseArgs } from "./csf.js";
/**
 * 特定のライブラリ・フレームワークに相当 (React / Vue など)
 */
export type Framework<R extends BaseRenderer = BaseRenderer> = {
  /**
   * 特定の Story をレンダリングする
   */
  render: <A extends Args = Args>(
    /**
     * 特定の Story の render に相当
     */
    storyRenderer: NonNullable<BaseAnnotations<R, Partial<A>>["render"]>,
    /**
     * Story をレンダリングするルート要素
     */
    host: R["canvasElement"],
    /**
     * 初期引数
     */
    initArgs: Partial<A>,
  ) => {
    updateArgs: (args: Partial<A>) => Promise<void>;
    unmount: () => void;
  };
  /**
   * 入力されたコンポーネントをレンダリングする実装
   */
  defaultStoryRenderer: <Cmp extends R["component"]>(
    cmp: Cmp,
  ) => <A extends Args = Args>(args: A) => R["storyResult"];
};

/**
 * CSFModule から Args を取り出す
 */
type ArgsFromMeta<
  R extends BaseRenderer,
  T extends CSFModule<R>,
> = T extends CSFModule<R, infer U> ? U : unknown;

/**
 * 各ライブラリ・フレームワークの csf-renderer を作る
 */
export const createRenderer =
  <R extends BaseRenderer = BaseRenderer>(f: Framework<R>) =>
  <M extends CSFModule<R>>(mod: M) =>
  <K extends Exclude<keyof M, "default">>(
    host: R["canvasElement"],
    story: K,
  ) => {
    const { default: meta, ...stories } = mod;
    const targetStory = stories[story];
    const render =
      targetStory.render ??
      meta.render ??
      f.defaultStoryRenderer(meta.component);
    const initArgs = {
      ...(meta.args ?? {}),
      ...(targetStory.args ?? {}),
    };
    const renderedStory = f.render(render, host, initArgs);
    return {
      updateArgs: (args: ArgsFromMeta<R, M>) => renderedStory.updateArgs(args),
      unmount: () => renderedStory.unmount(),
    };
  };
