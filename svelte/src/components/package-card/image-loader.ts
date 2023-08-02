import { packagesStore } from "$libs/stores";
import { defaultImgUrl } from "$libs/types";

export async function loadPkgImage(
  project: string,
  hasImage: boolean,
  url?: string,
  cachedImageUrl?: string
) {
  if (!url || !hasImage) {
    return defaultImgUrl;
  }

  if (cachedImageUrl) {
    // Don't wait for the image to cache, go ahead and return the url, this will cache the image in the background
    // and force a re-render when the image is cached
    packagesStore.cachePkgImage(project, url, cachedImageUrl);
    return cachedImageUrl;
  }

  // If we don't have a cached image url, we need to grab the image and cache it
  return await packagesStore.cachePkgImage(project, url, cachedImageUrl);
}
