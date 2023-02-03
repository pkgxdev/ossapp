import type { ComponentType } from 'svelte';
export interface Review {
	title: string;
	comment: string;
	rating: number;
	created_at?: Date | string;
}
export interface Package {
	slug: string;
	version: string;
	full_name: string;
	name: string;
	maintainer: string;
	homepage: string;
	last_modified: Date | string;
	thumb_image_url: string;
	thumb_image_name: string;
	desc: string;
	dl_count: number;
	installs: number;
	reviews?: Review[];
	// metas
	full_description?: string; // probably markdown
	bottles?: Bottle[];
	license?: string;
	size_bytes?: number;
	documentation_url?: string;
	github_repository_url?: string;
	owners?: Partial<Developer>[];
	categories?: string[];
}

export type AirtablePost = {
	airtable_record_id: string;
	title: string;
	link: string;
	sub_title: string;
	short_description: string;
	thumb_image_url: string;
	thumb_image_name: string;
	created_at: Date;
	updated_at: Date;
	published_at: Date;
	tags: string[];
};

export type Developer = {
	developer_id: string;
	avatar_url?: string;
	name: string;
	login: string;
	country?: string;
	wallet?: string;
};

export type Bottle = {
	name: string;
	platform: string;
	arch: string;
	version: string;
};

export type Tab = {
	label: string;
	props?: {
		[key: string]:
			| string
			| Date
			| number
			| Record<string, unknown>
			| Array<string>
			| Array<number>
			| Array<Date>
			| Array<Record<string, unknown>>
			| Package;
	};
	component: ComponentType;
};

export type Snippet = {
	snippet_id: string;
	created_at: Date | string;
	user: string;
	avatar_url?: string;
	stars: number;
	files: {
		name: string;
		data: string;
		language: string;
	}[];
	forks: Partial<Snippet>[];
	comments: {
		user: string;
		comment: string;
	}[];
};
