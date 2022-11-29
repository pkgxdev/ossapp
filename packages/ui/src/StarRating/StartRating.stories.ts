import StarRating from './StarRating.svelte';

export default {
	title: 'Example/StarRating',
	component: StarRating,
	// This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/svelte/writing-docs/docs-page
	tags: [],
	render: (args) => ({
		Component: StarRating,
		props: args
	}),
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/7.0/svelte/configure/story-layout
		// layout: 'fullscreen'
	},
	argTypes: {
		// onLogin: { action: 'onLogin' },
		// onLogout: { action: 'onLogout' },
		// onCreateAccount: { action: 'onCreateAccount' }
	}
};

export const Example = {
	args: {}
};
