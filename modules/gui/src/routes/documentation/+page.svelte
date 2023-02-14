<script>
	import '$appcss';
	import PageHeader from '$components/page-header/page-header.svelte';
	import FeaturedCourses from '$components/featured-courses/featured-courses.svelte';
	import EssentialWorkshops from '$components/essential-workshops/essential-workshops.svelte';
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
