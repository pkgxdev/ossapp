<script lang="ts">
  import { loadPkgImage } from "./image-loader";

  let clazz = "";
  export { clazz as class };

  export let layout: "bottom" | "right" | "left" | "none" = "bottom";

  // pass properties instead of the whole package object to avoid unnecessary re-rendering
  export let project: string;
  export let url: string | undefined;
  export let cachedImageUrl: string | undefined;
  export let hasImage: boolean;

  $: promise = loadPkgImage(project, hasImage, url, cachedImageUrl);
</script>

<section class="overflow-hidden bg-black {clazz} {layout}">
  {#await promise}
    <img src="/images/home-btn/State=Active.svg" class="logo animate-pulse grayscale {layout}" alt="ossapp"/>
  {:then loadedImg}
    <div class="transition-all duration-500 {layout}" style="background-image: url({loadedImg})">
      <!-- dup image: save processing power instead of computing the blur across all the HTML layers -->
      {#if layout !== "none"}
        <aside class="blur-sm {layout} transition-all duration-500">
          <figure class={layout} style="background-image: url({loadedImg})" />
        </aside>
      {/if}
    </div>
  {/await}
</section>

<style>
  section {
    width: 100%;
    height: 100%;
  }

  .logo {
    position: absolute;
    width: 30px;
    margin-left: -15px;
  }
  .logo.none {
    left: 50%;
    top: 50%;
  }
  .logo.bottom {
    left: 50%;
    top: 30%;
  }
  .logo.right {
    left: 22%;
    top: 50%;
    margin-top: -15px;
  }
  .logo.left {
    left: 70%;
    top: 50%;
    margin-top: -15px;
  }

  div {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    background-size: cover;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  div.left {
    background-position: 200px 50%;
  }
  div.right {
    background-repeat: repeat;
    background-position: -250px 50%;
  }
  div.bottom {
    background-repeat: repeat;
    background-position: 50% -70px;
  }
  aside {
    position: absolute;
    bottom: 0px;
    width: 100%;
    overflow: hidden;
  }
  aside.bottom {
    left: 0px;
    height: 50%;
  }

  aside.left {
    left: 0px;
    height: 100%;
    width: 60%;
  }

  aside.right {
    height: 100%;
    right: 0px;
    width: 60%;
  }

  figure {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 338px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  figure.left {
    background-repeat: repeat;
    background-position: 200px 50%;
  }

  figure.right {
    background-repeat: repeat;
    background-position: -250px 50%;
  }
  figure.bottom {
    background-repeat: repeat;
    background-position: 50% -70px;
  }

  aside.bottom figure {
    left: 0px;
  }

  aside.right figure {
    height: 100%;
    /* the overlay is 60% of the image, so we need to oversize the background image back to 100% */
    width: 166.6666666%;
    right: 0px;
  }

  aside.left figure {
    height: 100%;
    /* the overlay is 60% of the image, so we need to oversize the background image back to 100% */
    width: 166.66666666%;
    left: 0px;
  }
</style>
