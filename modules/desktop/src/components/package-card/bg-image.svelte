<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { onMount } from "svelte";
  import { packagesStore } from "$libs/stores";
  import { checkFileExists } from "$libs/native-electron";

  let clazz = "";
  export { clazz as class };

  export let layout: "bottom" | "right" | "left" | "none" = "bottom";

  export let pkg: GUIPackage;

  const defaultImgUrl = "/images/default-thumb.jpg";
  $: loadedImg = "";
  let loaded = false;
  let lastProcessedPkg: GUIPackage | null = null;

  const loadImage = async (url: string): Promise<string> => {
    //console.log("**** LOADING IMAGE", url);
    if (url.startsWith("file://") && url.includes("cached_images")) {
      // We are purposely not awaiting this promise because it affects performance,
      // try to load the image optimistically and if it fails, this will cause a reload
      //console.log("**** LOADIN FROM CACHE");
      const fileName = url.replace("file://", "");
      checkFileExists(fileName).then((exists) => {
        if (!exists) {
          console.log("******* file doesn't exist, recaching");
          loadedImg = defaultImgUrl;
          recachePkg();
        }
      });

      console.log("**** SET LOADED IMAGE FROM CACHE", url);
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
    console.log("**** RECACHE");
    const url = await packagesStore.cachePkgImage(pkg);
    loadImage(url);
  };

  const getCache = async () => {
    //console.log("**** GETTING CACHE", pkg);
    if (pkg.cached_image_url) {
      loadImage(pkg.cached_image_url).catch(() => {
        if (pkg.thumb_image_url) {
          // I think we don't need this because recache will work
          //loadImage(pkg.thumb_image_url);
          recachePkg();
        }
      });
    } else if (pkg.thumb_image_url) {
      recachePkg();
    }
  };

  $: {
    if (pkg && pkg?.slug !== lastProcessedPkg?.slug) {
      console.log("***** BG IMAGE")
      loaded = false;
      loadedImg = "";
      lastProcessedPkg = pkg;
      getCache();
    }
  }
</script>

<section class="overflow-hidden bg-black {clazz} {layout}">
  <i
    class="logo icon-tea-logo-iconasset-1 text-3xl text-gray {layout}"
    class:animate-pulse={!pkg.thumb_image_url}
  />
  <div
    class="opacity-0 transition-all duration-500 {layout}"
    class:opacity-100={loaded}
    style="background-image: url({loadedImg})"
  >
    <!-- dup image: save processing power instead of computing the blur across all the HTML layers -->
    {#if layout !== "none"}
      <aside
        class="blur-sm {layout} opacity-0 transition-all duration-500"
        class:opacity-100={loaded}
      >
        <figure class={layout} style="background-image: url({loadedImg})" />
      </aside>
    {/if}
  </div>
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
    width: 100%;
    height: 100%;
    background-size: cover;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  div.left {
    background-position: 200px 50%;
  }
  div.right {
    background-repeat: repeat;
    background-position: -250px 50%;
  }
  div.bottom {
    background-repeat: repeat;
    background-position: 50% -70px;
  }
  aside {
    position: absolute;
    bottom: 0px;
    width: 100%;
    overflow: hidden;
  }
  aside.bottom {
    left: 0px;
    height: 50%;
  }

  aside.left {
    left: 0px;
    height: 100%;
    width: 60%;
  }

  aside.right {
    height: 100%;
    right: 0px;
    width: 60%;
  }

  figure {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 338px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  figure.left {
    background-repeat: repeat;
    background-position: 200px 50%;
  }

  figure.right {
    background-repeat: repeat;
    background-position: -250px 50%;
  }
  figure.bottom {
    background-repeat: repeat;
    background-position: 50% -70px;
  }

  aside.bottom figure {
    left: 0px;
  }

  aside.right figure {
    height: 100%;
    /* the overlay is 60% of the image, so we need to oversize the background image back to 100% */
    width: 166.6666666%;
    right: 0px;
  }

  aside.left figure {
    height: 100%;
    /* the overlay is 60% of the image, so we need to oversize the background image back to 100% */
    width: 166.66666666%;
    left: 0px;
  }
</style>
