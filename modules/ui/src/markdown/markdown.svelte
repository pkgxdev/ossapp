<script lang="ts">
	import SvelteMarkdown from "svelte-markdown";
	import Link from "./link.svelte";
	import rst2html from "./rst2html";

	import "./styles.css";

	export let source: { data: string; type: "md" | "rst" };

	const renderers = {
		link: Link
	};

	$: html = source.type === "rst" ? rst2html(source.data) : "";
</script>

<section class="markdown-body py-4">
	{#if source.type === "md"}
		<SvelteMarkdown source={source.data} {renderers} />
	{:else if source.type === "rst"}
		{@html html}
	{/if}
</section>
