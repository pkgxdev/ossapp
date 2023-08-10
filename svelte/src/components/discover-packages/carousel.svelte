<script lang="ts">
  import "@splidejs/svelte-splide/css";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { PackageStates, type GUIPackage } from "$libs/types";
  import Package from "$components/packages/package.svelte";

  export let pkgs: GUIPackage[] = [];
</script>

<Splide
  options={{
    type: "slide",
    drag: "free",
    perPage: 3,
    perMove: 1,
    snap: true,
    rewind: true,
    pagination: false, // This just hides the pagination dots
    wheel: true,
    // Tweak these until it feels "right"
    waitForTransition: true,
    wheelSleep: 600,
    //flickPower: 300,
    //wheelMinThreshold: 2,
  }}
>
  {#each pkgs as pkg, index}
    <SplideSlide>
      <div class="card z-1 p-1" class:animate-pulse={pkg.state === PackageStates.INSTALLING}>
        <Package {pkg} layout="bottom" />
      </div>
    </SplideSlide>
  {/each}
</Splide>
