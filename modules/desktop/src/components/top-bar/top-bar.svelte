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

<header class="border-gray flex items-center justify-between border w-full h-12 pr-2 rounded-t-xl" style="-webkit-app-region: drag">
	<ul class="text-gray flex h-10 gap-2 align-middle leading-10 pl-20">
		<a href="/">
			<button id="home" class="text-xl hover:bg-primary w-12 rounded-md text-center"><i class="icon-tea-logo-iconasset-1"/></button>
		</a>
		<button on:click={navStore.back} class={$prevPath ? 'active' : 'opacity-50'}>&#8592</button>
		<button on:click={navStore.next} class={$nextPath ? 'active' : 'opacity-50'}>&#8594</button>
	</ul>
	<div class="px-2 w-1/3">
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
		box-sizing: border-box;
	}
	#home {
		height: 40px;
		width: 40px;
		background: #222222;
	}
	ul button {
		pointer-events: none;
	}

	ul button.active {
		color: white;
		pointer-events: all;
	}
</style>
