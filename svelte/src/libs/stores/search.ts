import { writable } from "svelte/store";
import type { GUIPackage, AirtablePost } from "$libs/types";

import { trackSearch } from "../analytics";
import pkgStore from "./pkgs";

export const searching = writable<boolean>(false);
export const packagesSearch = writable<GUIPackage[]>([]);
export const postsSearch = writable<AirtablePost[]>([]);
export const search = async (term: string) => {
  try {
    if (term) {
      const [
        resultPkgs
        // resultPosts
      ] = await Promise.all([
        pkgStore.search(term, 5)
        // postsStore.search(term, 10)
      ]);
      trackSearch(term, resultPkgs.length);
      packagesSearch.set(resultPkgs);
      // postsSearch.set(resultPosts);
    } else {
      packagesSearch.set([]);
      // postsSearch.set([]);
    }
  } catch (error) {
    console.error(error);
  }
};
