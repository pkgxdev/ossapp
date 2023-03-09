<!-- home / discover / welcome page -->
<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
	import Packages from '$components/packages/packages.svelte';
	import Resources from '$components/resources/resources.svelte';
</script>

<div>
	<section class="mt-8 mb-8">
		<Packages title={$t("home.discover-title")}/>
	</section>
	<section class="mt-8 mb-8">
		<Resources/>
	</section>


</div>
