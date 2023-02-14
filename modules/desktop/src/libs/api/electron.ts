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
import axios from 'axios';

import type { Package, Review, AirtablePost, Bottle } from '@tea/ui/types';
import type { GUIPackage, Course, Category, DeviceAuth } from '../types';

import * as mock from './mock';
import { PackageStates } from '../types';
import { getInstalledPackages } from '$libs/teaDir';
import { installPackageCommand } from '$libs/cli';

import { get as apiGet } from '$libs/v1Client';

export async function getPackages(): Promise<GUIPackage[]> {
	const [packages, installedPackages] = await Promise.all([
		apiGet<Package[]>('packages', { nocache: 'true' }),
		getInstalledPackages()
	]);

	return (packages || []).map((pkg) => {
		const found = installedPackages.find((p) => p.full_name === pkg.full_name);
		return {
			...pkg,
			state: found ? PackageStates.INSTALLED : PackageStates.AVAILABLE,
			installed_version: found ? found.version : ''
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
		`packages/${full_name.replaceAll('/', ':')}/reviews`
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
	const posts = await apiGet<AirtablePost[]>('posts', { tag: 'featured_course' });
	return posts.map((post) => {
		return {
			title: post.title,
			sub_title: post.sub_title,
			banner_image_url: post.thumb_image_url,
			link: post.link
		} as Course;
	});
}

export async function getTopPackages(): Promise<GUIPackage[]> {
	const packages = await mock.getTopPackages();
	return packages;
}

export async function getAllPosts(tag?: string): Promise<AirtablePost[]> {
	// add filter here someday: tag = news | course
	const queryParams = {
		...(tag ? { tag } : {}),
		nocache: 'true'
	};
	const posts = await apiGet<AirtablePost[]>('posts', queryParams);
	console.log(posts);
	return posts;
}

export async function getCategorizedPackages(): Promise<Category[]> {
	const categories = await apiGet<Category[]>('/packages/categorized');
	return categories;
}

export async function getDeviceAuth(deviceId: string): Promise<DeviceAuth> {
	const data = await apiGet<DeviceAuth>(`/auth/device/${deviceId}`);
	return data;
}

export async function getPackageBottles(packageName: string): Promise<Bottle[]> {
	console.log('getting bottles for ', packageName);
	const pkg: Package = await apiGet<Package>(`packages/${packageName.replaceAll('/', ':')}`);
	return pkg.bottles || [];
}

export async function getPackage(packageName: string): Promise<Partial<Package>> {
	const pkg: Partial<Package> = await apiGet<Partial<Package>>(
		`packages/${packageName.replaceAll('/', ':')}`
	);
	return pkg;
}

export async function registerDevice(): Promise<string> {
	const { deviceId } = await apiGet<{ deviceId: string }>('/auth/registerDevice');
	return deviceId;
}
