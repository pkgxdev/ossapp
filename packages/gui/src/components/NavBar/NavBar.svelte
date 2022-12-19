<script type="ts">
	import { page } from '$app/stores';
	import { open } from '@tauri-apps/api/shell';
	import { appWindow } from '@tauri-apps/api/window';
	import SearchInput from '@tea/ui/SearchInput/SearchInput.svelte';
	import Button from '@tea/ui/Button/Button.svelte';

	import { beforeUpdate } from 'svelte';

	const openGithub = () => {
		open('https://github.com/teaxyz');
	};

	let maximized = false;
	const toggleMaximize = () => {
		maximized = !maximized;
		if (maximized) {
			appWindow.maximize();
		} else {
			appWindow.unmaximize();
		}
	};

	let routes = [
		{
			path: '/',
			active: false,
			label: 'DISCOVER'
		},
		{
			path: '/documentation',
			active: false,
			label: 'DOCUMENTATION'
		},
		{
			path: '/cli',
			active: false,
			label: 'TEA CLI INSTALL'
		},
		{
			path: '/packages',
			active: false,
			label: 'PACKAGES'
		}
	];

	beforeUpdate(async () => {
		const currentPath = $page.url.pathname;

		for (let i = 0; i < routes.length; i++) {
			let { path } = routes[i];
			routes[i].active = currentPath.includes(path);
		}
		if (currentPath !== '/') {
			routes[0].active = false;
		}
	});

	const onSearch = (term: string) => {
		console.log('navbar search:', term);
	};
</script>

<ul id="NavBar">
	<nav data-tauri-drag-region class="flex justify-between">
		<div class="flex gap-1 p-3 pt-3">
			<button class="titlebar-button" id="titlebar-close" on:click={appWindow.close}>
				<img src="/images/close.svg" alt="close" />
			</button>
			<button class="titlebar-button" id="titlebar-minimize" on:click={appWindow.minimize}>
				<img src="/images/minimize.svg" alt="minimize" />
			</button>
			<button class="titlebar-button" id="titlebar-maximize" on:click={toggleMaximize}>
				<img src="/images/expand.svg" alt="maximize" />
			</button>
		</div>
		<a href="/">
			<img width="40" height="40" src="/images/tea-icon.png" alt="tea" />
		</a>
	</nav>

	<SearchInput class="border border-gray py-4" size="small" {onSearch} />

	{#each routes as route}
		<li class={route.active ? 'nav_button active' : 'nav_button'}>
			<a href={route.path}>
				<Button class="h-16 pl-4 text-left text-white" active={route.active}>{route.label}</Button>
			</a>
		</li>
	{/each}
	<li class="nav_button">
		<Button class="h-16 pl-4 text-left text-white" onClick={openGithub}>VIEW ON GITHUB</Button>
	</li>

	<footer class="w-full border border-x-0 border-gray">
		<a href="/profile">
			<section class="flex">
				<img width="40" height="40" src="/images/bored-ape.png" alt="profile" />
				<div class="p-2 text-gray">@user_name</div>
			</section>
		</a>
	</footer>
</ul>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	ul {
		height: 100vh;
		width: 100%;
	}

	@layer components {
		.nav_button {
			transition: all 0.3s;
			color: theme('colors.white');
			/* padding: theme('spacing.4') theme('spacing.2'); */
		}
		.nav_button button {
			text-align: left;
		}
		.nav_button:hover {
			color: theme('colors.black');
			background-color: theme('colors.primary');
		}
		.nav_button.active {
			color: theme('colors.black');
			background-color: theme('colors.primary');
		}
	}

	nav:hover {
		transition: all 0.3s;
		background-color: #2d2d2d;
	}

	.titlebar-button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 12px;
		height: 12px;
		border-radius: 8px;
		opacity: 0.9;
	}
	.titlebar-button img {
		transition: opacity 0.3s;
		opacity: 0;
	}
	.titlebar-button:hover img {
		opacity: 1;
	}
	#titlebar-close {
		background-color: orangered;
	}
	#titlebar-minimize {
		background-color: orange;
	}
	#titlebar-maximize {
		background-color: green;
	}

	footer {
		position: absolute;
		bottom: 20px;
	}
</style>
