<script lang="ts">
	import { snippets } from './sample';
	import PackageSnippet from './PackageSnippet.svelte';
</script>

<ul class="bg-black">
	{#each snippets as snippet}
		<li class="border border-gray p-4">
			<PackageSnippet {snippet} />
		</li>
	{/each}
</ul>
<section />
