<script lang="ts">
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import { searchStore } from '$libs/stores';
	import SearchInput from '@tea/ui/search-input/search-input.svelte';
	import { navStore } from '$libs/stores';
	import { t } from '$libs/translations';
	import * as pub from '$env/static/public';

	import ProfileNavButton from './profile-nav-button.svelte';

	let { nextPath, prevPath } = navStore;

	const onSearch = (term: string) => {
		searchStore.search(term);
	};

	let currentPath: string;
	beforeUpdate(async () => {
		currentPath = $page.url.pathname;
	});
</script>

<header class="border-gray flex items-center w-full border border-l-0 border-r-0 h-12" style="-webkit-app-region: drag">
	<div class="w-16 mr-2">
		<!-- just spacing for the traffice-lights buttons in title bar
			todo: handle this different when on linux probably move to right
		-->
	</div>
	{#if $prevPath || $nextPath}
		<ul class="text-gray flex h-10 gap-4 pl-2 align-middle leading-10 mr-2">
			<button on:click={navStore.back} class={$prevPath ? 'active' : ''}>&#8592</button>
			<button on:click={navStore.next} class={$nextPath ? 'active' : ''}>&#8594</button>
		</ul>
	{/if}
	<div class="px-2 flex-grow">
		<SearchInput
			class="w-full border border-gray rounded-sm h-9"
			size="small"
			placeholder={`${$t("store-search-placeholder")} rm this v${pub.PUBLIC_VERSION}`}
			{onSearch}
		/>
	</div>
	<ProfileNavButton />
</header>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	header {
		background: rgba(26,26,26,0.9);
		backdrop-filter: blur(2px);
	}

	ul button {
		pointer-events: none;
	}

	ul button.active {
		color: white;
		pointer-events: all;
	}
</style>
