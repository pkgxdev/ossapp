<script lang="ts">
	import "$appcss";

	import { PackageStates, type GUIPackage } from "$libs/types";
	import { packagesStore } from "$libs/stores";
	import { onMount } from "svelte";
	import PackageCard from "$components/package-card/package-card.svelte";

	export let tab = "all";
	export let pkg: GUIPackage;
	export let orientation: "bottom" | "left" | "right" = "bottom";

	onMount(() => {
		packagesStore.fetchPackageBottles(pkg.full_name);
	});
</script>

<PackageCard
	{pkg}
	{orientation}
	link="/packages/{pkg.slug}?tab={tab}"
	progessLoading={pkg.install_progress_percentage}
	onClickCTA={async () => {
		if (
			[PackageStates.INSTALLED, PackageStates.INSTALLING, PackageStates.UPDATING].includes(
				pkg.state
			)
		) {
			return;
		}
		packagesStore.installPkg(pkg);
	}}
/>
