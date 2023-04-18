<script lang="ts">
	import "$appcss";
	import "@tea/ui/icons/icons.css";
	import { t } from "$libs/translations";
	import Button from "@tea/ui/button/button.svelte";
	import ToolTip from "@tea/ui/tool-tip/tool-tip.svelte";
	import semverCompare from "semver/functions/compare";

	import type { GUIPackage } from "$libs/types";
	import { packagesStore } from "$libs/stores";
	import { shellOpenExternal } from "@native";
	import { findAvailableVersions, findRecentInstalledVersion } from "$libs/packages/pkg-utils";
	import { trimGithubSlug } from "$libs/github";
	import PackageVersionSelector from "$components/package-install-button/package-version-selector.svelte";

	export let pkg: GUIPackage;
	let installing = false;
	let pruning = false;

	const install = async (version: string) => {
		installing = true;
		await packagesStore.installPkg(pkg, version);
		installing = false;
	};

	const prune = async () => {
		pruning = true;
		const versions = (pkg?.installed_versions || []).sort((a, b) => semverCompare(b, a));
		for (const [i, v] of versions.entries()) {
			if (i) {
				// skip the latest version = 0
				await packagesStore.deletePkg(pkg, v);
			}
		}
		pruning = false;
	};
</script>

<section class="mt-4 bg-black">
	<header class="flex">
		<figure class="grow-1 w-1/3">
			<img class="w-full" src={pkg.thumb_image_url} alt={pkg.full_name} />
		</figure>
		<article class="w-2/3 p-4 pt-8">
			<h3 class="text-primary text-3xl">{pkg.full_name}</h3>
			{#if pkg.homepage}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					class="hover:text-primary cursor-pointer"
					on:click={() => shellOpenExternal(pkg.homepage)}>{pkg.homepage}</span
				>
			{/if}
			<p class="mt-4 text-sm">{pkg.desc}</p>
			<menu class="mt-4 grid h-10 grid-cols-3 gap-4 text-xs">
				<PackageVersionSelector
					buttonSize="large"
					{pkg}
					availableVersions={findAvailableVersions(pkg)}
					onClick={install}
					uninstall={async () => {
						packagesStore.uninstallPkg(pkg);
					}}
				/>
				{#if (pkg?.installed_versions?.length || 0) > 1}
					<ToolTip>
						<Button
							slot="target"
							class="h-10"
							type="plain"
							color="blue"
							onClick={prune}
							loading={pruning}
						>
							<div class="version-item flex w-full items-center justify-center gap-x-1 text-xs">
								<div class="icon-scissors" />
								<div>{$t("package.cta-PRUNE")}</div>
							</div>
						</Button>
						<div slot="tooltip-content" class="flex flex-col items-center">
							<div>Removes {pkg.installed_versions?.length ?? 0 - 1} old versions</div>
							<div>Keeps latest (v{findRecentInstalledVersion(pkg)})</div>
						</div>
					</ToolTip>
				{/if}
				{#if pkg.github}
					<Button
						class="h-10"
						type="plain"
						color="black"
						onClick={() => {
							if (pkg.github) {
								const slug = trimGithubSlug(pkg.github);
								shellOpenExternal(`https://github.com/${slug}`);
							}
						}}>{$t("common.view-on-github")}</Button
					>
				{/if}
			</menu>
		</article>
	</header>
</section>
