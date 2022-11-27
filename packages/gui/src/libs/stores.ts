import { writable } from 'svelte/store';
import type { Package } from './types';

import { getPackages } from '@api';

export const backLink = writable<string>('/');

export const packages = writable<Package[]>([]);

export const initializePackages = async () => {
	const newPackages = await getPackages();
	packages.set(newPackages);
};
