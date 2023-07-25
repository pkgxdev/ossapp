<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { FitAddon } from "xterm-addon-fit";
  import { ptys } from "$libs/stores";
  import { Terminal } from "xterm";
  import "xterm/css/xterm.css";
  import "$appcss";
  import { sendStdInToPty } from "$libs/native-electron";
  import type { TeaSubprocess } from "$libs/stores/ptys";

  import log from "$libs/logger";

  export let project: string;
  const fitAddon = new FitAddon();

  let terminal: Terminal;

  let pid = 0;
  let index = 0;

  let terminalDiv: HTMLDivElement;
  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    terminal = new Terminal();
    terminal.loadAddon(fitAddon);
    terminal.open(document.getElementById("terminal")!);
    fitAddon.fit();

    terminal.onData((data: string) => {
      sendStdInToPty({ project, data, rows: terminal.rows, cols: terminal.cols });
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
      fitAddon.fit();
    });

    // Detect when the containing div is resized and resize the terminal
    const resizeObserver = new ResizeObserver((entries) => {
      fitAddon.fit();
      sendStdInToPty({ project, data: "", rows: terminal.rows, cols: terminal.cols });
    });
    resizeObserver.observe(terminalDiv);

    // Detect when the terminal div becomes visible on the screen and resize the terminal
    var visibilityObserver = new IntersectionObserver((entries, observer) => {
      // resize the terminal, but only after a delay allowing it to fully render or else the fitAddon will get the wrong size
      setTimeout(() => {
        fitAddon.fit();
      }, 10);
    });
    visibilityObserver.observe(terminalDiv);

    return () => {
      resizeObserver.unobserve(terminalDiv);
      visibilityObserver.unobserve(terminalDiv);
    };
  });

  onDestroy(() => {
    unsubscribe?.();
    terminal.dispose();
    index = 0;
  });
</script>

<div class="relative block h-full w-full bg-[#000000] pl-4">
  <div bind:this={terminalDiv} id="terminal" class="relative block h-full w-full" />
</div>
