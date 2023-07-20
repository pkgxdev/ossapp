import { writable } from "svelte/store";

import type { Package } from "$libs/types";

import initAuthStore from "./stores/auth";
import initNavStore from "./stores/nav";
import initNotificationStore from "./stores/notifications";
import initAppUpdateStore from "./stores/update";
import initScrollStore from "./stores/scroll";
import ptysStore from "./stores/ptys";
import pkgStore from "./stores/pkgs";
export * as searchStore from "./stores/search";

export const featuredPackages = writable<Package[]>([]);
export const ptys = ptysStore;
export const packagesStore = pkgStore;

export const authStore = initAuthStore();

export const navStore = initNavStore();

export const notificationStore = initNotificationStore();

export const appUpdateStore = initAppUpdateStore();

export const scrollStore = initScrollStore();
