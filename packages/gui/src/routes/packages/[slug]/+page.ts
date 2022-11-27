import type { LoadEvent } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }: LoadEvent) {
	// TODO: search package details here
	return {
		title: `${params.slug}!`,
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
}
