<script lang="ts">
  import { showBrowswerView } from "$libs/native-electron";
  import type { TeaSubprocess } from "$libs/stores/ptys";
  import { onMount } from "svelte";

  export let pty: TeaSubprocess | undefined;

  let containerDiv: HTMLDivElement;

  let webview: any

  $:{
    if (pty?.guiURL && containerDiv) {
      const rect = containerDiv.getBoundingClientRect();
      console.log("*********** RECT IS", rect);

      if (!webview) {
        showBrowswerView(pty.guiURL, rect.x, rect.y);
        webview = true;
      }
    }
  };
</script>

{#if pty && pty.guiURL}
  <div bind:this={containerDiv} class="border-gray mt-4 rounded-[5px] border p-1 w-[600px] h-[800px]">
    <!-- <iframe
      id="terminal"
      title="{pty.project} web UI"
      src={pty.guiURL}
      style="height: 100vh; width: 100%"
    /> -->
  </div>
{/if}

<!--
  ^^I cannot tell you why this styling is even needed
  FIXME: you fix this thanks
-->
