<script lang="ts">
  import type { Tab } from "$libs/types";
  import { afterUpdate } from "svelte";

  let clazz = "";

  export { clazz as class };

  import Button from "../button/button.svelte";

  export let tabs: Tab[] = [];
  export let defaultTab: string;

  let active: string;

  let dirty = false;

  afterUpdate(() => {
    if (tabs.length && !active) {
      if (!defaultTab) {
        active = tabs[0].label;
      } else if (!dirty) {
        active = defaultTab;
      }
    }
  });
</script>

<section class="relative h-auto {clazz}">
  <menu class="flex gap-1">
    {#each tabs as tab}
      <div class="border-gray text-white" class:border-b={tab.label === active}>
        <Button
          onClick={() => {
            dirty = true;
            active = tab.label;
          }}
        >
          <span class:text-white={tab.label === active}>{tab.label}</span>
        </Button>
      </div>
    {/each}
  </menu>

  {#each tabs as tab}
    {#if tab.label === active}
      <svelte:component this={tab.component} {...tab.props} />
    {/if}
  {/each}
</section>
