import { writable } from 'svelte/store';
import type { Package } from './types';

import { getPackages } from '@api';

export const backLink = writable<string>('/');

export const packages = writable<Package[]>([]);

export const initializePackages = async () => {
	console.log("getting packages");
	const newPackages = await getPackages();
	console.log("got packages", newPackages);
	packages.set(newPackages);
};
