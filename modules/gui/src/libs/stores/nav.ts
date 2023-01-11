import { writable } from 'svelte/store';

export default function initNavStore() {
	const backLink = writable<string>('/');

	return {
		backLink,
		set: (newlink: string) => backLink.set(newlink)
	};
}
