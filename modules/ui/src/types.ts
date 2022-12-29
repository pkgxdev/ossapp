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
	bottles?: number; // TODO: where to get this?
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

export type Bottle = {
	name: string;
	platform: string;
	arch: string;
	version: string;
};
