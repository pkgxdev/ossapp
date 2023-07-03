<script lang="ts">
  import type { TeaSubprocess } from "$libs/stores/ptys";
  export let pty: TeaSubprocess | undefined;
</script>

{#if pty && pty.guiURL}
  <iframe
    id="terminal"
    title="{pty.project} web UI"
    src={pty.guiURL}
    style="height: 100vh; width: 100%"
  />
{/if}

<!--
  ^^I cannot tell you why this styling is even needed
  FIXME: you fix this thanks
-->
