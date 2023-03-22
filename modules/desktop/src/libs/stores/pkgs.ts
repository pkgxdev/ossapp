import { writable } from "svelte/store";
import type { GUIPackage } from "../types";
import { PackageStates } from "../types";
// import { getPackages } from "@native";
import Fuse from "fuse.js";
import {
	getPackage,
	getDistPackages,
	getPackageBottles,
	openTerminal,
	getInstalledPackages
} from "@native";

import { getReadme, getContributors, getRepoAsPackage } from "$libs/github";
import semverCompare from "semver/functions/compare";
import { notificationStore } from "../stores";
import { NotificationType } from "@tea/ui/types";

const log = window.require("electron-log");

const installTea = async () => {
	console.log("installing tea...");
	try {
		openTerminal(`sh <(curl https://tea.xyz)`);
	} catch (error) {
		console.log("install failed");
	}
};

export default function initPackagesStore() {
	let initialized = false;
	const packages = writable<GUIPackage[]>([]);
	// const packages: GUIPackage[] = [];
	let packagesIndex: Fuse<GUIPackage>;

	if (!initialized) {
		initialized = true;
		getDistPackages().then(async (pkgs) => {
			const guiPkgs: GUIPackage[] = pkgs.map((p) => ({
				...p,
				state: PackageStates.AVAILABLE
			}));

			packages.set(guiPkgs);
			log.info("initialized packages store with ", guiPkgs.length);
			packagesIndex = new Fuse(guiPkgs, {
				keys: ["name", "full_name", "desc", "categories"]
			});

			try {
				const installedPackageBottles = await getInstalledPackages();
				installedPackageBottles.sort((a, b) => semverCompare(b.version, a.version));

				const installedPkgs = [...new Set(installedPackageBottles.map((p) => p.full_name))];

				for (const installedPkg of installedPkgs) {
					const pkg = guiPkgs.find((p) => p.full_name === installedPkg);
					if (pkg) {
						const installedVersions = installedPackageBottles
							.filter((p) => p.full_name === pkg.full_name)
							.map((p) => p.version);

						updatePackage(pkg.full_name, {
							installed_versions: installedVersions,
							state: PackageStates.INSTALLED
						});
					}
				}

				for (const pkg of installedPackageBottles) {
					log.info(`syncing ${pkg.full_name}`);
					if (pkg.full_name === "tea.xyz") {
						await syncTeaCliPackage();
					} else {
						await syncPackageBottlesAndState(pkg.full_name);
					}
					log.info(`synced ${pkg.full_name}`);
				}
			} catch (error) {
				log.error(error);
			}
		});
	}

	const updatePackage = (full_name: string, props: Partial<GUIPackage>) => {
		packages.update((pkgs) => {
			const i = pkgs.findIndex((pkg) => pkg.full_name === full_name);
			if (i >= 0) {
				pkgs[i] = {
					...pkgs[i],
					...props
				};
			}
			return pkgs;
		});
	};

	const syncPackageData = async (guiPkg: Partial<GUIPackage>) => {
		if (guiPkg.synced) return;

		const pkg = await getPackage(guiPkg.full_name!); // ATM: pkg only bottles and github:string
		const readmeMd = `# ${guiPkg.full_name} #
To read more about this package go to [${guiPkg.homepage}](${guiPkg.homepage}).
		`;

		const updatedPackage: Partial<GUIPackage> = {
			...pkg,
			readme_md: readmeMd,
			synced: true
		};
		if (pkg.github) {
			const [owner, repo] = pkg.github.split("/");
			const [readme, contributors, repoData] = await Promise.all([
				getReadme(owner, repo),
				getContributors(owner, repo),
				getRepoAsPackage(owner, repo)
			]);
			if (readme) {
				updatedPackage.readme_md = readme;
			}
			updatedPackage.contributors = contributors;
			updatedPackage.license = repoData.license;
		}

		updatePackage(guiPkg.full_name!, updatedPackage);
	};

	const syncPackageBottlesAndState = async (pkgName: string): Promise<GUIPackage | void> => {
		const bottles = await getPackageBottles(pkgName);
		return new Promise((resolve) => {
			packages.update((pkgs) => {
				const i = pkgs.findIndex((pkg) => pkg.full_name === pkgName);
				if (i >= 0) {
					const pkg = pkgs[i];

					const availableVersionsRaw = bottles
						.map(({ version }) => version)
						.sort((a, b) => semverCompare(b, a));

					const availableVersions = new Set(availableVersionsRaw);

					const installedVersions =
						pkg?.installed_versions?.sort((a, b) => semverCompare(b, a)) || [];

					const it = availableVersions.values();
					const latestVersion = it.next().value;

					pkgs[i] = {
						...pkg,
						available_versions: Array.from(availableVersions),
						state:
							latestVersion === installedVersions[0]
								? PackageStates.INSTALLED
								: PackageStates.NEEDS_UPDATE
					};

					resolve(pkgs[i]);
				} else {
					resolve();
				}
				return pkgs;
			});
		});
	};

	const syncTeaCliPackage = async () => {
		const updatedPkg = await syncPackageBottlesAndState("tea.xyz");
		if (updatedPkg && updatedPkg.state === PackageStates.INSTALLED) return;

		if (!updatedPkg || updatedPkg.state === PackageStates.AVAILABLE) {
			notificationStore.add({
				message: "install cli",
				i18n_key: "package.install-tea-cli",
				type: NotificationType.ACTION_BANNER,
				callback: installTea,
				callback_label: "INSTALL"
			});
		} else if (updatedPkg.state === PackageStates.NEEDS_UPDATE) {
			notificationStore.add({
				message: "install cli",
				i18n_key: "package.update-tea-cli",
				type: NotificationType.ACTION_BANNER,
				callback: installTea,
				callback_label: "UPDATE"
			});
		}
	};

	return {
		packages,
		subscribe: packages.subscribe,
		search: async (term: string, limit = 5): Promise<GUIPackage[]> => {
			if (!term || !packagesIndex) return [];
			// TODO: if online, use algolia else use Fuse
			const res = packagesIndex.search(term, { limit });
			const matchingPackages: GUIPackage[] = res.map((v) => v.item);
			return matchingPackages;
		},
		subscribeToPackage: (slug: string, cb: (pkg: GUIPackage) => void) => {
			packages.subscribe((pkgs) => {
				const foundPackage = pkgs.find((p) => p.slug === slug) as GUIPackage;
				if (foundPackage) {
					cb(foundPackage);
					syncPackageData(foundPackage);
				}
			});
		},
		updatePackage
	};
}
