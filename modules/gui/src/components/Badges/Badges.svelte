<script lang="ts">
	import '$appcss';
	import Placeholder from '$components/Placeholder/Placeholder.svelte';

	export let arg1: string;
</script>

<Placeholder label="Badges" />
<h1>{arg1 || 'test'}</h1>
