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
    });

    const resizeObserver = new ResizeObserver((entries) => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalDiv);

    return () => resizeObserver.unobserve(terminalDiv);
  });

  onDestroy(() => {
    unsubscribe?.();
    terminal.dispose();
    index = 0;
  });
</script>

<!-- This div has a very specific size of 571 pixels, the terminal component has breakpoints for showing a line 
    and the spacing can get weird so this is as close to the breakpoint as possible with no left over space 
    if some future traveler wants a different size, make sure to take these breakpoints into account -->
<div class="border-gray mt-4 h-[571px] rounded-[5px] border p-1">
  <div bind:this={terminalDiv} id="terminal" class="h-full w-full" />
</div>
