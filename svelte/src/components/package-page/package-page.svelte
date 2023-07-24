<script lang="ts">
  import Markdown from "$components/markdown/markdown.svelte";
  import PackageBanner from "$components/package-banner/package-banner.svelte";
  import PackageMetas from "$components/package-metas/package-metas.svelte";
  import useDefaultBrowser from "$libs/utils/use-default-browser";
  import type { GUIPackage } from "$libs/types";

  export let pkg: GUIPackage;

  $: readme = pkg?.readme || ({ data: "", type: "md" } as { data: string; type: "md" | "rst" });
</script>

<div class="flex w-3/4 flex-col justify-stretch pr-4">
  <PackageBanner on:openterminal {pkg} />
  <hr class="border-top border-gray" />
  <Markdown source={readme} hook={useDefaultBrowser} />
</div>
<div class="w-1/4">
  {#if pkg}
    <PackageMetas {pkg} />
  {/if}
</div>
