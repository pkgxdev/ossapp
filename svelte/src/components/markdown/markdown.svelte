<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import Link from "./link.svelte";
  import rst2html from "./rst2html";
  import "./styles.css";
  import { onMount } from "svelte";
  import { tokenizeMarkdown } from "./md";
  import Preloader from "$components/preloader/preloader.svelte";

  export let source: { data: string; type: "md" | "rst" };

  let markDownRoot: HTMLElement;

  export let hook = (node: HTMLElement): { destroy: () => void } => {
    console.log("hook", node);
    return {
      destroy() {
        console.log("destroy");
      }
    };
  };

  const renderers = {
    link: Link
  };

  $: html = source.type === "rst" ? rst2html(source.data) : "";

  onMount(() => {
    // Need to override the height/width STYLE with the old-school height/width ATTRIBUTE to make it work with the markdown
    if (markDownRoot) {
      const images = markDownRoot.querySelectorAll("img");
      images.forEach((element: HTMLImageElement) => {
        const height = element.getAttribute("height");
        if (height) {
          element.style.height = height;
        }

        const width = element.getAttribute("width");
        if (width) {
          element.style.width = width;
        }
      });
    }
  });
</script>

<section use:hook class="markdown-body flex w-full justify-stretch py-4">
  {#if source.type === "md" && source.data}
    <div bind:this={markDownRoot}>
      <SvelteMarkdown source={tokenizeMarkdown(source.data)} {renderers} />
    </div>
  {:else if source.type === "rst" && html}
    {@html html}
  {:else}
    <Preloader />
  {/if}
</section>
