import path from "path";
import { mkdirp } from "mkdirp";
import fs from "fs";
import * as log from "electron-log";
import { getTeaPath } from "./tea-dir";
import { Packages } from "../../src/libs/types";

const pkgsFilePath = path.join(getTeaPath(), "tea.xyz/gui/pkgs.json");
const pkgsFolder = path.join(getTeaPath(), "tea.xyz/gui");

export async function writePackageCache(pkgs: Packages) {
	try {
		if (!pkgs || !Object.keys(pkgs.packages).length) {
			return;
		}

		log.info(`writing data for ${Object.keys(pkgs.packages).length} packages to ${pkgsFilePath}`);
		await mkdirp(pkgsFolder);
		fs.writeFileSync(pkgsFilePath, JSON.stringify(pkgs), {
			encoding: "utf-8"
		});
	} catch (error) {
		log.error(error);
	}
}

export async function loadPackageCache(): Promise<Packages> {
	try {
		log.info(`loading package cache from ${pkgsFilePath}`);
		const pkgData = fs.readFileSync(pkgsFilePath);
		return JSON.parse(pkgData.toString()) as Packages;
	} catch (err) {
		if (err.code !== "ENOENT") {
			log.error(err);
		}
		return { version: "1", packages: {} };
	}
}

export const nameToSlug = (name: string) => {
	// github.com/Pypa/twine -> github_com_pypa_twine
	const [nameOnly] = name.split("@");
	const slug = nameOnly.replace(/[^\w\s]/gi, "_").toLocaleLowerCase();
	return slug;
};
