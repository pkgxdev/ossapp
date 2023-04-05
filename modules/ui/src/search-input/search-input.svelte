<script lang="ts">
	import "../app.css";

	let clazz = "";
	export { clazz as class };
	export let size: "small" | "medium" | "large" = "small";
	export let onSearch = (text: string) => {
		console.log(text);
	};
	export let onFocus = () => {
		console.log("focus");
	};
	export let placeholder = "search_";

	let timer: NodeJS.Timeout;
	const onChange = (e: KeyboardEvent) => {
		const t = e.target as HTMLInputElement;
		clearTimeout(timer);
		timer = setTimeout(() => {
			onSearch(t.value);
		}, 300);
	};
</script>

<section class={`flex items-center pb-1 ${size} ${clazz}`}>
	<div class="icon pl-4">
		<i class="icon-search-icon" />
	</div>
	<input
		type="search"
		class="flex-grow pb-2 text-sm"
		{placeholder}
		on:keyup={onChange}
		on:focus={onFocus}
	/>
</section>

<!-- <input type="search" class="w-full bg-black h-12 p-4 border border-x-0 border-gray"/> -->
<style>
	section {
		padding-top: 0.15rem;
	}
	.icon-search-icon {
		color: #949494;
		margin-right: 10px;
		position: relative;
		top: 3px;
	}

	section.medium .icon-search-icon {
		font-size: 24px;
	}

	section.medium {
		height: 75px;
	}
	section.large {
		height: 150px;
	}

	section input {
		color: #00ffd0;
		margin-bottom: -2px;
		min-width: 60%;
		padding: 0px;
		background-color: #1a1a1a !important;
		border: none;
		color: #00ffd0;
		outline: none;
		border-radius: 0px;
		line-height: 34px;
	}

	section.medium input {
		font-size: 16px;
	}
	section.large input {
		font-size: 32px;
	}

	section input::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: #949494;
		opacity: 1; /* Firefox */
	}
</style>
