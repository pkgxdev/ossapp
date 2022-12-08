<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import FeaturedCourses from '$components/FeaturedCourses/FeaturedCourses.svelte';
	import EssentialWorkshops from '$components/EssentialWorkshops/EssentialWorkshops.svelte';
	import PostThumbs from '$components/PostThumbs/PostThumbs.svelte';
	import { backLink } from '$libs/stores';
	backLink.set('/');
</script>

<div>
	<PageHeader>Documentation</PageHeader>

	<section>
		<FeaturedCourses />
	</section>

	<section class="mt-8">
		<EssentialWorkshops />
	</section>

	<section class="mt-8">
		<PostThumbs
			type="course"
			title="ESSENTIAL WORKSHOPS"
			readMoreCta="View all >"
			readMoreLink="/"
		/>
	</section>
</div>
