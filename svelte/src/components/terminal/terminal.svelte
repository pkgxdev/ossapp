<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { FitAddon } from "xterm-addon-fit";
  import { ptys } from "$libs/stores";
  import { Terminal } from "xterm";
  import "xterm/css/xterm.css";
  import "$appcss";
  import { sendStdInToPty } from "$libs/native-electron";
  import type { TeaSubprocess } from "$libs/stores/ptys";

  export let project: string;

  let terminal: Terminal;

  let pid = 0;
  let index = 0;

  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    terminal = new Terminal();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(document.getElementById("terminal")!);
    fitAddon.fit();

    terminal.onKey((e) => {
      sendStdInToPty({ project, data: e.key });
    });

    unsubscribe = ptys.subscribeToSubprocess(project, (ptyouts: TeaSubprocess) => {
      if (pid != ptyouts.pid) {
        terminal.reset();
        pid = ptyouts.pid;
        index = 0;
      }

      for (; index < ptyouts.output?.length; index++) {
        terminal.write(ptyouts.output[index]);
      }
    });
  });

  onDestroy(() => {
    unsubscribe?.();
    terminal.dispose();
    index = 0;
  });
</script>

<div id="terminal" style="height: 80vh" />

<!-- FIXME fix the above styling thank you -->
