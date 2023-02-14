import ArticleCard from "./ArticleCard.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
export default {
	title: "Example/ArticleCard",
	component: ArticleCard,
	tags: ["docsPage"],
	render: ({ content }) => ({
		Component: ArticleCard,
		props: { content }
	}),
	argTypes: {
		content: {
			name: "content",
			description: "this is type Article"
		},
		onClick: {
			name: "onClick",
			description: "this is optional function"
		}
	}
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Example = {
	args: {
		content: {
			title: "installing tea",
			copy: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis.",
			img_url: "https://tea.xyz/Images/packages/unicode_org.jpg",
			cta_label: "Get Started",
			link: "/cli"
		}
	}
};
