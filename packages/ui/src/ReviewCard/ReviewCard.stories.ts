import ReviewCard from './ReviewCard.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
export default {
	title: 'Example/ReviewCard',
	component: ReviewCard,
	tags: ['docsPage'],
	render: ({ review }) => ({
		Component: ReviewCard,
		props: { review }
	}),
	argTypes: {
		review: {
			name: 'review',
			description: 'this is type Review'
		}
	}
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Example = {
	args: {
		review: {
			title: 'installing tea',
			comment:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptatum molestiae esse quisquam earum debitis.',
			rating: 2
		}
	}
};
