<script lang="ts">
	import '$appcss';
	import { onMount } from 'svelte';
	import type { Course } from '$libs/types';

	import Gallery from '@tea/ui/Gallery/Gallery.svelte';
	import { getFeaturedCourses } from '@api';

	let courses: Course[] = [];

	onMount(async () => {
		if (!courses.length) {
			courses = await getFeaturedCourses();
		}
	});
</script>

<Gallery
	title="FEATURED COURSES"
	items={courses.map((course) => ({
		title: course.title,
		subTitle: course.sub_title,
		imageUrl: course.banner_image_url,
		link: course.link
	}))}
	linkTarget="_blank"
/>
