<script lang="ts">
	import { shellOpenExternal, submitLogs } from "@native";
	import { navStore } from "$libs/stores";
	import LoginButton from "./login-button.svelte";
  import ToolTip from "@tea/ui/tool-tip/tool-tip.svelte";
	const { sideNavOpen } = navStore;

	const toggleSideNav = () => {
		sideNavOpen.update((v) => !v);
	};

	const submitBugReport = async () => {
		const logId = await submitLogs();
		const bugFormUrl = `https://airtable.com/shravDxWeNwwpPkFV?prefill_log_id=${logId}&hide_log_id=true`;
		shellOpenExternal(bugFormUrl);
	};

	const preventDoubleClick = (evt: MouseEvent) => evt.stopPropagation();
</script>

<div class="mr-1 flex h-full items-center justify-end gap-2 p-2">
	<button
		
		class="border-gray group flex h-[28px] w-[28px] items-center justify-center rounded-sm border hover:bg-[#e1e1e1]"
		on:click={() => submitBugReport()}
		on:dblclick={preventDoubleClick}
	>
		<ToolTip class="ml-[-80px]">
			<div class="icon-bug text-l text-gray flex group-hover:text-black" slot="target" />
			<div slot="tooltip-content" class="flex flex-col items-center">
				<div>Report Feedback</div>
			</div>
		</ToolTip>
	</button>
	<!-- Add this back when dropdown is ready -->
	<!-- <button
		class="border-gray group flex h-[28px] w-[28px] items-center justify-center rounded-sm border hover:bg-[#e1e1e1]"
		on:click={toggleSideNav}
		on:dblclick={preventDoubleClick}
	>
		<div class="icon-gear text-l text-gray flex group-hover:text-black" />
	</button> -->
	<LoginButton />
</div>
