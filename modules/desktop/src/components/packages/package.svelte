<script lang="ts">
	import "$appcss";

	import type { GUIPackage } from "$libs/types";
	import { packagesStore } from "$libs/stores";
	import { onMount } from "svelte";
	import PackageCard from "$components/package-card/package-card.svelte";
	import { findAvailableVersions } from "$libs/packages/pkg-utils";

	export let tab = "all";
	export let pkg: GUIPackage;

	onMount(() => {
		packagesStore.fetchPackageBottles(pkg.full_name);
	});
</script>

<PackageCard
	{pkg}
	availableVersions={findAvailableVersions(pkg)}
	link="/packages/{pkg.slug}?tab={tab}"
	progessLoading={pkg.install_progress_percentage}
	onClickCTA={(version) => packagesStore.installPkg(pkg, version)}
	onUninstall={async () => {
		packagesStore.uninstallPkg(pkg);
	}}
/>
