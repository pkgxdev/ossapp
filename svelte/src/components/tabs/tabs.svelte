<script lang="ts">
  import type { Tab, TabId } from "$libs/types";
  import { tabStore } from "$libs/stores";
  import Button from "../button/button.svelte";

  const { activeTab, setActiveTab } = tabStore;

  let clazz = "";
  export { clazz as class };
  export let tabs: Tab[] = [];

  const getActiveTabId = (tabId: TabId, tabs: Tab[]) => {
    if (
      !tabId ||
      !tabs
        .filter((t) => !t.hidden)
        .map((t) => t.id)
        .includes(tabId)
    ) {
      // If the tabId is not provided, invalid or the tab is hidden, use the first tab
      return tabs[0]?.id;
    }
    return tabId;
  };

  $: activeTabId = getActiveTabId($activeTab, tabs);
</script>

<section class="relative h-auto {clazz}">
  <menu class="flex gap-1">
    {#each tabs as tab}
      <div
        class="border-gray text-white"
        class:border-b={tab.id === activeTabId}
        class:hidden={!!tab.hidden}
      >
        <Button onClick={() => setActiveTab(tab.id)}>
          <span class:text-white={tab.id === activeTabId}>{tab.label}</span>
        </Button>
      </div>
    {/each}
  </menu>

  {#each tabs as tab}
    <div class:hidden={tab.id !== activeTabId}>
      <svelte:component this={tab.component} {...tab.props} />
    </div>
  {/each}
</section>
