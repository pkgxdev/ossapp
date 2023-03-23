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
import { type GUIPackage, type DeviceAuth, type Session, AuthStatus } from "./types";

import * as mock from "./native-mock";
import { PackageStates, type InstalledPackage } from "./types";
import { installPackageCommand } from "./native/cli";

import { get as apiGet } from "$libs/v1-client";
import axios from "axios";

const log = window.require("electron-log");
const { ipcRenderer, shell } = window.require("electron");

let retryLimit = 0;
export async function getDistPackages(): Promise<Package[]> {
	let packages: Package[] = [];
	try {
		const req = await axios.get<Package[]>(
			"https://s3.amazonaws.com/preview.gui.tea.xyz/packages.json"
		);
		log.info("packages received:", req.data.length);
		packages = req.data;
	} catch (error) {
		retryLimit++;
		log.error("getDistPackagesList:", error);
		if (retryLimit < 3) packages = await getDistPackages();
	}
	retryLimit = 0;
	return packages;
}

export async function getInstalledPackages(): Promise<InstalledPackage[]> {
	let pkgs: InstalledPackage[] = [];
	try {
		log.info("getting installed packages");
		pkgs = (await ipcRenderer.invoke("get-installed-packages")) as InstalledPackage[];
		log.info("got installed packages:", pkgs.length);
	} catch (error) {
		log.error(error);
	}
	return pkgs;
}

export async function getPackages(): Promise<GUIPackage[]> {
	const [packages, installedPackages] = await Promise.all([
		getDistPackages(),
		ipcRenderer.invoke("get-installed-packages") as InstalledPackage[]
	]);

	// NOTE: its not ideal to get bottles or set package states here maybe do it async in the package store init
	// --- it has noticeable slowness
	log.info(`native: installed ${installedPackages.length} out of ${(packages || []).length}`);
	return (packages || []).map((pkg) => {
		const installedPkg = installedPackages.find((p) => p.full_name === pkg.full_name);
		return {
			...pkg,
			state: installedPkg ? PackageStates.INSTALLED : PackageStates.AVAILABLE,
			installed_versions: installedPkg?.installed_versions || []
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

export async function installPackage(pkg: GUIPackage, version?: string) {
	try {
		const latestVersion = pkg?.available_versions?.length ? pkg.available_versions[0] : "";
		const specificVersion = version || latestVersion;
		await installPackageCommand(pkg.full_name + (specificVersion ? `@${specificVersion}` : ""));
	} catch (error) {
		log.error("installPackage:", error);
	}
}

export async function getTopPackages(): Promise<GUIPackage[]> {
	const packages = await mock.getTopPackages();
	return packages;
}

export async function getAllPosts(tag?: string): Promise<AirtablePost[]> {
	// add filter here someday: tag = news | course
	try {
		const queryParams = {
			...(tag ? { tag } : {}),
			nocache: "true"
		};
		const posts = await apiGet<AirtablePost[]>("posts", queryParams);
		return posts || [];
	} catch (error) {
		log.error(error);
		return [];
	}
}

export async function getDeviceAuth(deviceId: string): Promise<DeviceAuth> {
	let auth: DeviceAuth = {
		status: AuthStatus.UNKNOWN,
		key: ""
	};
	try {
		const data = await apiGet<DeviceAuth>(`/auth/device/${deviceId}`);
		if (data) auth = data;
	} catch (error) {
		log.error(error);
		auth = await getDeviceAuth(deviceId);
	}
	return auth;
}

export async function getPackageBottles(packageName: string): Promise<Bottle[]> {
	try {
		const pkg = await apiGet<Package>(`packages/${packageName.replaceAll("/", ":")}`);
		log.info(`got ${pkg?.bottles?.length || 0} bottles for ${packageName}`);
		return (pkg && pkg.bottles) || [];
	} catch (error) {
		log.error(error);
		return [];
	}
}

const retryGetPackage: { [key: string]: number } = {};
export async function getPackage(packageName: string): Promise<Partial<Package>> {
	let pkg: Partial<Package> = {};
	try {
		const data = await apiGet<Partial<Package>>(`packages/${packageName.replaceAll("/", ":")}`);
		if (data) {
			pkg = data;
		} else {
			throw new Error(`package:${packageName} not found`);
		}
	} catch (error) {
		log.error(error);
		retryGetPackage[packageName] = (retryGetPackage[packageName] || 0) + 1;
		if (retryGetPackage[packageName] < 3) {
			pkg = await getPackage(packageName);
		} else {
			log.info(`failed to get package:${packageName} after 3 tries`);
		}
	}

	return pkg;
}

export const getSession = async (): Promise<Session | null> => {
	try {
		log.info("getting local session data");
		const session = await ipcRenderer.invoke("get-session");
		log.info("local session data ", session ? "found" : "not found");
		return session;
	} catch (error) {
		log.error(error);
		return null;
	}
};

export const updateSession = async (session: Partial<Session>) => {
	try {
		await ipcRenderer.invoke("update-session", session);
	} catch (error) {
		log.error(error);
	}
};

export const openTerminal = (cmd: string) => {
	try {
		ipcRenderer.invoke("open-terminal", { cmd });
	} catch (error) {
		log.error(error);
	}
};

export const shellOpenExternal = (link: string) => shell.openExternal(link);

export const listenToChannel = (channel: string, callback: (msg: string, ...args: any) => void) => {
	ipcRenderer.on(channel, (_: any, message: string, ...args: any[]) => callback(message, ...args));
};

export const relaunch = () => ipcRenderer.invoke("relaunch");

export const getProtocolPath = async (): Promise<string> => {
	const path = await ipcRenderer.invoke("get-protocol-path");
	return path;
};
