<script>
	import '../app.scss';
	import SideBar from '$lib/SideBar.svelte';
</script>

<SideBar />

<div class="main">
	<slot />
</div>
