<script lang="ts">
	import type { Package } from '@tea/ui/types';
	export let pkg: Package;
</script>

<section class="h-64 w-full">
	<h1>{pkg.full_name}</h1>
</section>
