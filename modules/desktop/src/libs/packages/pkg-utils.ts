import type { GUIPackage } from "$libs/types";
import { clean } from "semver";
import semverCompare from "semver/functions/compare";

// Find a list of available versions for a package based on the bottles
export const findAvailableVersions = (pkg: GUIPackage) => {
	// default to just showing the latest if bottles haven't loaded yet
	if (!pkg.bottles) {
		return [pkg.version];
	}

	const versionSet = new Set<string>();
	for (const b of pkg.bottles) {
		versionSet.add(b.version);
	}

	return Array.from(versionSet).sort((a, b) => semverCompare(cleanVersion(b), cleanVersion(a)));
};

export const cleanVersion = (version: string) => clean(version) || "0.0.0";
