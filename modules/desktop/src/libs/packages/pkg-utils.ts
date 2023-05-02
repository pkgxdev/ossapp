import type { GUIPackage } from "$libs/types";
import { clean } from "semver";
import semverCompare from "semver/functions/compare";

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

  return Array.from(versionSet).sort((a, b) => semverCompare(cleanVersion(b), cleanVersion(a)));
};

export const cleanVersion = (version: string) => clean(version) || "0.0.0";

// Add a new version to the list of installed versions while maintaining the sort order
export const addInstalledVersion = (
  installedVersions: string[] | undefined,
  newVersion: string
) => {
  if (!installedVersions) {
    return [newVersion];
  }

  return [...installedVersions, newVersion].sort((a, b) =>
    semverCompare(cleanVersion(b), cleanVersion(a))
  );
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
