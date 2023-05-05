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
  setBadgeCount,
  loadPackageCache,
  writePackageCache,
  syncPantry,
  cacheImageURL,
  listenToChannel
} from "@native";

import { getReadme, getContributors, getRepoAsPackage } from "$libs/github";
import { NotificationType } from "@tea/ui/types";
import { trackInstall, trackInstallFailed } from "$libs/analytics";
import { addInstalledVersion, isInstalling } from "$libs/packages/pkg-utils";
import withDebounce from "$libs/utils/debounce";
import { trimGithubSlug } from "$libs/github";
import { notificationStore } from "$libs/stores";
import withRetry from "$libs/utils/retry";

import log from "$libs/logger";
import { isPackageUpToDate } from "../packages/pkg-utils";

const packageRefreshInterval = 1000 * 60 * 60; // 1 hour

export default function initPackagesStore() {
  let initialized = false;
  let isDestroyed = false;
  let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const packageMap = writable<Packages>({ version: "0", packages: {} });
  const packageList = derived(packageMap, ($packages) =>
    Object.values($packages.packages).sort((a, b) => {
      // implement default sort by last_modified > descending
      const aDate = new Date(a.last_modified);
      const bDate = new Date(b.last_modified);
      return +bDate - +aDate;
    })
  );

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

  const updatePackage = (full_name: string, props: Partial<GUIPackage>, newVersion?: string) => {
    packageMap.update((pkgs) => {
      const pkg = pkgs.packages[full_name];
      if (pkg) {
        const updatedPkg = { ...pkg, ...props };

        if (newVersion) {
          updatedPkg.installed_versions = addInstalledVersion(
            updatedPkg.installed_versions,
            newVersion
          );
        }

        updatedPkg.state = getPackageState(updatedPkg);
        pkgs.packages[full_name] = updatedPkg;

        setBadgeCountFromPkgs(pkgs);
      }
      return pkgs;
    });
  };

  // getPackage state centralizes the logic for determining the state of the package based on the other properties
  const getPackageState = (pkg: GUIPackage): PackageStates => {
    if (pkg.isUninstalling) {
      //TODO: maybe there should be an uninstalling state too? Although that needs UI/UX changes
      return PackageStates.AVAILABLE;
    }

    const isUpToDate = isPackageUpToDate(pkg);

    if (isInstalling(pkg)) {
      const hasNoVersions = !pkg.installed_versions?.length;
      if (hasNoVersions || isUpToDate) {
        return PackageStates.INSTALLING;
      }
      return PackageStates.UPDATING;
    }

    if (!pkg.installed_versions?.length) {
      return PackageStates.AVAILABLE;
    }

    return isUpToDate ? PackageStates.INSTALLED : PackageStates.NEEDS_UPDATE;
  };

  const syncPackageData = async (guiPkg: Partial<GUIPackage> | undefined) => {
    if (!guiPkg) return;

    const pkg = await getPackage(guiPkg.full_name!); // ATM: pkg only bottles and github:string
    const readmeMd = `# ${guiPkg.full_name} #
To read more about this package go to [${guiPkg.homepage}](${guiPkg.homepage}).
		`;

    const updatedPackage: Partial<GUIPackage> = {
      bottles: pkg?.bottles || [],
      readme: {
        data: readmeMd,
        type: "md"
      },
      synced: true,
      github: pkg.github
        ? trimGithubSlug(pkg.github)
        : pkg.full_name?.includes("github.com")
        ? trimGithubSlug(pkg.full_name.split("github.com/")[1])
        : ""
    };
    if (updatedPackage.github) {
      const [owner, repo] = updatedPackage.github.split("/");
      const [readme, contributors, repoData] = await Promise.all([
        getReadme(owner, repo),
        getContributors(owner, repo),
        getRepoAsPackage(owner, repo)
      ]);
      if (readme) {
        updatedPackage.readme = readme;
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
      keys: ["name", "full_name", "desc", "categories"],
      minMatchCharLength: 3,
      threshold: 0.3
    });
    log.info("refreshed packages fuse index");

    try {
      const installedPkgs: InstalledPackage[] = await getInstalledPackages();

      log.info("updating state of packages");
      for (const pkg of guiPkgs) {
        const iPkg = installedPkgs.find((p) => p.full_name === pkg.full_name);
        if (iPkg) {
          pkg.installed_versions = iPkg.installed_versions;
          updatePackage(pkg.full_name, {
            installed_versions: iPkg.installed_versions
          });
        }
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
    const versionToInstall = version || pkg.version;

    try {
      updatePackage(pkg.full_name, { install_progress_percentage: 0.01 });
      await installPackage(pkg, versionToInstall);
      trackInstall(pkg.full_name);
      notificationStore.add({
        message: `Package ${pkg.full_name} v${versionToInstall} has been installed.`
      });
    } catch (error) {
      log.error(error);
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;
      trackInstallFailed(pkg.full_name, message || "unknown");

      notificationStore.add({
        message: `Package ${pkg.full_name} v${versionToInstall} failed to install.`,
        type: NotificationType.ERROR
      });
    } finally {
      updatePackage(pkg.full_name, { install_progress_percentage: 100 });
    }
  };

  const uninstallPkg = async (pkg: GUIPackage) => {
    let fakeTimer: NodeJS.Timer | null = null;
    try {
      fakeTimer = withFakeLoader(pkg, (progress) => {
        updatePackage(pkg.full_name, {
          install_progress_percentage: progress,
          isUninstalling: true
        });
      });

      for (const v of pkg.installed_versions || []) {
        await deletePkg(pkg, v);
      }

      setTimeout(() => {
        updatePackage(pkg.full_name, {
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
      updatePackage(pkg.full_name, { install_progress_percentage: 0, isUninstalling: false });
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

  const cachePkgImage = async (pkg: GUIPackage): Promise<string> => {
    let cacheFileURL = "";
    updatePackage(pkg.full_name, { cached_image_url: "" });
    if (pkg.thumb_image_url && !pkg.thumb_image_url.includes("package-thumb-nolabel4.jpg")) {
      const result = await cacheImageURL(pkg.thumb_image_url);
      if (result) {
        cacheFileURL = result;
        updatePackage(pkg.full_name, { cached_image_url: cacheFileURL });
      }
    }
    return cacheFileURL;
  };

  listenToChannel("install-progress", ({ full_name, progress }: any) => {
    if (!full_name) {
      return;
    }
    updatePackage(full_name, { install_progress_percentage: progress });
  });

  listenToChannel("pkg-installed", ({ full_name, version }: any) => {
    if (!full_name) {
      return;
    }
    updatePackage(full_name, {}, version);
  });

  return {
    packageList,
    search: async (term: string, limit = 5): Promise<GUIPackage[]> => {
      if (!term || !packagesIndex) return [];
      // TODO: if online, use algolia else use Fuse
      const res = packagesIndex.search(term, { limit });
      const matchingPackages: GUIPackage[] = res.map((v) => v.item);
      return matchingPackages;
    },
    init,
    installPkg,
    uninstallPkg,
    syncPackageData,
    deletePkg,
    destroy,
    cachePkgImage
  };
}

// This is only used for uninstall now
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
    callback(fakeLoadingProgress);
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
