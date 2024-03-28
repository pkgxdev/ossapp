import type { GUIPackage } from "./types";
import Fuse from "fuse.js";
import log from "$libs/logger";

// TODO: move this to backend

let packagesIndex: Fuse<GUIPackage>;
let ready = false;

// Set search timeout (milliseconds)
const SEARCH_TIMEOUT_MS = 10000;

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
  
  // Use try-catch to catch exceptions in asynchronous operations
  try {
    // Set timeout using Promise.race
    const matchingPackages = await Promise.race([
      packagesIndex.search(term, { limit }), // TODO: if online, use algolia else use Fuse
      new Promise((resolve) => setTimeout(resolve, SEARCH_TIMEOUT_MS))
    ]);
    
    // Return matching packages
    return matchingPackages.map((v) => v.item);
  } catch (error) {
    console.error('Error searching packages:', error);
    return [];
  }
}

export async function isIndexReady(): Promise<void> {
  // If the index is ready, return immediately
  if (ready) return;
  
  // Set a timer to check whether the index is ready every second
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (packagesIndex) {
        const [grep] = packagesIndex.search("grep");
        if (grep) {
          clearInterval(interval);
          ready = true;
          resolve();
        }
      }
    }, 1000);
  });
}
