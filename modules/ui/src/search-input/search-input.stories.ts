import SearchInput from "./SearchInput.svelte";

export default {
	title: "Example/SearchInput",
	component: SearchInput,
	// This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/svelte/writing-docs/docs-page
	tags: [],
	render: (args) => ({
		Component: SearchInput,
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

export const Small = {
	args: {
		user: {
			name: "Jane Doe"
		}
	}
};

export const Big = {};
