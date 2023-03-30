<script lang="ts">
	import '$appcss';
	import PackageCard from '@tea/ui/package-card/package-card.svelte';

	import { t } from '$libs/translations';
	import type { GUIPackage } from '$libs/types';
  import { PackageStates } from '$libs/types';
  import { getPackage } from '@native';
  import { packagesStore, notificationStore } from '$libs/stores';
  import { onMount } from 'svelte';
	import semverCompare from "semver/functions/compare";
	import { clean } from "semver";

	export let tab = "all";
	export let pkg: GUIPackage;
  export let onClick: (version: string) => void;

	let fakeLoadingProgress = 0;

	const getCTALabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: $t("package.install-label").toUpperCase(),
			[PackageStates.INSTALLED]: $t("package.installed-label").toUpperCase(),
			[PackageStates.INSTALLING]: $t("package.installing-label").toUpperCase(),
			[PackageStates.UNINSTALLED]: $t("package.reinstall-label").toUpperCase(),
			[PackageStates.NEEDS_UPDATE]: $t("package.needs-update-label").toUpperCase(),
		}[state];
	};

	const onClickCTA = async (version: string) => {
		await onClick(version);
		notificationStore.add({
			message: `Package ${pkg.full_name} v${pkg.version} has been installed.`,
		});
	}

	const findAvailableVersions = (pkg: GUIPackage) => {
		// default to just showing the latest if bottles haven't loaded yet
		if (!pkg.bottles) {
			return [pkg.version]
		}

		const versionSet = new Set<string>()
		for (const b of pkg.bottles) {
			versionSet.add(b.version)
		}

		return Array.from(versionSet).sort((a, b) => semverCompare(cleanVersion(b), cleanVersion(a)));
	}

	const cleanVersion = (version: string) => {
		return clean(version) || '0.0.0';
	}

	onMount(() => {
		packagesStore.fetchPackageBottles(pkg.full_name)
	});
</script>


<PackageCard
  {pkg}
	availableVersions={findAvailableVersions(pkg)}
  link={`/packages/${pkg.slug}?tab=${tab}`}
  ctaLabel={getCTALabel(pkg.state)}
	progessLoading={pkg.install_progress_percentage}
	ctaType="plain"
	ctaColor={PackageStates.INSTALLED === pkg.state ? "green" : "secondary"}
  {onClickCTA}
/>
