import type { GUIPackage } from "./types";
import Fuse from "fuse.js";
import log from "$libs/logger";

// TODO: move this to backend

let packagesIndex: Fuse<GUIPackage>;
let ready = false;

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
      includeScore: true,
      shouldSort: true
    });
    log.info("refreshed packages fuse index");
  } catch (error) {
    log.error(error);
  }
}

export async function searchPackages(term: string, limit = 5): Promise<GUIPackage[]> {
  await isIndexReady();
  if (!term || !packagesIndex) return [];
  // TODO: if online, use algolia else use Fuse
  const res = packagesIndex.search(term, { limit });
  const matchingPackages: GUIPackage[] = res.map((v) => v.item);
  return matchingPackages;
}

export async function isIndexReady(): Promise<boolean> {
  if (ready) return true;
  return new Promise((resolve) => {
    const intervalCancel = setInterval(() => {
      if (packagesIndex) {
        const [grep] = packagesIndex.search("grep");
        if (grep) {
          clearInterval(intervalCancel);
          ready = true;
          resolve(true);
        }
      }
    }, 1000);
  });
}
