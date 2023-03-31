<script lang="ts">
	import '$appcss';
	import { PackageStates, SideMenuOptions } from '$libs/types';
	import { packagesStore } from '$libs/stores';
  import MenuButton from './menu-button.svelte';
	import { t } from '$libs/translations'; 
  const { packages } = packagesStore;

	export let activeOption:SideMenuOptions;

  $: needsUpdateCount = $packages.filter((p) => p.state === PackageStates.NEEDS_UPDATE).length;

	const selectToggle = (option: SideMenuOptions) => {
		activeOption = option === activeOption ? SideMenuOptions.all : option;
	}
</script>

<aside class="border border-t-0 border-b-0 border-l-0 border-gray p-2">
  <ul class="flex flex-col pt-4 gap-1 pl-1">
    <MenuButton label="Installed" icon="tea-checkmark"
			active={activeOption === SideMenuOptions.installed}
			on:click={() => selectToggle(SideMenuOptions.installed)}
		/>
		<hr/>
		{#if needsUpdateCount}
    	<MenuButton label={$t("tags.updates_available")} icon="update"
				active={activeOption === SideMenuOptions.installed_updates_available}
				on:click={() => selectToggle(SideMenuOptions.installed_updates_available)}
			/>
			<hr/>
		{/if}
    <MenuButton label={$t("tags.recently_updated")} icon="back-in-time"
			active={activeOption === SideMenuOptions.recently_updated}
			on:click={() => selectToggle(SideMenuOptions.recently_updated)}
		/>
		<hr/>
    <MenuButton label={$t("tags.new_packages")} icon="birthday-cake"
			active={activeOption === SideMenuOptions.new_packages}
			on:click={() => selectToggle(SideMenuOptions.new_packages)}
		/>
		<hr/>
    <MenuButton label={$t("tags.popular")} icon="bar-chart"
			active={activeOption === SideMenuOptions.popular}
			on:click={() => selectToggle(SideMenuOptions.popular)}
		/>
		<hr/>
    <MenuButton label={$t("tags.featured")} icon="lightbulb"
			active={activeOption === SideMenuOptions.featured}
			on:click={() => selectToggle(SideMenuOptions.featured)}
		/>
		<hr/>
    <MenuButton label={$t("tags.essentials")} icon="square"
			active={activeOption === SideMenuOptions.essentials}
			on:click={() => selectToggle(SideMenuOptions.essentials)}
		/>
		<hr/>
    <MenuButton label={$t("tags.star_struct")} icon="star-full"
			active={activeOption === SideMenuOptions.star_struct}
			on:click={() => selectToggle(SideMenuOptions.star_struct)}
		/>
		<hr/>
    <MenuButton label={$t("tags.made_by_tea")} icon="tea-logo-iconasset-1"
			active={activeOption === SideMenuOptions.made_by_tea}
			on:click={() => selectToggle(SideMenuOptions.made_by_tea)}
		/>
  </ul>
</aside>

<style>
	aside {
		position: absolute;
		left: 0px;
		top: 0px;
		height: calc(100vh - 48px - 27px); /* win.height - title-bar.height - footer.height */
		width: 190px;
		box-sizing: border-box;
	}

	hr {
		border-top: 1px solid #272626;
	}
</style>