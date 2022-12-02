<script lang="ts">
	import '$appcss';
	import Placeholder from '$components/Placeholder/Placeholder.svelte';
</script>

<div class="card social-box" style="width: 100%; float:right;">
	<header class="text-primary border-b border-gray pt-7 pb-7 pl-5">PRE-FLIGHT</header>
	<div class="listbox-item border-b border-gray p-6">
		<p>Install Tea</p>
	</div>
	<div class="listbox-item border-b border-gray p-6">
		<div>
			<p>Authenticate</p>
		</div>
	</div>
	<div class="listbox-item p-6">
		<p>Give tea a star</p>
	</div>
</div>

<style>
	.card {
		border: 2px solid #949494;
		background-color: #1a1a1a;
	}

	.listbox-item {
		height: 75px;
	}
</style>
