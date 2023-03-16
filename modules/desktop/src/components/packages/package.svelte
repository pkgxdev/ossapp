<script lang="ts">
	import '$appcss';
	import PackageCard from '@tea/ui/package-card/package-card.svelte';

	import { t } from '$libs/translations';
	import type { GUIPackage } from '$libs/types';
  import { PackageStates } from '$libs/types';
  import { getPackage } from '@native';
  import { notificationStore } from '$libs/stores';


	export let pkg: GUIPackage;
  export let onClick: () => void;

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
</script>


<PackageCard
  {pkg}
  link={`/packages/${pkg.slug}`}
  ctaLabel={getCTALabel(pkg.state)}
	progessLoading={+fakeLoadingProgress.toFixed(2)}
	ctaType="plain"
	ctaColor={PackageStates.INSTALLED === pkg.state ? "green" : "secondary"}
  onClickCTA={((pkg) => {
		return async () => {
				fakeLoadingProgress = 1;
				startFakeLoader();
				await onClick();
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
	})(pkg)}
/>