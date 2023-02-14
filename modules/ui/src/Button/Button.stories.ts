import Button from "./ButtonView.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
export default {
	title: "Example/Button",
	component: Button,
	tags: ["docsPage"],
	render: (args) => ({
		Component: Button,
		props: args
	}),
	argTypes: {
		onClick: () => console.log("does nothing")
	}
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Primary = {};
