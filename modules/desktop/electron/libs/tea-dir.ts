// import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import fs from "fs";
import path from "path";
import { app } from "electron";
import semver, { SemVer } from "semver";
import * as log from "electron-log";
import type { InstalledPackage } from "../../src/libs/types";
import semverCompare from "semver/functions/compare";
import { mkdirp } from "mkdirp";

type Dir = {
	name: string;
	path: string;
	children?: Dir[];
};

type ParsedVersion = { version: SemVer; full_name: string };

export const getTeaPath = () => {
	const homePath = app.getPath("home");
	const teaPath = path.join(homePath, "./.tea");
	return teaPath;
};

const guiFolder = path.join(getTeaPath(), "tea.xyz/gui");

export const getGuiPath = () => {
	return path.join(getTeaPath(), "tea.xyz/gui");
};

export async function getInstalledPackages(): Promise<InstalledPackage[]> {
	const pkgsPath = getTeaPath();
	log.info("recursively reading:", pkgsPath);
	const folders = await deepReadDir({
		dir: pkgsPath,
		continueDeeper: (name: string) => !semver.valid(name) && name !== ".tea",
		filter: (name: string) => !!semver.valid(name) && name !== ".tea"
	});

	const bottles = folders
		.map((p: string) => p.split(".tea/")[1])
		.map(parseVersionFromPath)
		.filter((v): v is ParsedVersion => !!v)
		.sort((a, b) => semverCompare(b.version, a.version));

	log.info("installed bottles:", bottles.length);

	return bottles.reduce<InstalledPackage[]>((pkgs, bottle) => {
		const pkg = pkgs.find((v) => v.full_name === bottle.full_name);
		if (pkg) {
			pkg.installed_versions.push(bottle.version);
		} else {
			pkgs.push({
				full_name: bottle.full_name,
				installed_versions: [bottle.version]
			});
		}
		return pkgs;
	}, []);
}

const parseVersionFromPath = (versionPath: string): ParsedVersion | null => {
	try {
		const path = versionPath.trim().split("/");
		const version = path.pop();
		return {
			version: new SemVer(semver.clean(version || "") || ""),
			full_name: path.join("/")
		};
	} catch (e) {
		log.error("error parsing version from path: ", versionPath);
		return null;
	}
};

const semverTest =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

export const getPkgBottles = (packageDir: Dir): string[] => {
	log.info("getting installed bottle for ", packageDir);
	const bottles: string[] = [];

	const pkg = packageDir.path.split(".tea/")[1];
	const version = pkg.split("/v")[1];

	const isVersion = semverTest.test(version) || !isNaN(+version) || version === "*";

	if (version && isVersion) {
		bottles.push(pkg);
	} else if (packageDir?.children?.length) {
		const childBottles = packageDir.children
			.map(getPkgBottles)
			.reduce((arr, bottles) => [...arr, ...bottles], []);
		bottles.push(...childBottles);
	}

	const foundBottles = bottles.filter((b) => b !== undefined).sort(); // ie: ["gohugo.io/v*", "gohugo.io/v0", "gohugo.io/v0.108", "gohugo.io/v0.108.0"]

	log.info(`Found ${foundBottles.length} bottles from `, packageDir);
	return foundBottles;
};

export const deepReadDir = async ({
	dir,
	continueDeeper,
	filter
}: {
	dir: string;
	continueDeeper?: (name: string) => boolean;
	filter?: (name: string) => boolean;
}) => {
	const arrayOfFiles: string[] = [];
	try {
		const files = fs.readdirSync(dir, { withFileTypes: true });
		for (const f of files) {
			const nextPath = path.join(dir, f.name);
			const deeper = continueDeeper ? continueDeeper(f.name) : true;
			if (f.isDirectory() && deeper) {
				const nextFiles = await deepReadDir({ dir: nextPath, continueDeeper, filter });
				arrayOfFiles.push(...nextFiles);
			} else if (filter && filter(f.name)) {
				arrayOfFiles.push(nextPath);
			} else if (!filter) {
				arrayOfFiles.push(nextPath);
			}
		}
	} catch (e) {
		log.error(e);
	}
	return arrayOfFiles;
};

const listFilePath = path.join(getGuiPath(), "installed.json");
export const getPackagesInstalledList = async (): Promise<InstalledPackage[]> => {
	let list: InstalledPackage[] = [];
	try {
		if (fs.existsSync(listFilePath)) {
			log.info("gui/installed.json file exists!");
			const listBuffer = await fs.readFileSync(listFilePath);
			list = JSON.parse(listBuffer.toString()) as InstalledPackage[];
		} else {
			log.info("gui/installed.json does not exists!");
			await mkdirp(guiFolder);
			await updatePackageInstalledList([]);
		}
	} catch (error) {
		log.error(error);
	}
	return list;
};

export async function updatePackageInstalledList(list: InstalledPackage[]) {
	try {
		log.info("creating:", listFilePath);
		await mkdirp(guiFolder);
		await fs.writeFileSync(listFilePath, JSON.stringify(list), {
			encoding: "utf-8"
		});
	} catch (error) {
		log.error(error);
	}
}
