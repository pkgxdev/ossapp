<script lang="ts">
  import type { TeaSubprocess } from "$libs/stores/ptys";
  export let pty: TeaSubprocess | undefined;
</script>

{#if pty && pty.guiURL}
  <div class="h-full w-full">
    <iframe
      id="webui"
      title="{pty.project} web UI"
      src={pty.guiURL}
      class="h-full w-full bg-white"
    />
  </div>
{/if}
