/**
 * this is the main api integration, anything added here
 * should be mock replicated in ./mock.ts
 *  why? to make it easier to verify features without us always
 *    going through
 *      the build->download->install->test loop
 *      thus saving us so much time
 *
 * primary concerns here are any method that does the following:
 *  - connect to remote api(api.tea.xyz) and returns a data
 *  - connect to a local platform api and returns a data
 */
import axios from "axios";

import type { Package, Review, AirtablePost, Bottle } from "@tea/ui/types";
import type { GUIPackage, Course, Category, DeviceAuth } from "../types";

import * as mock from "./mock";
import { PackageStates } from "../types";
import { getInstalledPackages } from "$libs/tea-dir";
import { installPackageCommand } from "$libs/cli";

import { get as apiGet } from "$libs/v1-client";
import { packages } from "./mock";
export async function getPackages(): Promise<GUIPackage[]> {
	// const [packages, installedPackages] = await Promise.all([
	// 	mockPackages,
	// 	getInstalledPackages()
	// ]);

	return (packages || []).map((pkg) => {
		const found = false;
		return {
			...pkg,
			state: found ? PackageStates.INSTALLED : PackageStates.AVAILABLE,
			installed_version: ""
		};
	});
}

export async function getFeaturedPackages(): Promise<Package[]> {
	const packages = await mock.getFeaturedPackages();
	return packages;
}

export async function getPackageReviews(full_name: string): Promise<Review[]> {
	console.log(`getting reviews for ${full_name}`);
	const reviews: Review[] = await apiGet<Review[]>(
		`packages/${full_name.replaceAll("/", ":")}/reviews`
	);

	return reviews;
}

export async function installPackage(full_name: string) {
	try {
		await installPackageCommand(full_name);
	} catch (error) {
		console.error(error);
	}
}

export async function getFeaturedCourses(): Promise<Course[]> {
	const mockCourses: Course[] = [
		{
			title: "Developing With Tea",
			sub_title: "by Mxcl",
			link: "#",
			banner_image_url: "https://tea.xyz/Images/packages/mesonbuild_com.jpg"
		},
		{
			title: "Brewing Tea",
			sub_title: "by Mxcl",
			link: "#",
			banner_image_url: "https://tea.xyz/Images/packages/tea_xyz_gx_cc.jpg"
		},
		{
			title: "Harvesting Tea",
			sub_title: "by Mxcl",
			link: "#",
			banner_image_url: "https://tea.xyz/Images/packages/ipfs_tech.jpg"
		}
	];
	return mockCourses;
}

export async function getTopPackages(): Promise<GUIPackage[]> {
	const packages = await mock.getTopPackages();
	return packages;
}

export async function getAllPosts(tag?: string): Promise<AirtablePost[]> {
	console.log("filter by type:", type);
	const posts: AirtablePost[] = [
		{
			airtable_record_id: "a",
			link: "https://google.com",
			title: "Tea Inc releases game changing api!",
			sub_title: "lorem ipsum dolor sit amet",
			short_description: "lorem ipsum dolor sit amet",
			thumb_image_url: "/images/bored-ape.png",
			thumb_image_name: "borred-api.png",
			created_at: new Date(),
			updated_at: new Date(),
			published_at: new Date(),
			tags: ["news"]
		},
		{
			airtable_record_id: "b",
			link: "https://google.com",
			title: "Bored Ape not bored anymore",
			sub_title: "lorem ipsum dolor sit amet",
			short_description: "lorem ipsum dolor sit amet",
			thumb_image_url: "/images/bored-ape.png",
			thumb_image_name: "borred-api.png",
			created_at: new Date(),
			updated_at: new Date(),
			published_at: new Date(),
			tags: ["news"]
		},
		{
			airtable_record_id: "c",
			link: "https://google.com",
			title: "Markdown can be executed! hoohah!",
			sub_title: "lorem ipsum dolor sit amet",
			short_description: "lorem ipsum dolor sit amet",
			thumb_image_url: "/images/bored-ape.png",
			thumb_image_name: "borred-api.png",
			created_at: new Date(),
			updated_at: new Date(),
			published_at: new Date(),
			tags: ["news"]
		}
	];

	return posts;
}

export async function getCategorizedPackages(): Promise<Category[]> {
	const categories = await apiGet<Category[]>("/packages/categorized");
	return categories;
}

export async function getDeviceAuth(deviceId: string): Promise<DeviceAuth> {
	const data = await apiGet<DeviceAuth>(`/auth/device/${deviceId}`);
	return data;
}

export async function getPackageBottles(packageName: string): Promise<Bottle[]> {
	console.log("getting bottles for ", packageName);
	// const pkg: Package = await apiGet<Package>(`packages/${packageName.replaceAll("/", ":")}`);
	return [
		{
			name: "string",
			platform: "darwin",
			arch: "aarm64",
			version: "v1.2.3",
			bytes: 123123123,
			last_modified_at: new Date()
		}
	];
}

export async function getPackage(packageName: string): Promise<Partial<Package>> {
	const pkg: Partial<Package> = await apiGet<Partial<Package>>(
		`packages/${packageName.replaceAll("/", ":")}`
	);
	return pkg;
}

export async function registerDevice(): Promise<string> {
	const { deviceId } = await apiGet<{ deviceId: string }>("/auth/registerDevice");
	return deviceId;
}
