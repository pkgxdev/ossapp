<script lang="ts">
	import "$appcss";
	import { PackageStates, SideMenuOptions } from "$libs/types";
	import { packagesStore } from "$libs/stores";
	import MenuButton from "./menu-button.svelte";
	import { t } from "$libs/translations";
	import { goto } from "$app/navigation";
	const { packageList } = packagesStore;

	export let activeOption: SideMenuOptions;

	$: needsUpdateCount = $packageList.filter((p) => p.state === PackageStates.NEEDS_UPDATE).length;
</script>

<aside class="border-gray border border-t-0 border-b-0 border-l-0 p-2">
	<ul class="flex flex-col gap-1 pt-4 pl-1">
		<MenuButton
			label="Installed"
			icon="tea-checkmark"
			active={activeOption === SideMenuOptions.installed}
			on:click={() => goto(`/?tab=${SideMenuOptions.installed}`)}
		/>
		<hr />
		{#if needsUpdateCount}
			<MenuButton
				label={$t("tags.installed_updates_available")}
				icon="update"
				active={activeOption === SideMenuOptions.installed_updates_available}
				on:click={() => goto(`/?tab=${SideMenuOptions.installed_updates_available}`)}
			>
				<div class="update-count-badge">{needsUpdateCount}</div>
			</MenuButton>
			<hr />
		{/if}
		<MenuButton
			label={$t("tags.recently_updated")}
			icon="back-in-time"
			active={activeOption === SideMenuOptions.recently_updated}
			on:click={() => goto(`/?tab=${SideMenuOptions.recently_updated}`)}
		/>
		<hr />
		<MenuButton
			label={$t("tags.new_packages")}
			icon="birthday-cake"
			active={activeOption === SideMenuOptions.new_packages}
			on:click={() => goto(`/?tab=${SideMenuOptions.new_packages}`)}
		/>
		<hr />
		<MenuButton
			label={$t("tags.popular")}
			icon="bar-chart"
			active={activeOption === SideMenuOptions.popular}
			on:click={() => goto(`/?tab=${SideMenuOptions.popular}`)}
		/>
		<hr />
		<MenuButton
			label={$t("tags.featured")}
			icon="lightbulb"
			active={activeOption === SideMenuOptions.featured}
			on:click={() => goto(`/?tab=${SideMenuOptions.featured}`)}
		/>
		<hr />
		<MenuButton
			label={$t("tags.essentials")}
			icon="square"
			active={activeOption === SideMenuOptions.essentials}
			on:click={() => goto(`/?tab=${SideMenuOptions.essentials}`)}
		/>
		<hr />
		<MenuButton
			label={$t("tags.starstruck")}
			icon="star-full"
			active={activeOption === SideMenuOptions.starstruck}
			on:click={() => goto(`/?tab=${SideMenuOptions.starstruck}`)}
		/>
		<hr />
		<MenuButton
			label={$t("tags.made_by_tea")}
			icon="tea-logo-iconasset-1"
			active={activeOption === SideMenuOptions.made_by_tea}
			on:click={() => goto(`/?tab=${SideMenuOptions.made_by_tea}`)}
		/>
	</ul>
</aside>

<style>
	aside {
		position: absolute;
		left: 0px;
		top: 0px;
		height: calc(100vh - 48px); /* win.height - title-bar.height */
		width: 210px;
		box-sizing: border-box;
	}

	hr {
		border-top: 1px solid #272626;
	}

	.update-count-badge {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		background: #ff4100;
		font-size: 11px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		margin-left: 4px;
	}
</style>
