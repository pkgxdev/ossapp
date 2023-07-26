import type { GUIPackage } from "./types";
import Fuse from "fuse.js";
import log from "$libs/logger";
import Decimal from "decimal.js";

let packagesIndex: Fuse<GUIPackage>;

export function indexPackages(packages: GUIPackage[]) {
  try {
    packagesIndex = new Fuse(packages, {
      keys: [
        {
          name: "name",
          weight: 0.5
        },
        {
          name: "full_name",
          weight: 0.5
        },
        {
          name: "description",
          weight: 0.3
        },
        {
          name: "categories",
          weight: 0.2
        },
        {
          name: "keywords",
          weight: 0.5
        }
      ],
      minMatchCharLength: 3,
      threshold: 0.3,
      includeScore: true
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
  const matchingPackages: GUIPackage[] = res
    .sort((a, b) => {
      const aScore = new Decimal(a.score!);
      const bScore = new Decimal(b.score!);
      return aScore.minus(bScore).toNumber();
    })
    .map((v) => v.item);
  return matchingPackages;
}
