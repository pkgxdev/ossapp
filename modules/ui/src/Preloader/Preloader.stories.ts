import Preloader from "./Preloader.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
export default {
  title: "Example/Preloader",
  component: Preloader,
  tags: ["docsPage"],
  render: () => ({
    Component: Preloader
  })
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Example = {};
