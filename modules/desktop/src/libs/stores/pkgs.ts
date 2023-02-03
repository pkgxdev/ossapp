import { writable } from 'svelte/store';
import type { GUIPackage } from '../types';
import { getPackages } from '@api';
import Fuse from 'fuse.js';

export default function initPackagesStore() {
	let initialized = false;
	const { subscribe, set } = writable<GUIPackage[]>([]);
	const packages: GUIPackage[] = [];
	let packagesIndex: Fuse<GUIPackage>;

	if (!initialized) {
		initialized = true;
		getPackages().then((pkgs) => {
			set(pkgs);
			packagesIndex = new Fuse(pkgs, {
				keys: ['name', 'full_name', 'desc']
			});
		});
	}

	subscribe((v) => packages.push(...v));

	return {
		packages,
		subscribe,
		search: async (term: string, limit = 5): Promise<GUIPackage[]> => {
			if (!term || !packagesIndex) return [];
			// TODO: if online, use algolia else use Fuse

			const res = packagesIndex.search(term, { limit });
			const matchingPackages: GUIPackage[] = res.map((v) => v.item);
			return matchingPackages;
		}
	};
}
