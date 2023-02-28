<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations';
	import type { GUIPackage } from '$libs/types';
	import { PackageStates } from '$libs/types';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';
	import PackageCard from '@tea/ui/package-card/package-card.svelte';
	import { packagesStore } from '$libs/stores';

	import { installPackage } from '@native';
	import { trackInstall, trackInstallFailed } from '$libs/analytics';

	export let title = 'Packages';
	export let category = ''; // filter

	let packages: GUIPackage[] = [];

	const getCTALabel = (state: PackageStates): string => {
		return {
			[PackageStates.AVAILABLE]: $t("package.install-label").toUpperCase(),
			[PackageStates.INSTALLED]: $t("package.installed-label").toUpperCase(),
			[PackageStates.INSTALLING]: $t("package.installing-label").toUpperCase(),
			[PackageStates.UNINSTALLED]: $t("package.reinstall-label").toUpperCase(),
		}[state];
	};

	packagesStore.subscribe((ps) => {
		packages = category ?
			ps.filter((p) => (p.categories || []).includes(category)) :
			ps;
	});
</script>

<header class="border-gray text-primary flex items-center justify-between border bg-black p-4">
	<span>{title}</span>
	<a href="/packages" class="font-sono text-sm underline">{$t("package.view-all-cta")}</a>
</header>
<ul class="grid grid-cols-3 bg-black">
	{#if packages.length > 0}
		{#each packages as pkg}
			<div class={pkg.state === PackageStates.INSTALLING ? 'animate-pulse' : ''}>
				<PackageCard
					{pkg}
					link={`/packages/${pkg.slug}`}
					ctaLabel={getCTALabel(pkg.state)}
					onClickCTA={async () => {
						try {
							pkg.state = PackageStates.INSTALLING;
							await installPackage(pkg.full_name);
							trackInstall(pkg.full_name);
							pkg.state = PackageStates.INSTALLED;
						} catch (error) {
							let message = 'Unknown Error'
  						if (error instanceof Error) message = error.message
							trackInstallFailed(pkg.full_name, message || "unknown");
						}
					}}
				/>
			</div>
		{/each}
	{:else}
		{#each Array(9) as _}
			<section class="h-50 border-gray border p-4">
				<Preloader />
			</section>
		{/each}
	{/if}
</ul>
