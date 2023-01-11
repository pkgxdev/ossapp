<script lang="ts">
	import { open } from '@tauri-apps/api/shell';
	import { authStore } from '$libs/stores';
	import type { Developer } from '@tea/ui/types';
	import { apiBaseUrl } from '@api';

	let user: Developer | null = null;
	const deviceId = authStore.deviceIdStore;

	const openGithub = () => {
		open(`${apiBaseUrl}/auth/user?device_id=${$deviceId}`);
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
			<div class="p-2 text-gray">@{user.login}</div>
		</section>
	</a>
{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<section class="flex" on:click={openGithub}>
		<figure class="p-2">
			<img width="28" height="28" src="/images/github.png" alt="profile" />
		</figure>
		<div class="p-2 text-gray">Login</div>
	</section>
{/if}
