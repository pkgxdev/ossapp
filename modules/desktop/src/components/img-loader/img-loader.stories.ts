import ImgLoader from "./ImgLoader.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction

interface Props {
  alt: string;
  src: string;
  class: string;
}
export default {
  title: "Example/ImgLoader",
  component: ImgLoader,
  tags: ["docsPage"],
  render: (props: Props) => ({
    Component: ImgLoader,
    props
  }),
  argTypes: {}
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Example = {
  args: {
    class: "w-1/2",
    alt: "sample",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/%22_Shot_From_The_Sky%22_Army_Show_1945_Oak_Ridge_%2824971013612%29.jpg/2732px-%22_Shot_From_The_Sky%22_Army_Show_1945_Oak_Ridge_%2824971013612%29.jpg"
  }
};
