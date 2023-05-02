<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { packagesStore } from "$libs/stores";
  import { onMount } from "svelte";

  import ImgLoader from "@tea/ui/img-loader/img-loader.svelte";
  import { goto } from "$app/navigation";
  import PackageInstallButton from "$components/package-install-button/package-install-button.svelte";
  export let pkg: GUIPackage; // Fuse package search result probably not updated
  export let onClick: () => Promise<void>;
  export let onClose: () => void;

  const { packageList } = packagesStore;

  $: updatedPkg = $packageList.find((p) => p.full_name === pkg.full_name);

  onMount(() => {
    packagesStore.fetchPackageBottles(pkg.full_name);
  });

  const gotoPackagePage = () => {
    goto(`/packages/${pkg.slug}?tab=all`);
    onClose();
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<figure class="flex flex-row gap-2 border border-gray p-2">
  <ImgLoader
    on:click={() => gotoPackagePage()}
    class="pkg-image h-16 w-16 object-cover"
    src={!pkg.thumb_image_url.includes("https://tea.xyz")
      ? "/images/default-thumb.jpg"
      : pkg.thumb_image_url}
    alt={pkg.name}
  />
  <header class="flex-grow" on:click={() => gotoPackagePage()}>
    <h1>{pkg.full_name}</h1>
    <p class="text-xs line-clamp-2">{pkg.desc}</p>
  </header>
  <aside>
    <div>
      {#if updatedPkg}
        <PackageInstallButton pkg={updatedPkg} {onClick} />
      {/if}
    </div>
  </aside>
</figure>

<style>
  figure:hover {
    background-color: #252525;
  }

  aside {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 140px;
    margin-right: 22px;
  }
</style>
