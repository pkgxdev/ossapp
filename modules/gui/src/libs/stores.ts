import { writable } from 'svelte/store';
import Fuse from 'fuse.js';

import type { Package, Review } from '@tea/ui/types';
import type { GUIPackage } from '$libs/types';
// TODO: figure out a better structure for managing states maybe turn them into models?

import { getPackages, getFeaturedPackages, getPackageReviews } from '@api';

export const backLink = writable<string>('/');

export const featuredPackages = writable<Package[]>([]);

function initPackagesStore() {
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

export const packagesStore = initPackagesStore();

export const initializeFeaturedPackages = async () => {
	console.log('initialzie featured packages');
	const packages = await getFeaturedPackages();
	featuredPackages.set(packages);
};

interface PackagesReview {
	[full_name: string]: Review[];
}

function initPackagesReviewStore() {
	const { update, subscribe } = writable<PackagesReview>({});

	let packagesReviews: PackagesReview = {};

	subscribe((v) => (packagesReviews = v));

	const getSetPackageReviews = async (full_name: string) => {
		if (full_name && !packagesReviews[full_name]) {
			console.log('getting reviews for', full_name);
			const reviews = await getPackageReviews(full_name);
			update((v) => {
				return {
					...v,
					[full_name]: reviews
				};
			});
		}
	};

	return {
		subscribe: (full_name: string, reset: (reviews: Review[]) => void) => {
			getSetPackageReviews(full_name);
			return subscribe((value) => {
				if (value[full_name]) {
					reset(value[full_name]);
				}
			});
		}
	};
}

export const packagesReviewStore = initPackagesReviewStore();

function initSearchStore() {
	const { subscribe, set } = writable<string>('');
	const packagesSearch = writable<GUIPackage[]>([]);

	// TODO:
	// add fuse.js index here: packages, articles/posts, etc
	// define fuse.js shape { tags:[], desc:string, title: string, thumb_image_url: string }
	// should use algolia if user is somehow online

	const packagesFound: GUIPackage[] = [];

	let term = '';

	subscribe((v) => (term = v));
	packagesSearch.subscribe((v) => packagesFound.push(...v));

	return {
		term,
		packagesSearch,
		packagesFound,
		subscribe,
		search: async (term: string) => {
			const resultPkgs = await packagesStore.search(term, 5);
			packagesSearch.set(resultPkgs);
			set(term);
		}
	};
}

export const searchStore = initSearchStore();
