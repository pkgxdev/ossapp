<script lang="ts">
	import { shellOpenExternal, submitLogs } from "@native";
	import mouseLeaveDelay from "@tea/ui/lib/mouse-leave-delay";
	import UpdateButton from "./update-button.svelte";
	import { appUpdateStore } from "$libs/stores";
	const { updateStatus } = appUpdateStore;

	const hidePopup = () => {
		isOpen = false;
	};

	const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();

	$: isOpen = false;
</script>

<div
	class="relative"
	use:mouseLeaveDelay={2000}
	on:leave_delay={() => hidePopup()}
	on:dblclick={preventDoubleClick}
>
	<button
		class="border-gray group flex h-[28px] w-[28px] items-center justify-center rounded-sm border hover:bg-[#e1e1e1]"
		class:circle-badge={$updateStatus.status === "available" || $updateStatus.status === "ready"}
		on:click={() => (isOpen = !isOpen)}
	>
		<div class="icon-gear text-l text-gray flex group-hover:text-black" />
	</button>

	<nav
		class="menu border-gray absolute w-full border bg-black p-2 text-xs transition-all"
		class:invisible={!isOpen}
		class:visible={isOpen}
	>
		<!-- TODO: what is this supposed to do? -->
		<!-- <button
			class="hover:bg-gray outline-gray focus:bg-secondary h-8 w-full p-1 text-left outline-1 transition-all hover:bg-opacity-25 hover:outline"
		>
			language
		</button>
		<hr /> -->
		<button
			class="hover:bg-gray outline-gray h-7 w-full p-1 text-left outline-1 hover:bg-opacity-25 hover:outline"
			on:click={() => shellOpenExternal("https://docs.tea.xyz")}
		>
			docs
		</button>
		<hr />
		<UpdateButton />
	</nav>
</div>

<style>
	hr {
		border: 1px solid #272626;
		margin: 1px 0;
	}

	.menu {
		top: calc(100% + 4px);
		left: calc(50% - 80px);
		width: 160px;
	}

	.circle-badge::after {
		content: "1";
		position: absolute;
		width: 14px;
		height: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		border-radius: 50%;
		background: #ff4100;
		font-size: 10px;
		top: -7px;
		right: -7px;
		z-index: 1;
	}
</style>
