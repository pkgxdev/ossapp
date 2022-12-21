// as much possible add types here that are unique to @tea/gui use only
// else
// 		please use the package @tea/ui/src/types.ts
//		things that go there are shared types/shapes like ie: Package

import type { Package } from '@tea/ui/types';

export enum PackageStates {
	AVAILABLE,
	INSTALLED,
	INSTALLING,
	UNINSTALLED
}

export type GUIPackage = Package & {
	state: PackageStates;
	installed_version?: string;
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
