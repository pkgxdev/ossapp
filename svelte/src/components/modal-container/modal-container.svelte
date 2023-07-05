<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let backgroundOpacity: 50 | 70 | 90 = 70;

  const onClose = () => {
    dispatch("close");
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="fixed bottom-0 left-0 right-0 top-0 bg-black opacity-{backgroundOpacity}"
  on:click={onClose}
/>
<article class="fixed bottom-0 top-0 flex items-center justify-center">
  <slot />
</article>

<style>
  div {
    z-index: 100;
  }
  article {
    z-index: 110;
    width: 400px;
    left: calc(50% - 200px);
  }
</style>
