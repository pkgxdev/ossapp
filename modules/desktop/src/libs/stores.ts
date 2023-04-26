import { writable } from "svelte/store";
import Fuse from "fuse.js";

import type { Package, Review, AirtablePost } from "@tea/ui/types";
import type { GUIPackage } from "$libs/types";

import { getFeaturedPackages, getPackageReviews } from "@native";
import initAuthStore from "./stores/auth";
import initNavStore from "./stores/nav";
import initPackagesStore from "./stores/pkgs";
import initNotificationStore from "./stores/notifications";
import initAppUpdateStore from "./stores/update";
import { trackSearch } from "./analytics";

export const featuredPackages = writable<Package[]>([]);

export const packagesStore = initPackagesStore();

export const initializeFeaturedPackages = async () => {
	console.log("intialize featured packages");
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

export const packagesReviewStore = initPackagesReviewStore();

function initPosts() {
	let initialized = false;
	const { subscribe } = writable<AirtablePost[]>([]);
	const posts: AirtablePost[] = [];
	let postsIndex: Fuse<AirtablePost>;

	if (!initialized) {
		initialized = true;
		// getAllPosts().then(set);
	}

	subscribe((v) => {
		posts.push(...v);
		postsIndex = new Fuse(posts, {
			keys: ["title", "sub_title", "short_description", "tags"]
		});
	});

	return {
		subscribe,
		search: async (term: string, limit = 10) => {
			const res = postsIndex.search(term, { limit });
			const matchingPosts: AirtablePost[] = res.map((v) => v.item);
			return matchingPosts;
		},
		subscribeByTag: (tag: string, cb: (posts: AirtablePost[]) => void) => {
			subscribe((newPosts: AirtablePost[]) => {
				const filteredPosts = newPosts.filter((post) => post.tags.includes(tag));
				cb(filteredPosts);
			});
		}
	};
}
export const postsStore = initPosts();

function initSearchStore() {
	const searching = writable<boolean>(false);
	const packagesSearch = writable<GUIPackage[]>([]);
	const postsSearch = writable<AirtablePost[]>([]);

	// TODO:
	// should use algolia if user is somehow online

	return {
		searching,
		packagesSearch,
		postsSearch,
		search: async (term: string) => {
			try {
				if (term) {
					const [
						resultPkgs
						// resultPosts
					] = await Promise.all([
						packagesStore.search(term, 5)
						// postsStore.search(term, 10)
					]);
					trackSearch(term, resultPkgs.length);
					packagesSearch.set(resultPkgs);
					// postsSearch.set(resultPosts);
				} else {
					packagesSearch.set([]);
					// postsSearch.set([]);
				}
			} catch (error) {
				console.error(error);
			}
		}
	};
}

export const searchStore = initSearchStore();

export const authStore = initAuthStore();

export const navStore = initNavStore();

export const notificationStore = initNotificationStore();

export const appUpdateStore = initAppUpdateStore();
