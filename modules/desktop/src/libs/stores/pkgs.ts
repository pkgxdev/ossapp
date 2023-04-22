import { derived, writable } from "svelte/store";
import type { GUIPackage, InstalledPackage, Packages } from "../types";
import { PackageStates } from "../types";
import Fuse from "fuse.js";
import {
	getPackage,
	getDistPackages,
	getInstalledPackages,
	installPackage,
	deletePackage,
	getPackageBottles,
	setBadgeCount,
	loadPackageCache,
	writePackageCache,
	syncPantry,
	cacheImageURL
} from "@native";

import { getReadme, getContributors, getRepoAsPackage } from "$libs/github";
import { NotificationType, type Package } from "@tea/ui/types";
import { trackInstall, trackInstallFailed } from "$libs/analytics";
import { addInstalledVersion } from "$libs/packages/pkg-utils";
import withDebounce from "$libs/utils/debounce";
import { trimGithubSlug } from "$libs/github";
import { notificationStore } from "$libs/stores";
import withRetry from "$libs/utils/retry";

const log = window.require("electron-log");

const packageRefreshInterval = 1000 * 60 * 60; // 1 hour

export default function initPackagesStore() {
	let initialized = false;
	let isDestroyed = false;
	let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

	const syncProgress = writable<number>(0); // TODO: maybe use this in the UI someday

	const packageMap = writable<Packages>({ version: "0", packages: {} });
	const packageList = derived(packageMap, ($packages) => Object.values($packages.packages));

	let packagesIndex: Fuse<GUIPackage>;

	const updateAllPackages = (guiPkgs: GUIPackage[]) => {
		packageMap.update((pkgs) => {
			guiPkgs.forEach((pkg) => {
				const oldPkg = pkgs.packages[pkg.full_name];
				pkgs.packages[pkg.full_name] = { ...oldPkg, ...pkg };
			});
			setBadgeCountFromPkgs(pkgs);
			return pkgs;
		});
	};

	const updatePackage = (full_name: string, props: Partial<GUIPackage>) => {
		packageMap.update((pkgs) => {
			const pkg = pkgs.packages[full_name];
			pkgs.packages[full_name] = { ...pkg, ...props };
			setBadgeCountFromPkgs(pkgs);
			return pkgs;
		});
	};

	const syncPackageData = async (guiPkg: Partial<GUIPackage> | undefined) => {
		if (!guiPkg) return;

		const pkg = await getPackage(guiPkg.full_name!); // ATM: pkg only bottles and github:string
		const readmeMd = `# ${guiPkg.full_name} #
To read more about this package go to [${guiPkg.homepage}](${guiPkg.homepage}).
		`;

		const updatedPackage: Partial<GUIPackage> = {
			...pkg,
			readme_md: readmeMd,
			synced: true,
			github: pkg.github ? trimGithubSlug(pkg.github) : ""
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

	const init = async function () {
		log.info("packages store: try initialize");

		if (!initialized) {
			const cachedPkgs: Packages = await loadPackageCache();
			log.info(`Loaded ${Object.keys(cachedPkgs.packages).length} packages from cache`);
			packageMap.set(cachedPkgs);

			await refreshPackages();
			initialized = true;
		}
		log.info("packages store: initialized!");
	};

	const refreshPackages = async () => {
		if (isDestroyed) return;

		log.info("packages store: refreshing...");

		const pkgs = await getDistPackages();
		const guiPkgs: GUIPackage[] = pkgs.map((p) => ({
			...p,
			state: PackageStates.AVAILABLE
		}));

		if (!initialized) {
			// set packages data so that i can render something in the UI already
			updateAllPackages(guiPkgs);
			log.info("initialized packages store with ", guiPkgs.length);
		}

		packagesIndex = new Fuse(guiPkgs, {
			keys: ["name", "full_name", "desc", "categories"]
		});
		log.info("refreshed packages fuse index");

		try {
			const installedPkgs: InstalledPackage[] = await getInstalledPackages();

			log.info("set NEEDS_UPDATE state to pkgs");
			for (const [i, iPkg] of installedPkgs.entries()) {
				const pkg = guiPkgs.find((p) => p.full_name === iPkg.full_name);
				if (pkg) {
					const isUpdated = pkg.version === iPkg.installed_versions[0];
					updatePackage(pkg.full_name, {
						installed_versions: iPkg.installed_versions,
						state: isUpdated ? PackageStates.INSTALLED : PackageStates.NEEDS_UPDATE
					});
				}
				syncProgress.set(+((i + 1) / installedPkgs.length).toFixed(2));
			}
		} catch (error) {
			log.error(error);
		}

		try {
			await withRetry(syncPantry);
		} catch (err) {
			log.error(err);
		}

		refreshTimeoutId = setTimeout(() => refreshPackages(), packageRefreshInterval); // refresh every hour
	};

	// Destructor for the package store
	const destroy = () => {
		isDestroyed = true;
		if (refreshTimeoutId) {
			clearTimeout(refreshTimeoutId);
		}
		log.info("packages store: destroyed");
	};

	const installPkg = async (pkg: GUIPackage, version?: string) => {
		let fakeTimer: NodeJS.Timer | null = null;
		const originalState = pkg.state;
		const versionToInstall = version || pkg.version;

		try {
			const state: PackageStates =
				pkg.state === PackageStates.NEEDS_UPDATE
					? PackageStates.UPDATING
					: PackageStates.INSTALLING;

			updatePackage(pkg.full_name, { state });

			fakeTimer = withFakeLoader(pkg, (progress) => {
				updatePackage(pkg.full_name, { install_progress_percentage: progress });
			});

			await installPackage(pkg, versionToInstall);
			trackInstall(pkg.full_name);

			updatePackage(pkg.full_name, {
				state: PackageStates.INSTALLED,
				installed_versions: addInstalledVersion(pkg.installed_versions, versionToInstall)
			});

			notificationStore.add({
				message: `Package ${pkg.full_name} v${versionToInstall} has been installed.`
			});
		} catch (error) {
			let message = "Unknown Error";
			if (error instanceof Error) message = error.message;
			trackInstallFailed(pkg.full_name, message || "unknown");

			//FIXME: probably need a refresh package state function instead of this
			updatePackage(pkg.full_name, { state: originalState });

			notificationStore.add({
				message: `Package ${pkg.full_name} v${versionToInstall} failed to install.`,
				type: NotificationType.ERROR
			});
		} finally {
			fakeTimer && clearTimeout(fakeTimer);
			updatePackage(pkg.full_name, { install_progress_percentage: 100 });
		}
	};

	const uninstallPkg = async (pkg: GUIPackage) => {
		let fakeTimer: NodeJS.Timer | null = null;
		try {
			fakeTimer = withFakeLoader(pkg, (progress) => {
				updatePackage(pkg.full_name, { install_progress_percentage: progress });
			});
			for (const v of pkg.installed_versions || []) {
				await deletePkg(pkg, v);
			}
			setTimeout(() => {
				updatePackage(pkg.full_name, {
					state: PackageStates.AVAILABLE,
					installed_versions: []
				});
			}, 3000);
		} catch (error) {
			log.error(error);
			notificationStore.add({
				message: `Package ${pkg.full_name} failed to uninstall.`,
				type: NotificationType.ERROR
			});
		} finally {
			fakeTimer && clearTimeout(fakeTimer);
			updatePackage(pkg.full_name, { install_progress_percentage: 0 });
		}
	};

	const fetchPackageBottles = async (pkgName: string) => {
		// TODO: this api should take an architecture argument or else an architecture filter should be applied downstreawm
		const bottles = await getPackageBottles(pkgName);
		if (bottles?.length) {
			updatePackage(pkgName, { bottles });
		}
	};

	const deletePkg = async (pkg: GUIPackage, version: string) => {
		log.info("deleting package: ", pkg.full_name, " version: ", version);
		await deletePackage({ fullName: pkg.full_name, version });
		updatePackage(pkg.full_name, {
			installed_versions: pkg.installed_versions?.filter((v) => v !== version)
		});
	};

	const writePackageCacheWithDebounce = withDebounce(writePackageCache);
	packageMap.subscribe(async (pkgs) => {
		writePackageCacheWithDebounce(pkgs);
	});

	const cachePkgImage = async (pkg: GUIPackage) => {
		if (pkg.thumb_image_url && !pkg.thumb_image_url.includes("package-thumb-nolabel4.jpg")) {
			const cacheFileURL = await cacheImageURL(pkg.thumb_image_url);
			if (cacheFileURL) {
				updatePackage(pkg.full_name, { cached_image_url: cacheFileURL });
			}
		}
	};

	return {
		packageList,
		syncProgress,
		search: async (term: string, limit = 5): Promise<GUIPackage[]> => {
			if (!term || !packagesIndex) return [];
			// TODO: if online, use algolia else use Fuse
			const res = packagesIndex.search(term, { limit });
			const matchingPackages: GUIPackage[] = res.map((v) => v.item);
			return matchingPackages;
		},
		fetchPackageBottles,
		updatePackage,
		init,
		installPkg,
		uninstallPkg,
		syncPackageData,
		deletePkg,
		destroy,
		cachePkgImage
	};
}

export const withFakeLoader = (
	pkg: GUIPackage,
	callback: (progress: number) => void
): NodeJS.Timer => {
	let fakeLoadingProgress = 1;
	const ms = 100;
	const assumedDlSpeedMb = 1024 * 1024 * 3; // 3mbps
	const size = pkg?.bottles?.length ? pkg.bottles[0].bytes : assumedDlSpeedMb * 10;
	const eta = size / assumedDlSpeedMb;

	const increment = 1 / eta / 10;

	const fakeTimer = setInterval(() => {
		const progressLeft = 100 - fakeLoadingProgress;
		const addProgress = progressLeft * increment;
		fakeLoadingProgress = fakeLoadingProgress + addProgress;
		callback(+fakeLoadingProgress.toFixed(2));
	}, ms);

	return fakeTimer;
};

const setBadgeCountFromPkgs = (pkgs: Packages) => {
	try {
		const needsUpdateCount = Object.values(pkgs.packages).filter(
			(p) => p.state === PackageStates.NEEDS_UPDATE
		).length;
		setBadgeCount(needsUpdateCount);
	} catch (error) {
		log.error(error);
	}
};
