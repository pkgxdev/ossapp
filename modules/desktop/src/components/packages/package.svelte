<script lang="ts">
	import "$appcss";

	import type { GUIPackage } from "$libs/types";
	import { packagesStore, notificationStore } from "$libs/stores";
	import { onMount } from "svelte";
	import PackageCard from "$components/package-card/package-card.svelte";
	import { findAvailableVersions } from "$libs/packages/pkg-utils";

	export let tab = "all";
	export let pkg: GUIPackage;
	export let onClick: (version: string) => void;

	const onClickCTA = async (version: string) => {
		await onClick(version);
		notificationStore.add({
			message: `Package ${pkg.full_name} v${version || pkg.version} has been installed.`
		});
	};

	onMount(() => {
		packagesStore.fetchPackageBottles(pkg.full_name);
	});
</script>

<PackageCard
	{pkg}
	availableVersions={findAvailableVersions(pkg)}
	link="/packages/{pkg.slug}?tab={tab}"
	progessLoading={pkg.install_progress_percentage}
	{onClickCTA}
/>
