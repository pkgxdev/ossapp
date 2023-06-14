import { derived, writable } from "svelte/store";
import type { GUIPackage, InstalledPackage, Packages } from "../types";
import { PackageStates } from "../types";
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
  listenToChannel,
  getInstalledVersionsForPackage,
  monitorTeaDir,
  stopMonitoringTeaDir
} from "@native";

import { getReadme, getContributors, getRepoAsPackage } from "$libs/github";
import { NotificationType } from "@tea/ui/types";
import { trackInstall, trackInstallFailed } from "$libs/analytics";
import { addInstalledVersion, isInstalling, packageWasUpdated } from "$libs/packages/pkg-utils";
import withDebounce from "$libs/utils/debounce";
import { trimGithubSlug } from "$libs/github";
import { notificationStore } from "$libs/stores";
import withRetry from "$libs/utils/retry";

import log from "$libs/logger";
import { isPackageUpToDate } from "../packages/pkg-utils";

import { indexPackages, searchPackages } from "$libs/search-index";

const packageRefreshInterval = 1000 * 60 * 60; // 1 hour

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
      getReadme({ owner, repo, full_name: guiPkg.full_name! }),
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
    await monitorTeaDir();
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

  // initialize Fuse index for fuzzy search
  indexPackages(guiPkgs);

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

const refreshSinglePackage = async (fullName: string) => {
  log.info(`refreshing single package: ${fullName}`);
  const result = await getInstalledVersionsForPackage(fullName);
  log.info(`package: ${fullName} has installed versions:`, result.installed_versions);
  updatePackage(fullName, { installed_versions: result.installed_versions });
};

// Destructor for the package store
const destroy = async () => {
  isDestroyed = true;
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
  }
  await stopMonitoringTeaDir();
  log.info("packages store: destroyed");
};

const installPkg = async (pkg: GUIPackage, version?: string) => {
  const versionToInstall = version || pkg.version;

  try {
    updatePackage(pkg.full_name, { install_progress_percentage: 0.01 });

    await installPackage(pkg, versionToInstall);
    trackInstall(pkg.full_name);

    // If the package was AVAILABLE previously then it was just installed, otherwise it was updated
    const state = pkg.state === PackageStates.AVAILABLE ? "INSTALLED" : "UPDATED";
    updatePackage(pkg.full_name, { displayState: { state, version: versionToInstall } });

    await refreshSinglePackage(pkg.full_name);
  } catch (error) {
    log.error(error);
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    trackInstallFailed(pkg.full_name, message || "unknown");
    updatePackage(pkg.full_name, {
      displayState: { state: "ERROR", errorMessage: message, version: versionToInstall }
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

    await refreshSinglePackage(pkg.full_name);
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

// TODO: perhaps this can be combined with pkg-modified?
listenToChannel("pkg-installed", ({ full_name, version }: any) => {
  if (!full_name) {
    return;
  }
  updatePackage(full_name, {}, version);
});

listenToChannel("pkg-modified", ({ full_name }: any) => {
  if (!full_name) {
    return;
  }
  refreshSinglePackage(full_name);
});

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

const resetPackageDisplayState = (pkg: GUIPackage) => {
  updatePackage(pkg.full_name, {
    displayState: null
  });
};

const resetAllPackagesUpdatedState = () => {
  packageMap.update((pkgs) => {
    Object.values(pkgs.packages).forEach((pkg) => {
      // only reset the display state if the package was updated,
      // installed and error display states should not be reset here
      if (packageWasUpdated(pkg)) {
        pkg.displayState = null;
      }
    });
    return pkgs;
  });
};

export default {
  packageList,
  search: searchPackages,
  init,
  installPkg,
  uninstallPkg,
  syncPackageData,
  deletePkg,
  destroy,
  cachePkgImage,
  resetPackageDisplayState,
  resetAllPackagesUpdatedState
};
