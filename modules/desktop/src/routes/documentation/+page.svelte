<script>
	import '$appcss';
	import { t } from '$libs/translations'; 
	import PageHeader from '$components/page-header/page-header.svelte';
	import FeaturedCourses from '$components/featured-courses/featured-courses.svelte';
	import EssentialWorkshops from '$components/essential-workshops/essential-workshops.svelte';
</script>

<div>
	<PageHeader>{$t('documentation.title').toUpperCase()}</PageHeader>

	<section>
		<FeaturedCourses />
	</section>

	<section class="mt-8">
		<EssentialWorkshops
			title={$t('documentation.workshops').toUpperCase()}
			ctaLabel={$t("view-all")}
		/>
	</section>
</div>
