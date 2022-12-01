import { writable } from 'svelte/store';
import type { Package, Review } from '@tea/ui/types';

// TODO: figure out a better structure for managing states maybe turn them into models?

import { getPackages, getFeaturedPackages, getPackageReviews } from '@api';

export const backLink = writable<string>('/');

export const packages = writable<Package[]>([]);

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
	const { set, update, subscribe } = writable<PackagesReview>({});

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
