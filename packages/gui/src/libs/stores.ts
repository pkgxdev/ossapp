import { writable } from 'svelte/store';
import type { Package, Review } from '@tea/ui/types';
import type { GUIPackage } from '$libs/types';
// TODO: figure out a better structure for managing states maybe turn them into models?

import { getPackages, getFeaturedPackages, getPackageReviews } from '@api';

export const backLink = writable<string>('/');

export const packages = writable<GUIPackage[]>([]);

export const featuredPackages = writable<Package[]>([]);

export const initializePackages = async () => {
	console.log('initialize packages');
	const newPackages = await getPackages();
	packages.set(newPackages);
};

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
	const { update, subscribe, set } = writable<string>('');

	let term: string = '';

	subscribe((v) => (term = v));

	return {
		term,
		subscribe,
		search: (term: string) => set(term)
	};
}
export const searchStore = initSearchStore();
