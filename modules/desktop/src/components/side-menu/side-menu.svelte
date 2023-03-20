<script lang="ts">
	import '$appcss';
	import Checkbox from "@tea/ui/checkbox/checkbox.svelte";
	import { PackageStates } from '$libs/types';
	import { packagesStore } from '$libs/stores';
  import MenuButton from './menu-button.svelte';

  const { packages } = packagesStore;

	// export let stateFilters = {
	// 	[PackageStates.AVAILABLE]: false,
	// 	[PackageStates.NEEDS_UPDATE]: false,
	// 	[PackageStates.INSTALLED]: false,
	// }

  $: needsUpdateCount = $packages.filter((p) => p.state === PackageStates.NEEDS_UPDATE).length;
</script>

<aside class="border border-t-0 border-b-0 border-gray p-2">
  <ul class="flex flex-col pt-4 pl-1">
    <MenuButton label="Installed" icon="tea-checkmark" active={true}/>
    <MenuButton label="Updates available" icon="update"/>
    <MenuButton label="Recently updated" icon="back-in-time"/>
    <MenuButton label="Popular" icon="bar-chart"/>
    <MenuButton label="Featured" icon="lightbulb"/>
    <MenuButton label="Essentials" icon="square"/>
    <MenuButton label="Star-struct" icon="star-full"/>
    <MenuButton label="Made by tea" icon="tea-logo-iconasset-1"/>
  </ul>
	<!-- <ul>
		<li>
			<Checkbox label={"Not installed"} bind:checked={stateFilters[PackageStates.AVAILABLE]} />
		</li>
		<li>
			<Checkbox label={"Installed"} bind:checked={stateFilters[PackageStates.INSTALLED]} />
		</li>
		{#if needsUpdateCount}
			<li>
				<Checkbox label={`Update Available [${needsUpdateCount}]`} bind:checked={stateFilters[PackageStates.NEEDS_UPDATE]} />
			</li>
		{/if}
	</ul> -->
</aside>

<style>
	aside {
		position: fixed;
		top: 40px;
		left: 0px;
		height: calc(100% - 40px);
		width: 190px;
	}
</style>