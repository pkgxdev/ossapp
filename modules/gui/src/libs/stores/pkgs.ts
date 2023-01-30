import { writable } from 'svelte/store';
import type { Review } from '@tea/ui/types';
import { getPackageReviews } from '@api';

interface PackagesReview {
	[full_name: string]: Review[];
}

export default function initPackagesReviewStore() {
	const { update, subscribe } = writable<PackagesReview>({});

	let packagesReviews: PackagesReview = {};

	subscribe((v) => (packagesReviews = v));

	const getSetPackageReviews = async (full_name: string) => {
		if (full_name && !packagesReviews[full_name]) {
			packagesReviews[full_name] = [];
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
