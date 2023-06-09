import log from "$libs/logger";
import type { GUIPackage } from "$libs/types";
import SemVer from "@teaxyz/lib/semver";
import { t } from "$libs/translations";

// Find a list of available versions for a package based on the bottles
export const findAvailableVersions = (pkg: Pick<GUIPackage, "bottles" | "version">) => {
  // default to just showing the latest if bottles haven't loaded yet
  if (!pkg.bottles) {
    return [pkg.version];
  }

  const versionSet = new Set<string>();
  const arch = process.arch === "arm64" ? "aarch64" : "x86-64";
  for (const b of pkg.bottles) {
    if (b.arch === arch) versionSet.add(b.version);
  }

  return Array.from(versionSet).sort((a, b) => semverCompare(b, a));
};

export const semverCompare = (a: string, b: string) => {
  try {
    return new SemVer(a).compare(new SemVer(b));
  } catch (err) {
    log.error(`Failed to compare versions ${a} and ${b}`, err);
    // This is bad if it happens, but it's better than crashing, the tea semver library is very permissive
    // and it would be extremely unlikely for this to happen in practice as how would something get bottled in the first place?
    return a.localeCompare(b);
  }
};

// Add a new version to the list of installed versions while maintaining the sort order
export const addInstalledVersion = (
  installedVersions: string[] | undefined,
  newVersion: string
) => {
  if (!installedVersions) {
    return [newVersion];
  }

  return [...installedVersions, newVersion].sort((a, b) => semverCompare(b, a));
};

export const findRecentInstalledVersion = (pkg: GUIPackage) => {
  // this assumes that the versions are already sorted
  return pkg.installed_versions?.[0];
};

export const isInstalling = (pkg: GUIPackage) => {
  return (
    pkg.install_progress_percentage &&
    pkg.install_progress_percentage > 0 &&
    pkg.install_progress_percentage < 100
  );
};

export const fixPackageName = (title: string) => {
  return title.replace("-", "\u2011");
};

// Checks if an installed package is up to date. It is assumed that the package is installed.
export const isPackageUpToDate = (pkg: GUIPackage) => {
  if (!pkg.installed_versions?.length) {
    return false;
  }

  // if the installed version is equal or newer than the latest version, it's up to date
  return semverCompare(pkg.installed_versions[0], pkg.version) >= 0;
};

export const packageWasInstalled = (pkg: GUIPackage) => {
  return pkg.displayState?.state === "INSTALLED";
};

export const packageWasUpdated = (pkg: GUIPackage) => {
  return pkg.displayState?.state === "UPDATED";
};

export const packageHadError = (pkg: GUIPackage) => {
  return pkg.displayState?.state === "ERROR";
};

export const getPackageBadgeText = (pkg: GUIPackage) => {
  // UPDATED is a "pseudo-state" that overrides other states
  const state = packageWasUpdated(pkg) ? "UPDATED" : pkg.state;
  return t.get(`package.cta-${state}`);
};
