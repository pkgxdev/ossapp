<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const onChange = () => {
    dispatch("change", { checked });
  };

  // icons are configured from fontastic using's tsmiths account
  // options are at svelte/src/icons/icons.css
  export let rightIcon = "";
  export let leftIcon = "";

  export let checked = false;
</script>

<label class="relative inline-flex cursor-pointer items-center">
  <input type="checkbox" value="" class="peer sr-only" bind:checked on:change={onChange} />
  <div
    class="bg-gray after:border-gray peer-checked:after:border-secondary after:bg-gray peer-checked:after:bg-secondary peer h-6 w-11 rounded-sm bg-opacity-20 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-sm after:border after:border-gray-300 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
  />
  {#if leftIcon}
    <div
      class="bg-gray peer-checked:text-gray absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-sm bg-opacity-20 text-black dark:bg-gray-700"
    >
      <i class="icon-{leftIcon} mt-[2px] text-[10px]" />
    </div>
  {/if}

  {#if rightIcon}
    <div
      class="bg-gray dark:bg-gray-700text-gray absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-sm bg-opacity-20 peer-checked:text-white"
    >
      <i class="icon-{rightIcon} mt-[2px] text-[10px]" />
    </div>
  {/if}
</label>
