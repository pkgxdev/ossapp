<script lang="ts">
	import '$appcss';
	import { onMount } from 'svelte';
	import type { Package } from '@tea/ui/types';

	import Gallery from '@tea/ui/gallery/gallery.svelte';
	import {
		featuredPackages as featuredPackagesStore,
		initializeFeaturedPackages
	} from '$libs/stores';

	let featuredPackages: Package[] = [];

	featuredPackagesStore.subscribe((v) => {
		featuredPackages = v;
	});

	onMount(() => {
		if (!featuredPackages.length) {
			initializeFeaturedPackages();
		}
	});
</script>

<Gallery
	title="FEATURED PACKAGES"
	items={featuredPackages.map((pkg) => ({
		title: pkg.full_name,
		subTitle: pkg.maintainer || '',
		imageUrl: pkg.thumb_image_url,
		link: `/packages/${pkg.slug}`
	}))}
/>
