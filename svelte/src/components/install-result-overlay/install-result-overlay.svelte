<script lang="ts">
  import type { GUIPackage } from "$libs/types";
  import confetti from "canvas-confetti";
  import { afterUpdate } from "svelte";
  import { packagesStore } from "$libs/stores";
  import Button from "$components/button/button.svelte";
  import { packageHadError, packageWasInstalled } from "$libs/packages/pkg-utils";

  let root: HTMLElement | undefined;

  export let pkg: GUIPackage;

  $: isAnimating = false;

  const colors = ["#00FFD0", "#2675F5", "#8000FF"];

  const playConfetti = async () => {
    if (isAnimating) {
      return;
    }

    if (root) {
      isAnimating = true;
      packagesStore.resetPackageDisplayState(pkg);

      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      root.appendChild(canvas);

      const myConfetti = confetti.create(canvas, { resize: true });
      await myConfetti({
        particleCount: 500,
        spread: 360,
        startVelocity: 20,
        gravity: 0.5,
        colors
      });

      root?.removeChild(canvas);
      isAnimating = false;
    }
  };

  const retry = () => {
    packagesStore.resetPackageDisplayState(pkg);
    packagesStore.installPkg(pkg, pkg.displayState?.version);
  };

  afterUpdate(() => {
    if (packageWasInstalled(pkg)) {
      playConfetti();
    }
  });
</script>

<div bind:this={root} class="z-60 pointer-events-none absolute left-0 top-0 h-full w-full">
  {#if packageHadError(pkg)}
    <div
      class="pointer-events-auto flex h-full w-full flex-col items-center justify-center bg-black/90"
    >
      <div><i class="icon-exlamation-outline text-3xl text-[#FF4100]" /></div>
      <div class="font-mona mb-2">Install Failed</div>
      <div class="mb-2 w-1/2">
        <Button type="plain" color="blue" class="p-2 text-xs" onClick={retry}>RETRY</Button>
      </div>
      <button class="text-gray text-xs" on:click={() => packagesStore.resetPackageDisplayState(pkg)}
        >cancel</button
      >
    </div>
  {/if}
</div>
