<script lang="ts">
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import { searchStore } from '$libs/stores';
	import SearchInput from '@tea/ui/SearchInput/SearchInput.svelte';
	import { navStore } from '$libs/stores';

	import ProfileNavButton from './ProfileNavButton.svelte';

	let { nextPath, prevPath } = navStore;

	const onSearch = (term: string) => {
		searchStore.search(term);
	};

	let currentPath: string;
	beforeUpdate(async () => {
		currentPath = $page.url.pathname;
	});
</script>

<header class="flex w-full border border-l-0 border-r-0 border-gray">
	<a href="/">
		<img width="40" height="40" src="/images/tea-icon.png" alt="tea" />
	</a>
	<ul class="flex h-10 gap-4 pl-4 align-middle leading-10 text-gray">
		<button on:click={navStore.back} class={$prevPath ? 'active' : ''}>&#8592</button>
		<button on:click={navStore.next} class={$nextPath ? 'active' : ''}>&#8594</button>
	</ul>
	<SearchInput
		class="flex-grow border border-none py-4"
		size="small"
		placeholder="search the tea store"
		{onSearch}
	/>
	<ul class="flex gap-4 pr-4 pt-2 align-middle text-gray">
		<button class="icon-filter hover:text-white" />
		<button class="icon-share hover:text-white" />
		<button class="icon-star-empty hover:text-white" />
	</ul>
	<ProfileNavButton />
</header>
<menu
	class="flex h-10 gap-4 border border-l-0 border-r-0 border-t-0 border-gray pl-4 align-middle leading-10 text-gray"
>
	<a href="/cli" class={currentPath === '/cli' ? 'active' : ''}>install teaCli</a>
	<a href="/documentation" class={currentPath === '/documentation' ? 'active' : ''}>documentation</a
	>
	<a href="/packages" class={currentPath === '/packages' ? 'active' : ''}>packages</a>
	<a href="https://github.com/teaxyz" target="_blank" rel="noreferrer">
		<i class="icon-star-empty" /> Github (5.2k)
	</a>
</menu>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	menu > a:hover {
		color: white;
	}
	menu a.active {
		color: white;
	}

	ul button {
		pointer-events: none;
	}

	ul button.active {
		color: white;
		pointer-events: all;
	}
</style>
