<script lang="ts">
	import '$appcss';
	import { onDestroy } from 'svelte';
	import { watchResize } from 'svelte-watch-resize';
	import type { Package } from '@tea/ui/types';
	import FeaturedPackage from './FeaturedPackage.svelte';

	let featuredPackages: Package[] = [
		{
			slug: 'mesonbuild_com',
			homepage: 'https://mesonbuild.com',
			name: 'mesonbuild.com',
			version: '0.63.3',
			last_modified: '2022-10-06T15:45:08.000Z',
			full_name: 'mesonbuild.com',
			dl_count: 270745,
			thumb_image_name: 'mesonbuild_com_option 1.jpg ',
			maintainer: '',
			desc: 'Fast and user friendly build system',
			thumb_image_url: 'https://tea.xyz/Images/packages/mesonbuild_com.jpg',
			installs: 0
		},
		{
			slug: 'pixman_org',
			homepage: 'http://www.pixman.org/',
			maintainer: 'freedesktop',
			name: 'pixman.org',
			version: '0.40.0',
			last_modified: '2022-09-26T19:37:47.000Z',
			full_name: 'pixman.org',
			dl_count: 0,
			thumb_image_name: 'pixman_org_option 1.jpg ',
			desc: 'Pixman is a library that provides low-level pixel manipulation features such as image compositing and trapezoid rasterization.',
			thumb_image_url: 'https://tea.xyz/Images/packages/pixman_org.jpg',
			installs: 0
		},
		{
			slug: 'freedesktop_org_pkg_config',
			homepage: 'https://freedesktop.org',
			maintainer: 'freedesktop.org',
			name: 'pkg-config',
			version: '0.29.2',
			last_modified: '2022-10-20T01:32:15.000Z',
			full_name: 'freedesktop.org/pkg-config',
			dl_count: 2661501,
			thumb_image_name: 'freedecktop_org_pkg_config option 1.jpg ',
			desc: 'Manage compile and link flags for libraries',
			thumb_image_url: 'https://tea.xyz/Images/packages/freedesktop_org_pkg_config.jpg',
			installs: 0
		}
	];

	let pkgFocus = 0;
	let width = 0;
	let styleFeaturedPackages: string;

	function getFeaturedStyle() {
		const position = pkgFocus * width;
		return `
			width: ${featuredPackages.length * width}px;
			left: -${position}px;
			transition: left 0.6s ease-in;
		`;
	}

	function handleContainerResize(node: HTMLElement) {
		width = node.clientWidth;
		styleFeaturedPackages = getFeaturedStyle();
	}

	const loop = setInterval(() => {
		pkgFocus++;
		if (pkgFocus === featuredPackages.length) {
			pkgFocus = 0;
		}
		styleFeaturedPackages = getFeaturedStyle();
	}, 3000);

	onDestroy(() => clearInterval(loop));
</script>

<section class="bg-black w-full h-96" use:watchResize={handleContainerResize}>
	<!-- <Placeholder label="FeaturedPackages" /> -->
	<header class="bg-accent h-12 flex justify-between px-2 items-center">
		<p>FEATURED PACKAGES</p>
		<ul class="flex gap-2">
			{#each featuredPackages as pkg, i}
				<li
					class={`border-white border-2 w-4 h-4 rounded-lg bg-purple transition-colors ${
						i === pkgFocus ? 'bg-purple-900' : ''
					}`}
				/>
			{/each}
		</ul>
	</header>
	<figure class="overflow-hidden absolute bottom-0 top-12 left-0 right-0">
		<section class="flex absolute top-0 h-full" style={styleFeaturedPackages}>
			{#each featuredPackages as pkg}
				<div class="h-full" style={`width:${width}px`}>
					<a href={`/packages/${pkg.slug}`}>
						<FeaturedPackage {pkg} />
					</a>
				</div>
			{/each}
		</section>
	</figure>
</section>
