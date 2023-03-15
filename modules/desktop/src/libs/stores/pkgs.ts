import { writable } from "svelte/store";
import type { GUIPackage } from "../types";
import { PackageStates } from "../types";
import { getPackages } from "@native";
import Fuse from "fuse.js";
import { getPackage, getPackageBottles } from "@native";

import { getReadme, getContributors, getRepoAsPackage } from "$libs/github";
import semverCompare from "semver/functions/compare";

export default function initPackagesStore() {
	let initialized = false;
	const packages = writable<GUIPackage[]>([]);
	// const packages: GUIPackage[] = [];
	let packagesIndex: Fuse<GUIPackage>;

	if (!initialized) {
		initialized = true;
		getPackages().then((pkgs) => {
			packages.set(pkgs);
			packagesIndex = new Fuse(pkgs, {
				keys: ["name", "full_name", "desc", "categories"]
			});

			pkgs.forEach((pkg) => {
				if (pkg.state === PackageStates.INSTALLED) {
					syncPackageBottlesAndState(pkg.full_name);
				}
			});
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

	const syncPackageBottlesAndState = async (pkgName: string) => {
		const bottles = await getPackageBottles(pkgName);

		packages.update((pkgs) => {
			const i = pkgs.findIndex((pkg) => pkg.full_name === pkgName);
			if (i >= 0) {
				const pkg = pkgs[i];

				const availableVersions = bottles
					.map(({ version }) => version)
					.sort((a, b) => semverCompare(b, a));

				const installedVersions =
					pkg?.installed_versions?.sort((a, b) => semverCompare(b, a)) || [];

				pkgs[i] = {
					...pkg,
					available_versions: availableVersions,
					state:
						availableVersions[0] === installedVersions[0]
							? PackageStates.INSTALLED
							: PackageStates.NEEDS_UPDATE
				};
			}
			return pkgs;
		});
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
