import { writable } from "svelte/store";
import type { GUIPackage, InstalledPackage } from "../types";
import { PackageStates } from "../types";
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
import type { Package } from "@tea/ui/types";

const log = window.require("electron-log");

const installTea = async () => {
	log.info("installing tea...");
	try {
		openTerminal(`sh <(curl https://tea.xyz)`);
	} catch (error) {
		log.error("install failed", error);
	}
};

export default function initPackagesStore() {
	let initialized = false;
	const syncProgress = writable<number>(0); // TODO: maybe use this in the UI someday
	const packages = writable<GUIPackage[]>([]);

	let packagesIndex: Fuse<GUIPackage>;

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
					console.log(bottles, pkg);

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

	const checkTeaCLIPackage = async (teaPkg: Package, installedTeaCliPkg?: InstalledPackage) => {
		const isLatest =
			installedTeaCliPkg && installedTeaCliPkg.installed_versions[0] === teaPkg.version;
		log.info("check Tea-CLI if latest:", !isLatest);
		if (!isLatest) {
			notificationStore.add({
				message: "install cli",
				i18n_key: "package.update-tea-cli",
				type: NotificationType.ACTION_BANNER,
				callback: installTea,
				callback_label: installedTeaCliPkg ? "INSTALL" : "UPDATE"
			});
		}
	};

	const init = async function () {
		log.info("packages store: try initialize");
		if (!initialized) {
			log.info("packages store: initializing...");
			initialized = true;
			const pkgs = await getDistPackages();
			const guiPkgs: GUIPackage[] = pkgs.map((p) => ({
				...p,
				state: PackageStates.AVAILABLE
			}));

			// set packages data so that i can render something in the UI already
			packages.set(guiPkgs);
			log.info("initialized packages store with ", guiPkgs.length);
			packagesIndex = new Fuse(guiPkgs, {
				keys: ["name", "full_name", "desc", "categories"]
			});
			log.info("initialized packages fuse index");

			try {
				const installedPkgs: InstalledPackage[] = await getInstalledPackages();

				log.info("sync test for tea-cli");
				const installedTea = installedPkgs.find((p) => p.full_name === "tea.xyz");
				const distTea = pkgs.find((p) => p.full_name === "tea.xyz");
				if (distTea) await checkTeaCLIPackage(distTea, installedTea);

				log.info("set NEEDS_UPDATE state to pkgs");
				let progressCount = 0;
				for (const iPkg of installedPkgs) {
					progressCount++;
					const pkg = guiPkgs.find((p) => p.full_name === iPkg.full_name);
					if (pkg) {
						const isUpdated = pkg.version === iPkg.installed_versions[0];
						updatePackage(pkg.full_name, {
							installed_versions: iPkg.installed_versions,
							state: isUpdated ? PackageStates.INSTALLED : PackageStates.NEEDS_UPDATE
						});
						log.info(`getting available bottles for ${pkg.full_name}`);
						await syncPackageBottlesAndState(iPkg.full_name);
					}
					log.info(`synced ${iPkg.full_name} ${progressCount}/${installedPkgs.length}`);
					syncProgress.set(+(progressCount / installedPkgs.length).toFixed(2));
				}
			} catch (error) {
				log.error(error);
			}
		}
		log.info("packages store: initialized!");
	};

	return {
		packages,
		syncProgress,
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
		updatePackage,
		init
	};
}
