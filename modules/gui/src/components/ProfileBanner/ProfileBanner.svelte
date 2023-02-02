<script lang="ts">
	import '$appcss';
	import { authStore } from '$libs/stores';
	import type { Developer } from '@tea/ui/types';

	let user: Developer | null = null;
	const authPage = `http://localhost:3000/v1/auth/user?device_id=${authStore.deviceId}`; // https://api.tea.xyz/v1/auth/user?device_id=device_id

	authStore.subscribe((u) => (user = u));
</script>

{#if user}
	<section class="border-gray border-2 bg-black p-2">
		<div class="profile_banner border-gray container flex border bg-black">
			<img class="w-1/5" src={user.avatar_url || '/images/bored-ape.png'} alt="profile" />
			<div class="flex w-4/5 items-center p-5">
				<div class="w-1/2 pl-5">
					<p class="text-gray uppercase">Authenticated with GitHub</p>
					<p />
					<p class="text-primary text-4xl">@{user.login}</p>
				</div>
				<div class="border-gray h-full border-l" />
				<div class="w-1/2 pl-10">
					<p class="text-gray uppercase leading-loose">
						Country: <span>{user?.country}</span><br />Wallet:
						{#if user.wallet}
							<span>{user.wallet}</span>
						{:else}
							<a class="text-green underline" href="/">Connect Now</a>
						{/if}
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}
