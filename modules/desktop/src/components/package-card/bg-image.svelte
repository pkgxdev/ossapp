<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { onMount } from "svelte";
  import { packagesStore } from "$libs/stores";

  let clazz = "";
  export { clazz as class };

  export let layout: "bottom" | "right" | "left" | "none" = "bottom";

  export let pkg: GUIPackage;

  const defaultImgUrl = "/images/default-thumb.jpg";
  $: loadedImg = "";
  let loaded = false;
  let lastProcessedPkg: GUIPackage | null = null;

  const loadImage = async (url: string): Promise<string> => {
    if (url.includes("cached_images")) {
      loadedImg = url;
      loaded = true;
      return url;
    }

    const image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        loadedImg = url;
        setTimeout(() => {
          loaded = true;
        }, 100);
        resolve(url);
      };
      image.onerror = () => {
        reject(new Error(`file/url does not exist ${url}`));
      };
    });
  };

  const recachePkg = async () => {
    const url = await packagesStore.cachePkgImage(pkg);
    loadImage(url);
  };

  const getCache = async () => {
    if (pkg.cached_image_url) {
      loadImage(pkg.cached_image_url).catch(() => {
        if (pkg.thumb_image_url) {
          loadImage(pkg.thumb_image_url);
          recachePkg();
        }
      });
    } else if (pkg.thumb_image_url) {
      recachePkg();
    }
  };

  $: {
    if (pkg && pkg?.slug !== lastProcessedPkg?.slug) {
      loaded = false;
      loadedImg = "";
      lastProcessedPkg = pkg;
      getCache();
    }
  }
</script>

<section class="relative overflow-hidden bg-black {clazz} {layout}">
  <i
    class="logo icon-tea-logo-iconasset-1 text-3xl text-gray {layout}"
    class:animate-pulse={!pkg.thumb_image_url}
  />
  <div
    class="absolute opacity-0 transition-all duration-500 {layout}"
    class:opacity-100={loaded}
    style="background-image: url({loadedImg})"
  />
  {#if layout !== "none"}
    <div
      class="copyblur absolute opacity-0 blur-sm transition-all duration-500 {layout}"
      class:opacity-100={loaded}
      style="background-image: url({loadedImg})"
    />
  {/if}
</section>

<style>
  section {
    width: 100%;
    height: 100%;
  }

  .logo {
    position: absolute;
    width: 30px;
    height: 30px;
    margin-left: -15px;
  }
  .logo.none {
    left: 50%;
    top: 50%;
  }
  .logo.bottom {
    left: 50%;
    top: 30%;
  }
  .logo.right {
    left: 22%;
    top: 50%;
    margin-top: -15px;
  }
  .logo.left {
    left: 70%;
    top: 50%;
    margin-top: -15px;
  }

  div {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 200%;
    height: 200%;
    background-size: cover;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  div.left {
    background-position: 200px 50%;
    bottom: -50%;
    left: -50%;
  }
  div.right {
    background-position: -250px 50%;
    bottom: -50%;
    left: -50%;
  }
  div.bottom {
    background-position: 50% -70px;
    bottom: -50%;
    left: -50%;
  }

  div.copyblur.bottom {
    clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%);
  }

  div.copyblur.left {
    clip-path: polygon(0 0, 55% 0, 55% 100%, 0% 100%);
  }

  div.copyblur.right {
    clip-path: polygon(45% 0, 100% 0, 100% 100%, 45% 100%);
  }
</style>
