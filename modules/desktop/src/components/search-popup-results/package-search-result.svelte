<script lang="ts">
	import InstallButton from "$components/install-button/install-button.svelte";
	import type { GUIPackage } from "$libs/types";
	import { packagesStore } from "$libs/stores";
	import { onMount } from "svelte";

	import ImgLoader from "@tea/ui/img-loader/img-loader.svelte";
	import { findAvailableVersions } from "$libs/packages/pkg-utils";
  import { goto } from "$app/navigation";
	export let pkg: GUIPackage;
	export let onClick: (_version: string) => Promise<void>;
	export let onClose: () => void;

	onMount(() => {
		packagesStore.fetchPackageBottles(pkg.full_name);
	});

	const availableVersions = findAvailableVersions(pkg);

	const gotoPackagePage = () => {
		goto(`/packages/${pkg.slug}?tab=all`);
		onClose();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<figure class="border-gray flex flex-row gap-2 border p-2">
	<ImgLoader
		on:click={() => gotoPackagePage()}
		class="pkg-image h-16 w-16 object-cover"
		src={!pkg.thumb_image_url.includes("https://tea.xyz")
			? "https://tea.xyz/Images/package-thumb-nolabel4.jpg"
			: pkg.thumb_image_url}
		alt={pkg.name}
	/>
	<header class="flex-grow" on:click={() => gotoPackagePage()}>
		<h1>{pkg.full_name}</h1>
		<p class="line-clamp-2 text-xs">{pkg.desc}</p>
	</header>
	<aside>
		<InstallButton {pkg} {availableVersions} {onClick} />
		<footer class="mt-2 text-center text-xs">v{pkg.version}</footer>
	</aside>
</figure>

<style>
	figure:hover {
		background-color: #252525;
	}
</style>