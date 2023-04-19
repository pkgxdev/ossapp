<script lang="ts">
	import { shellOpenExternal } from "@native";
	import { navStore } from "$libs/stores";
	import LoginButton from "./login-button.svelte";
	const { sideNavOpen } = navStore;

	const toggleSideNav = () => {
		sideNavOpen.update((v) => !v);
	};
</script>

<div class="mr-1 flex h-full items-center justify-end gap-2 p-2">
	<button
		class="border-gray group flex h-[28px] w-[28px] items-center justify-center rounded-sm border hover:bg-[#e1e1e1]"
		on:click={() => shellOpenExternal("https://github.com/teaxyz/gui/issues/new")}
	>
		<div class="icon-bug text-l text-gray flex group-hover:text-black" />
	</button>
	<button
		class="border-gray group flex h-[28px] w-[28px] items-center justify-center rounded-sm border hover:bg-[#e1e1e1]"
		on:click={toggleSideNav}
	>
		<div class="icon-gear text-l text-gray flex group-hover:text-black" />
	</button>
	<LoginButton />
</div>
