<script lang="ts">
	import '$appcss';
	import { open } from '@tauri-apps/api/shell';
	const openGithub = () => {
		open('https://github.com/teaxyz');
	};
</script>

<div class="card social-box" style="width: 100%; float:right;">
	<header class="border-gray text-primary border-b pt-7 pb-7 pl-5">PRE-FLIGHT</header>
	<div class="listbox-item border-gray border-b p-6">
		<a href="/cli">
			<p>Install Tea</p>
		</a>
	</div>
	<div class="listbox-item border-gray border-b p-6">
		<div>
			<p>Authenticate</p>
		</div>
	</div>
	<div class="listbox-item p-6">
		<button on:click={openGithub}>Give tea a star</button>
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
