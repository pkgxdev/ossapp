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

import semverCompare from "semver/functions/compare";
import type { Package, Review, AirtablePost, Bottle } from "@tea/ui/types";
import type { GUIPackage, Course, Category, DeviceAuth, Session } from "./types";

import * as mock from "./native-mock";
import { PackageStates } from "./types";
import { installPackageCommand } from "./native/cli";

import { get as apiGet } from "$libs/v1-client";

const { ipcRenderer, shell } = window.require("electron");

export async function getPackages(): Promise<GUIPackage[]> {
	const [packages, installedPackages] = await Promise.all([
		apiGet<Package[]>("packages", { nocache: "true" }),
		ipcRenderer.invoke("get-installed-packages") as { version: string; full_name: string }[]
	]);

	// sorts all packages from highest -> lowest
	installedPackages.sort((a, b) => semverCompare(b.version, a.version));

	return (packages || []).map((pkg) => {
		const installedVersions = installedPackages
			.filter((p) => p.full_name === pkg.full_name)
			.map((p) => p.version);
		return {
			...pkg,
			state: installedVersions.length ? PackageStates.INSTALLED : PackageStates.AVAILABLE,
			installed_versions: installedVersions
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
	const posts = await apiGet<AirtablePost[]>("posts", { tag: "featured_course" });
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
		nocache: "true"
	};
	const posts = await apiGet<AirtablePost[]>("posts", queryParams);
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
	const pkg: Package = await apiGet<Package>(`packages/${packageName.replaceAll("/", ":")}`);
	return pkg.bottles || [];
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

export const getSession = async (): Promise<Session | null> => {
	const session = await ipcRenderer.invoke("get-session");
	return session;
};

export const updateSession = async (session: Partial<Session>) => {
	await ipcRenderer.invoke("update-session", session);
};

export const openTerminal = (cmd: string) => ipcRenderer.invoke("open-terminal", { cmd });

export const shellOpenExternal = (link: string) => shell.openExternal(link);

export const listenToChannel = (channel: string, callback: (msg: string, ...args: any) => void) => {
	ipcRenderer.on(channel, (_: any, message: string, ...args: any[]) => callback(message, ...args));
};

export const relaunch = () => ipcRenderer.invoke("relaunch");
