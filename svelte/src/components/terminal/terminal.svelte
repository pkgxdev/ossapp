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

  let terminalDiv: HTMLDivElement;
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
      fitAddon.fit();
    });

    // Detect when the containing div is resized and resize the terminal
    const resizeObserver = new ResizeObserver((entries) => {
      fitAddon.fit();
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

<!-- FIXME: find a better way to make this div resize.  Main container is height:auto so h-full doesn't work well -->
<div class="h-[80vh] w-full">
  <div class="border-gray h-full w-full rounded-[5px] border bg-[#000000] p-1">
    <div bind:this={terminalDiv} id="terminal" class="h-full w-full" />
  </div>
</div>
