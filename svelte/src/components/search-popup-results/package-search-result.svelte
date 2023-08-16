<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import { packagesStore } from "$libs/stores";

  import ImgLoader from "$components/img-loader/img-loader.svelte";
  import { goto } from "$app/navigation";
  import PackageInstallButton from "$components/package-install-button/package-install-button.svelte";
  export let pkg: GUIPackage; // Fuse package search result probably not updated
  export let onClick: () => Promise<void>;
  export let onClose: () => void;

  const { packageList } = packagesStore;

  $: updatedPkg = $packageList.find((p) => p.full_name === pkg.full_name);

  const gotoPackagePage = () => {
    goto(`/packages/${pkg.slug}?tab=all`);
    onClose();
  };

  console.log(pkg);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<figure class="border-gray flex flex-row gap-2 border p-2">
  <ImgLoader
    on:click={() => gotoPackagePage()}
    class="pkg-image h-16 w-16 object-cover"
    src={pkg.image_128_url || "/images/default-thumb.jpg"}
    alt={pkg.name}
  />
  <header data-testid="card-result-{pkg.slug}" class="flex-grow" on:click={() => gotoPackagePage()}>
    <h1>{pkg.name}</h1>
    <p class="line-clamp-2 text-xs">{pkg.short_description}</p>
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

  header {
    cursor: pointer;
  }
</style>
