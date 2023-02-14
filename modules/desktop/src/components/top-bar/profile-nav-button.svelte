<script lang="ts">
	import { authStore } from '$libs/stores';
	import type { Developer } from '@tea/ui/types';
	import { baseUrl } from '$libs/v1-client';

	const { shell } = window.require('electron');

	let user: Developer | null = null;
	const deviceId = authStore.deviceIdStore;

	const openGithub = () => {
		shell.openExternal(`${baseUrl}/auth/user?device_id=${$deviceId}`)
		try {
			authStore.pollSession();
		} catch (error) {
			console.error(error);
		}
	};

	authStore.subscribe((u) => (user = u));
</script>

{#if user}
	<a href="/profile">
		<section class="flex">
			<img width="40" height="40" src={user.avatar_url || '/images/bored-ape.png'} alt="profile" />
			<div class="text-gray p-2">@{user.login}</div>
		</section>
	</a>
{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<section class="flex" on:click={openGithub}>
		<figure class="p-2">
			<img width="28" height="28" src="/images/github.png" alt="profile" />
		</figure>
		<div class="text-gray p-2">Login</div>
	</section>
{/if}
