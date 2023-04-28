<script lang="ts">
  import Prism from "@magidoc/plugin-svelte-prismjs";
  export let text: string;
  export let language = "shell";
</script>

<article class="py-1 text-sm font-thin">
  <Prism {language} source={text} showLineNumbers showCopyButton />
</article>
