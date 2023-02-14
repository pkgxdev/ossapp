import Gallery from "./Gallery.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
export default {
	title: "Example/Gallery",
	component: Gallery,
	tags: ["docsPage"],
	render: (args) => ({
		Component: Gallery,
		props: args
	}),
	argTypes: {
		onClick: () => console.log("does nothing")
	}
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Example = {
	args: {
		items: [
			{
				imageUrl:
					"https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/%22_Shot_From_The_Sky%22_Army_Show_1945_Oak_Ridge_%2824971013612%29.jpg/2732px-%22_Shot_From_The_Sky%22_Army_Show_1945_Oak_Ridge_%2824971013612%29.jpg",
				title: "Item 1",
				subTitle: "sub-title",
				link: "#"
			},
			{
				imageUrl: "https://tea.xyz/Images/packages/sqlite_org.jpg",
				title: "Item 2",
				subTitle: "sub-title 2",
				link: "#"
			},
			{
				imageUrl: "https://tea.xyz/Images/packages/gnu_org_libtool.jpg",
				title: "Item 3",
				subTitle: "sub-title 3",
				link: "#"
			}
		]
	}
};
