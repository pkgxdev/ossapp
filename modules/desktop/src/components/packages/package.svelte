<script lang="ts">
	import '$appcss';
	import PackageCard from '@tea/ui/package-card/package-card.svelte';
	import { t } from '$libs/translations';
	import type { GUIPackage } from '$libs/types';
  import { PackageStates } from '$libs/types';


	export let pkg: GUIPackage;
  export let onClick: () => void;

	const getCTALabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: $t("package.install-label").toUpperCase(),
			[PackageStates.INSTALLED]: $t("package.installed-label").toUpperCase(),
			[PackageStates.INSTALLING]: $t("package.installing-label").toUpperCase(),
			[PackageStates.UNINSTALLED]: $t("package.reinstall-label").toUpperCase(),
			[PackageStates.NEEDS_UPDATE]: $t("package.needs-update-label").toUpperCase(),
		}[state];
	};
</script>

<PackageCard
  {pkg}
  link={`/packages/${pkg.slug}`}
  ctaLabel={getCTALabel(pkg.state)}
  onClickCTA={onClick}
/>