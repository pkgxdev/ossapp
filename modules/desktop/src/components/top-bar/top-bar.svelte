<script lang="ts">
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import { searchStore } from '$libs/stores';
	import SearchInput from '@tea/ui/search-input/search-input.svelte';
	import { navStore } from '$libs/stores';
	import { t } from '$libs/translations'; 

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

<header class="border-gray flex w-full border border-l-0 border-r-0 h-10" style="-webkit-app-region: drag">
	<div class="w-16 mr-2">
		<!-- just spacing for the close/expand/ buttons in title bar
			todo: handle this different when on linux probably move to right
		-->
	</div>
	{#if $prevPath || $nextPath}
		<ul class="text-gray flex h-10 gap-4 pl-2 align-middle leading-10 mr-2">
			<button on:click={navStore.back} class={$prevPath ? 'active' : ''}>&#8592</button>
			<button on:click={navStore.next} class={$nextPath ? 'active' : ''}>&#8594</button>
		</ul>
	{/if}
	<div class="p-1 flex-grow h-8">
		<SearchInput
			class="w-full border border-gray rounded-sm"
			size="small"
			placeholder={$t("store-search-placeholder")}
			{onSearch}
		/>
	</div>
	<ProfileNavButton />
</header>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	ul button {
		pointer-events: none;
	}

	ul button.active {
		color: white;
		pointer-events: all;
	}
</style>
