<script lang="ts">
	import '$appcss';
	import '@tea/ui/icons/icons.css';
	import type { Bottle } from '@tea/ui/types';
	import Button from '@tea/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { getPackageBottles } from '@native';

	import { installPackage } from '@native';
  import { PackageStates, type GUIPackage } from '$libs/types';
	import { packagesStore  } from '$libs/stores';

	export let pkg: GUIPackage;
	let bottles: Bottle[] = [];

	let installing = false;
	onMount(async () => {
		try {
			bottles = await getPackageBottles(pkg.full_name);
		} catch (err) {
			console.error(err);
		}
	});

	const install = async () => {
		installing = true;
		await installPackage(pkg);
		installing = false;
		packagesStore.updatePackage(pkg.full_name, {
			state: PackageStates.INSTALLED,
		});
	}
</script>

<section class="border-gray mt-4 border bg-black">
	<header class="flex p-2">
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
			<p class="font-sono mt-4 text-sm">{pkg.desc}</p>
			<menu class="h-10 grid grid-cols-2 gap-4 mt-4 text-xs">
				{#if pkg.state === PackageStates.INSTALLED}
					<Button type="plain" color="primary">
						Latest version installed v{pkg.version}
					</Button>
				{:else if pkg.state === PackageStates.AVAILABLE}
					<Button type="plain" color="secondary" onClick={install} loading={installing}>
						{installing ? "Installing" : "Install"} v{pkg.version}
					</Button>
				{:else if pkg.state === PackageStates.NEEDS_UPDATE}
					<Button type="plain" color="secondary" onClick={install} loading={installing}>
						{installing ? "Updating" : "Update"}  to v{pkg.version}
					</Button>
				{/if}
				{#if pkg.github}
					<a href={`https://github.com/${pkg.github}`} target="_blank" rel="noreferrer">
						<Button class="border border-gray h-10">View on github</Button>
					</a>
				{/if}
			</menu>
		</article>
	</header>

</section>
