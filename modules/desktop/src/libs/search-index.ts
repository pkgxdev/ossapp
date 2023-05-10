import type { GUIPackage, InstalledPackage, Packages } from "./types";
import Fuse from "fuse.js";
import log from "$libs/logger";

let packagesIndex: Fuse<GUIPackage>;

export function indexPackages(packages: GUIPackage[]) {
  try {
    packagesIndex = new Fuse(packages, {
      keys: ["name", "full_name", "desc", "categories"],
      minMatchCharLength: 3,
      threshold: 0.3
    });
    log.info("refreshed packages fuse index");
  } catch (error) {
    log.error(error);
  }
}

export function searchPackages(term: string, limit = 5): GUIPackage[] {
  if (!term || !packagesIndex) return [];
  // TODO: if online, use algolia else use Fuse
  const res = packagesIndex.search(term, { limit });
  const matchingPackages: GUIPackage[] = res.map((v) => v.item);
  return matchingPackages;
}
