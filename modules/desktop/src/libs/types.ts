// as much possible add types here that are unique to @tea/desktop use only
// else
// 		please use the package @tea/ui/src/types.ts
//		things that go there are shared types/shapes like ie: Package

import type { Package, Developer } from "@tea/ui/types";

export enum PackageStates {
	AVAILABLE = "AVAILABLE",
	INSTALLED = "INSTALLED",
	INSTALLING = "INSTALLING",
	UNINSTALLED = "UNINSTALLED",
	NEEDS_UPDATE = "NEEDS_UPDATE"
}

export type GUIPackage = Package & {
	state: PackageStates;
	installed_versions?: string[];
	synced?: boolean;
	available_versions?: string[];
};

export type Course = {
	title: string;
	sub_title: string;
	banner_image_url: string;
	link: string;
};

export type Category = {
	label: string;
	cta_label: string;
	packages: GUIPackage[];
};

export enum AuthStatus {
	UNKNOWN = "UNKNOWN",
	PENDING = "PENDING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED"
}

export type DeviceAuth = {
	status: AuthStatus;
	user?: Developer;
	key: string;
};
export interface Session {
	device_id?: string;
	key?: string;
	user?: Developer;
	locale?: string;
}

export enum SideMenuOptions {
	all = "all",
	installed = "installed",
	installed_updates_available = "installed_updates_available",
	recently_updated = "recently_updated",
	new_packages = "new_packages",
	popular = "popular",
	featured = "featured",
	essentials = "essentials",
	star_struct = "star_struct",
	made_by_tea = "made_by_tea"
}

export type InstalledPackage = { version: string; full_name: string };
