<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import Link from "./link.svelte";
  import rst2html from "./rst2html";
  import "./styles.css";
  import { onMount } from "svelte";
  import { tokenizeMarkdown } from "./md";
  import Preloader from "$components/preloader/preloader.svelte";
  import { shellOpenExternal } from "@native";

  export let source: { data: string; type: "md" | "rst" | "html" };
  let markDownRoot: HTMLElement;

  export let hook = (node: HTMLElement): { destroy: () => void } => {
    return {
      destroy() {
        console.log("destroy");
      }
    };
  };

  const renderers = {
    link: Link
  };

  $: html = source.type === "rst" ? rst2html(source.data) : source.data;

  // TODO: support gitlab too
  const changeSrcIfNeeded = (element: HTMLElement | Element) => {
    const src = element.getAttribute("src");
    const isRelativePath = src?.match(/^[^\/]+\/[^\/].*$|^\/[^\/].*$/i);
    if (isRelativePath) {
      const url = new URL(src!, "https://github.com");
      element.setAttribute("src", url.toString());
    }
  };

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
        changeSrcIfNeeded(element);
      });
    }

    if (source.type === "html" && html) {
      // TODO: fix this hack, seems to be redundant from the hooks above
      document.querySelectorAll(".html-content a").forEach((element: Element) => {
        const href = element.getAttribute("href");
        if (!href?.startsWith("#") && href) {
          element.addEventListener("click", (e) => {
            e.preventDefault();
            shellOpenExternal(href!);
          });
        }
      });

      document.querySelectorAll(".html-content img").forEach((element: Element) => {
        changeSrcIfNeeded(element);
      });
    }
  });
</script>

<section use:hook class="markdown-body flex w-full justify-stretch py-4">
  {#if source.type === "md" && source.data}
    <div class="w-full" bind:this={markDownRoot}>
      <SvelteMarkdown source={tokenizeMarkdown(source.data)} {renderers} />
    </div>
  {:else if ["html", "rst"].includes(source.type) && html}
    <div class="html-content w-full">
      {@html html}
    </div>
  {:else}
    <Preloader />
  {/if}
</section>
