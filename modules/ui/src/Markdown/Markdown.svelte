<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Link from './Link.svelte';

	import './styles.css';

	// TODO: rm sample
	// import { md } from './sample';

	export let source: string;

	const renderers = {
		link: Link
	};
</script>

<section class="markdown-body p-4">
	<SvelteMarkdown {source} {renderers} />
</section>
