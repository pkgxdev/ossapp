import PackageCard from './PackageCard.svelte';
import type { Package } from '../types';

const SamplePkg: Package = {
	slug: 'mesonbuild_com',
	homepage: 'https://mesonbuild.com',
	name: 'mesonbuild.com',
	version: '0.63.3',
	last_modified: '2022-10-06T15:45:08.000Z',
	full_name: 'mesonbuild.com',
	dl_count: 270745,
	thumb_image_name: 'mesonbuild_com_option 1.jpg ',
	maintainer: '',
	desc: 'Fast and user friendly build system',
	thumb_image_url: 'https://tea.xyz/Images/packages/mesonbuild_com.jpg',
	installs: 0
};

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
export default {
	title: 'Example/PackageCard',
	component: PackageCard,
	tags: ['docsPage'],
	render: ({ pkg, link }: { pkg: Package; link: string }) => ({
		Component: PackageCard,
		props: { pkg, link }
	}),
	argTypes: {
		pkg: {
			name: 'pkg',
			description: 'type Package'
		},
		link: {
			name: 'link'
		}
	}
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Example = {
	args: {
		pkg: SamplePkg,
		link: '#'
	}
};
