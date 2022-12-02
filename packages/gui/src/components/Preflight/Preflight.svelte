<script lang="ts">
	import '$appcss';
	import Placeholder from '$components/Placeholder/Placeholder.svelte';
</script>

<div class="card social-box" style="width: 100%; float:right;">
	<header class="text-primary border-b border-gray p-5">PRE-FLIGHT</header>
	<div class="listbox-item border-b border-gray p-5">
		<p>Install Tea</p>
	</div>
	<div class="listbox-item border-b border-gray p-5">
		<p>Authenticate</p>
	</div>
	<div class="listbox-item p-5">
		<p>Give tea a star</p>
	</div>
</div>

<style>

.card{
	border: 2px solid #949494;
	background-color: #1a1a1a;
}

.listbox-item{
	height: 75px;
}

</style>
