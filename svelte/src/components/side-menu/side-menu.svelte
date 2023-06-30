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
  $: hasLocalPackages = $packageList.some((p) => p.is_local);
</script>

<aside id="side-menu" class="border-gray border border-b-0 border-l-0 border-t-0 p-2">
  <ul class="flex flex-col gap-1 px-1 pt-4">
    <MenuButton
      label={$t("tags.discover").toLowerCase()}
      icon="map"
      active={activeOption === SideMenuOptions.discover}
      on:click={() => goto(`/?tab=${SideMenuOptions.discover}`)}
    />
    <hr />
    <MenuButton
      label={$t("side-menu-title.all").toLowerCase()}
      icon="grid"
      active={activeOption === SideMenuOptions.all}
      on:click={() => goto(`/?tab=${SideMenuOptions.all}`)}
    />
    <hr />
    <MenuButton
      label="installed"
      icon="tea-checkmark"
      active={activeOption === SideMenuOptions.installed}
      on:click={() => goto(`/?tab=${SideMenuOptions.installed}`)}
    />
    <hr />
    <MenuButton
      label={$t("tags.installed_updates_available").toLowerCase()}
      icon="update"
      active={activeOption === SideMenuOptions.installed_updates_available}
      on:click={() => goto(`/?tab=${SideMenuOptions.installed_updates_available}`)}
    >
      {#if needsUpdateCount > 0}
        <div class="update-count-badge">{needsUpdateCount}</div>
      {/if}
    </MenuButton>
    <hr />
    <MenuButton
      label={$t("tags.new_packages").toLowerCase()}
      icon="birthday-cake"
      active={activeOption === SideMenuOptions.new_packages}
      on:click={() => goto(`/?tab=${SideMenuOptions.new_packages}`)}
    />
    <!-- <hr />
		<MenuButton
			label={$t("tags.popular").toLowerCase()}
			icon="bar-chart"
			active={activeOption === SideMenuOptions.popular}
			on:click={() => goto(`/?tab=${SideMenuOptions.popular}`)}
		/> -->
    <hr />
    <MenuButton
      label={$t("tags.recently_updated").toLowerCase()}
      icon="back-in-time"
      active={activeOption === SideMenuOptions.recently_updated}
      on:click={() => goto(`/?tab=${SideMenuOptions.recently_updated}`)}
    />
    <hr />
    <MenuButton
      label={$t("tags.made_by_tea").toLowerCase()}
      icon="tea-logo-iconasset-1"
      active={activeOption === SideMenuOptions.made_by_tea}
      on:click={() => goto(`/?tab=${SideMenuOptions.made_by_tea}`)}
    />
    {#if hasLocalPackages}
      <MenuButton
        label={$t("tags.local_packages").toLowerCase()}
        icon="pencil"
        active={activeOption === SideMenuOptions.local}
        on:click={() => goto(`/?tab=${SideMenuOptions.local}`)}
      />
    {/if}
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
