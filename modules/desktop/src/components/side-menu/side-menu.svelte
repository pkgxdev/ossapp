<script lang="ts">
	import '$appcss';
	import { PackageStates, SideMenuOptions } from '$libs/types';
	import { packagesStore } from '$libs/stores';
  import MenuButton from './menu-button.svelte';

  const { packages } = packagesStore;

	export let activeOption:SideMenuOptions;

  $: needsUpdateCount = $packages.filter((p) => p.state === PackageStates.NEEDS_UPDATE).length;

	const selectToggle = (option: SideMenuOptions) => {
		activeOption = option === activeOption ? SideMenuOptions.all : option;
	}
</script>

<aside class="border border-t-0 border-b-0 border-gray p-2">
  <ul class="flex flex-col pt-4 gap-1 pl-1">
    <MenuButton label="Installed" icon="tea-checkmark"
			active={activeOption === SideMenuOptions.installed}
			on:click={() => selectToggle(SideMenuOptions.installed)}
		/>
		{#if needsUpdateCount}
    	<MenuButton label="Updates available" icon="update"
				active={activeOption === SideMenuOptions.installed_updates_available}
				on:click={() => selectToggle(SideMenuOptions.installed_updates_available)}
			/>
		{/if}
    <MenuButton label="Recently updated" icon="back-in-time"
			active={activeOption === SideMenuOptions.recently_updated}
			on:click={() => selectToggle(SideMenuOptions.recently_updated)}
		/>
    <!-- <MenuButton label="New packages" icon="birthday-cake"
			active={activeOption === SideMenuOptions.new_packages}
			on:click={() => selectToggle(SideMenuOptions.new_packages)}
		/> -->
    <MenuButton label="Popular" icon="bar-chart"
			active={activeOption === SideMenuOptions.popular}
			on:click={() => selectToggle(SideMenuOptions.popular)}
		/>
    <MenuButton label="Featured" icon="lightbulb"
			active={activeOption === SideMenuOptions.featured}
			on:click={() => selectToggle(SideMenuOptions.featured)}
		/>
    <MenuButton label="Essentials" icon="square"
			active={activeOption === SideMenuOptions.essentials}
			on:click={() => selectToggle(SideMenuOptions.essentials)}
		/>
    <MenuButton label="Star-struct" icon="star-full"
			active={activeOption === SideMenuOptions.star_struct}
			on:click={() => selectToggle(SideMenuOptions.star_struct)}
		/>
    <MenuButton label="Made by tea" icon="tea-logo-iconasset-1"
			active={activeOption === SideMenuOptions.made_by_tea}
			on:click={() => selectToggle(SideMenuOptions.made_by_tea)}
		/>
  </ul>
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