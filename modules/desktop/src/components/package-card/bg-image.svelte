<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { onMount } from "svelte";
	import { packagesStore } from "$libs/stores";

	let clazz = '';
	export { clazz as class };

  export let layout: "bottom" | "right" | "left" = "bottom";

  export let pkg: GUIPackage;

	$: imgUrl = pkg?.cached_image_url || (!pkg.thumb_image_url.includes("https://tea.xyz")
		? "/images/default-thumb.jpg"
		: pkg.thumb_image_url);

	onMount(() => {
		if (pkg && !pkg?.cached_image_url) packagesStore.cachePkgImage(pkg);
	});
</script>

<section class="{clazz} {layout}"
  style="background-image: url({imgUrl})">
	<aside class="blur-sm {layout}">
		<figure class="bg-center" style="background-image: url({imgUrl})" />
	</aside>
</section>

<style>
  figure {
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 340px;
		background-size: cover;
		background-repeat: no-repeat;
	}
  aside {
		position: absolute;
		bottom: 0px;
		width: 100%;
		height: 50%;
		overflow: hidden;
	}
	aside.bottom {
		left: 0px;
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

</style>