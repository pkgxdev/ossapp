<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import FeaturedCourses from '$components/FeaturedCourses/FeaturedCourses.svelte';
	import EssentialWorkshops from '$components/EssentialWorkshops/EssentialWorkshops.svelte';
</script>

<div>
	<PageHeader>Documentation</PageHeader>

	<section>
		<FeaturedCourses />
	</section>

	<section class="mt-8">
		<EssentialWorkshops />
	</section>
</div>
