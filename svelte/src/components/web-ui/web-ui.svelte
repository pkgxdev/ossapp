<script lang="ts">
  import type { TeaSubprocess } from "$libs/stores/ptys";
  export let pty: TeaSubprocess | undefined;
</script>

{#if pty && pty.guiURL}
  <!-- FIXME: find a better way to make this div resize.  Main container is height:auto so h-full doesn't work well -->
  <div class="h-[80vh] w-full">
    <div class="border-gray mb-4 h-full w-full rounded-[5px] border p-1">
      <iframe id="terminal" title="{pty.project} web UI" src={pty.guiURL} class="h-full w-full" />
    </div>
  </div>
{/if}
