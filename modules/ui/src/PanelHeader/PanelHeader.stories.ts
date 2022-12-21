import PanelHeader from './PanelHeader.svelte';

export default {
	title: 'Example/PanelHeader',
	component: PanelHeader,
	render: (props) => ({
		Component: PanelHeader,
		props
	})
};

// More on interaction testing: https://storybook.js.org/docs/7.0/svelte/writing-tests/interaction-testing
export const Example = {
	args: {
		title: 'Open-Source News',
		ctaLabel: 'Read More News >',
		ctaLink: '/'
	}
};
