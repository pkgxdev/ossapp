<script lang="ts">
  import "$appcss";
  import Preloader from "../preloader/preloader.svelte";
  export let src: string;
  export let alt = "loading";
  export let style = "";

  let clazz = "";
  export { clazz as class };

  function preloadImage() {
    return new Promise(function (resolve) {
      let img = new Image();
      img.onload = resolve;
      img.src = src;
    });
  }
</script>

{#await preloadImage()}
  <Preloader />
{:then _}
  <img {style} class={clazz} {src} {alt} />
{/await}
