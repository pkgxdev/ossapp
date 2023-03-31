<script lang="ts">
	import "$appcss";
	import "@tea/ui/icons/icons.css";
	import Button from "@tea/ui/button/button.svelte";

	import { installPackage } from "@native";
	import { PackageStates, type GUIPackage } from "$libs/types";
	import { packagesStore } from "$libs/stores";
	import { shellOpenExternal } from "@native";
	import InstallButton from "$components/install-button/install-button.svelte";
	import { findAvailableVersions } from "$libs/packages/pkg-utils";

	export let pkg: GUIPackage;
	let installing = false;

	const install = async () => {
		installing = true;
		await installPackage(pkg);
		installing = false;
		packagesStore.updatePackage(pkg.full_name, {
			state: PackageStates.INSTALLED
		});
	};
</script>

<section class="mt-4 bg-black">
	<header class="flex">
		<figure class="grow-1 w-1/3">
			<img width={260} src={pkg.thumb_image_url} alt={pkg.full_name} />
		</figure>
		<article class="w-2/3 p-4 pt-8">
			<h3 class="text-primary text-3xl">{pkg.full_name}</h3>
			{#if pkg.homepage}
				<a target="_blank" rel="noreferrer" href={pkg.homepage}>
					<span>{pkg.homepage}</span>
				</a>
			{/if}
			<p class="mt-4 text-sm">{pkg.desc}</p>
			<menu class="mt-4 grid h-10 grid-cols-2 gap-4 text-xs">
				<InstallButton
					buttonSize="large"
					{pkg}
					availableVersions={findAvailableVersions(pkg)}
					onClick={install}
				/>
				{#if pkg.github}
					<Button
						class="border-gray h-10 border"
						onClick={() => {
							shellOpenExternal(`https://github.com/${pkg.github}`);
						}}>View on github</Button
					>
				{/if}
			</menu>
		</article>
	</header>
</section>
