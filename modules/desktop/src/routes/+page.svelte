<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations';
	import { navStore } from '$libs/stores';
	import Packages from '$components/packages/packages.svelte';


	const { sideNavOpen } = navStore;
</script>

<div id="package-container">
	<Packages/>
</div>
<aside class="border border-gray">
	test
</aside>
<header class={`transition-all px-2 flex items-center align-middle ${$sideNavOpen ? "min": ""}`}>
	<h1 class="text-primary mt-4 text-2xl font-bold">{$t("home.all-packages")}</h1>
</header>

<style>
	#package-container {
		padding-top: 36px;
		width: calc(100% - 180px);
		margin-left: 180px;
	}

	aside {
		position: fixed;
		top: 100px;
		left: 10px;
		height: calc(100% - 110px);
		width: 170px;
	}
	header {
		position: fixed;
		top: 40px;
		left: 0px;
		height: 50px;
		width: 100%;
		background-image: linear-gradient(black, rgba(0,0,0,0.6), rgba(0,0,0,0));
  	/* background: linear-gradient(rgba(255,0,0,0), rgba(0,0,0,0)); */
	}

	header.min {
		width: 75%;
	}

</style>
