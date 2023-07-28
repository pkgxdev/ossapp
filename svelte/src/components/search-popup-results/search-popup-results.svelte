<script lang="ts">
  import { packagesStore, searchStore } from "$libs/stores";
  import SearchInput from "$components/search-input/search-input.svelte";
  import { t } from "$libs/translations";
  import { PackageStates, type GUIPackage } from "$libs/types";
  import PackageResult from "./package-search-result.svelte";

  import NoSearchResults from "./no-search-results.svelte";
  import Spinner from "$components/spinner/spinner.svelte";

  const { searching } = searchStore;
  let packages: GUIPackage[] = [];
  let term: string;

  let loading = false;
  const onClose = () => {
    term = "";
    searching.set(false);
  };
</script>

{#if $searching === true}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id="bg-close" class="z-40" on:click={onClose} />
  <section class="z-50" data-testid="search-popup">
    <header class="border-gray flex border border-x-0 border-t-0 bg-black">
      <div class="relative w-full">
        <SearchInput
          data-testid="search-input-popup"
          class="h-9  w-full rounded-sm"
          size="small"
          autofocus={true}
          placeholder={$t("store-search-placeholder")}
          onSearch={async (search) => {
            try {
              loading = true;
              term = search;
              packages = await packagesStore.search(search);
            } finally {
              loading = false;
            }
          }}
        />
        <div class="absolute right-4 top-1 flex items-center gap-1 pt-[1px] opacity-50">
          <span class="mr-1 text-xs">clear</span>
          <kbd class=" bg-gray flex items-center rounded-sm px-2 pt-[1px] text-white">
            <!-- using apple system ui font as our default renders the symbols wonky -->
            <span class="" style="font-family: system-ui, -apple-system, sans-serif">⌘⇧⌫</span>
          </kbd>
        </div>
      </div>
      <button class="mr-2" on:click={onClose}>&#x2715</button>
    </header>
    {#if term}
      <div class="z-20 w-full bg-black">
        {#if packages.length > 0}
          <header class="text-gray p-4 text-lg">
            packages ({packages.length})
          </header>
          <ul class="flex flex-col gap-2 p-2">
            {#each packages as pkg}
              <div class={pkg.state === PackageStates.INSTALLING ? "animate-pulse" : ""}>
                <PackageResult
                  {pkg}
                  {onClose}
                  onClick={async () => {
                    if (
                      [
                        PackageStates.INSTALLED,
                        PackageStates.INSTALLING,
                        PackageStates.UPDATING
                      ].includes(pkg.state)
                    ) {
                      return;
                    }
                    packagesStore.installPkg(pkg);
                  }}
                />
              </div>
            {/each}
          </ul>
        {:else if loading}
          <div class="flex h-full w-full items-center justify-center" data-testid="is-searching">
            <Spinner />
          </div>
        {:else}
          <NoSearchResults />
        {/if}
      </div>
    {:else}
      <div class="flex h-full w-full flex-col justify-center bg-black">
        <p class="text-gray text-center">start typing to search</p>
      </div>
    {/if}
  </section>
{/if}

<style>
  #bg-close {
    position: fixed;
    width: calc(100vw - 2px);
    height: calc(100vh - 2px);
    top: 1px;
    left: 1px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
  }
  section {
    position: fixed;
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
    background: rgba(0, 0, 0, 0.7);
    transition: opacity 0.3s ease-in-out;
    opacity: 1;
    overflow: hidden;
    height: auto;
    border: gray 1px solid;
    border-radius: 12px;
  }

  section > div {
    position: relative;
    margin-top: 2px;
    height: calc(100% - 40px);
    width: 100%;
    transition: height 0.6s ease-in-out;
    overflow-y: scroll;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #272626;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #949494;
    border-radius: 4px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: white;
  }
</style>
