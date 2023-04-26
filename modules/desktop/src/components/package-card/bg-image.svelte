<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { onMount } from "svelte";
	import { packagesStore } from "$libs/stores";

	let clazz = '';
	export { clazz as class };

  export let layout: "bottom" | "right" | "left" | "none" = "bottom";

  export let pkg: GUIPackage;

	const defaultImgUrl = "/images/default-thumb.jpg";
  let loadedImg = "";
  let loaded = false;

  const loadImage = async (url:string): Promise<string> => {
    const image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        loadedImg = url;
        setTimeout(() => {
          loaded = true;
        }, 300);
        resolve(url);
      };
      image.onerror = () => {
        reject(new Error(`file/url does not exist ${url}`));
      };
    });
  };

  const recachePkg = async () => {
    const url = await packagesStore.cachePkgImage(pkg)
    loadImage(url);
  }

	onMount(() => {
    if (pkg.cached_image_url) {
      loadImage(pkg.cached_image_url)
        .catch(() => {
          if (pkg.thumb_image_url) {
            loadImage(pkg.thumb_image_url);
            recachePkg();
          }
        });
    } else if (pkg.thumb_image_url) {
      recachePkg();
    }
	});
</script>

<section class="bg-black {clazz} {layout}">
	<i class="logo icon-tea-logo-iconasset-1 text-gray text-3xl animate-pulse {layout}"/>	
  <div class="bg-center transition-all opacity-0 duration-500" class:opacity-100={loaded} style="background-image: url({loadedImg})">
  <!-- dup image: save processing power instead of computing the blur across all the HTML layers -->
	{#if layout !== "none"}
		<aside class="blur-sm {layout} transition-all opacity-0 duration-500" class:opacity-100={loaded}>
			<figure class="bg-center" style="background-image: url({loadedImg})" />
		</aside>
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
		width: 100%;
		height: 100%;
		background-size: cover;
		box-sizing: border-box;
		background-repeat: no-repeat;
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
		width: 40%;
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
	}
  aside.bottom figure {
    left: 0px;
  }
  aside.right figure {
		height: 100%;
		width: 150%;
		right: 0px;
	}
	aside.left figure {
		height: 100%;
		width: 250%;
		left: 0px;
	}
</style>