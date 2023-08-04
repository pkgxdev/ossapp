<script lang="ts">
  import { defaultImgUrl } from "$libs/types";
  import { loadPkgImage } from "./image-loader";

  export let clazz = "";
  export { clazz as class };

  // pass properties instead of the whole package object to avoid unnecessary re-rendering
  export let project: string;
  export let url: string | undefined;
  export let cachedImageUrl: string | undefined;
  export let hasImage: boolean;

  $: promise = loadPkgImage(project, hasImage, url, cachedImageUrl);
</script>

{#await promise}
  <img class={clazz} alt={project} src={defaultImgUrl} />
{:then loadedImg}
  <img class={clazz} alt={project} src={loadedImg} />
{/await}
