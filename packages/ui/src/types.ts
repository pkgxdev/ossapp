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
}
