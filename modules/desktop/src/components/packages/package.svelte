<script lang="ts">
	import "$appcss";

	import type { GUIPackage } from "$libs/types";
	import { packagesStore, notificationStore } from "$libs/stores";
	import { onMount } from "svelte";
	import semverCompare from "semver/functions/compare";
	import { clean } from "semver";
	import PackageCard from "$components/package-card/package-card.svelte";

	export let tab = "all";
	export let pkg: GUIPackage;
	export let onClick: (version: string) => void;

	let fakeLoadingProgress = 0;

	const onClickCTA = async (version: string) => {
		await onClick(version);
		notificationStore.add({
			message: `Package ${pkg.full_name} v${pkg.version} has been installed.`
		});
	};

	const findAvailableVersions = (pkg: GUIPackage) => {
		// default to just showing the latest if bottles haven't loaded yet
		if (!pkg.bottles) {
			return [pkg.version];
		}

		const versionSet = new Set<string>();
		for (const b of pkg.bottles) {
			versionSet.add(b.version);
		}

		return Array.from(versionSet).sort((a, b) => semverCompare(cleanVersion(b), cleanVersion(a)));
	};

	const cleanVersion = (version: string) => {
		return clean(version) || "0.0.0";
	};

	onMount(() => {
		packagesStore.fetchPackageBottles(pkg.full_name);
	});
</script>

<PackageCard
	{pkg}
	availableVersions={findAvailableVersions(pkg)}
	link={`/packages/${pkg.slug}?tab=${tab}`}
	{onClickCTA}
/>
