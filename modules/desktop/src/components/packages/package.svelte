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

	let fakeTimer: NodeJS.Timer;

	async function startFakeLoader() {
		let ms = 100;
		let assumedDlSpeedMb = 1024 * 1024 * 3; // 3mbps
		const p = await getPackage(pkg.full_name);
		const size = (p?.bottles?.length ? p.bottles[0].bytes : assumedDlSpeedMb*10);
		const eta = size / assumedDlSpeedMb;

		const increment = (1 / eta)/10;

		fakeTimer = setInterval(() => {
			const progressLeft = 100 - fakeLoadingProgress;
			const addProgress = progressLeft * increment;
			fakeLoadingProgress = fakeLoadingProgress + addProgress;
		}, ms);
	}

	const onClickCTA = async (version: string) => {
		fakeLoadingProgress = 1;
		startFakeLoader();
		await onClick(version);
		await new Promise((resolve) => {
			setTimeout(() => {
				notificationStore.add({
					message: `Package ${pkg.full_name} v${pkg.version} has been installed.`,
				});
				clearTimeout(fakeTimer);
				fakeLoadingProgress = 100;
				resolve(null);
			}, 1500);
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

		return Array.from(versionSet).sort((a, b) => semverCompare(b, a));
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
	progessLoading={+fakeLoadingProgress.toFixed(2)}
	ctaType="plain"
	ctaColor={PackageStates.INSTALLED === pkg.state ? "green" : "secondary"}
  {onClickCTA}
/>
