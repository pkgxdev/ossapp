<script lang="ts">
	import '../app.css';

	let clazz = '';
	export { clazz as class };
	export let size: 'small' | 'medium' | 'large' = 'small';
	export let onSearch: (text: string) => void;

	let timer: NodeJS.Timeout;
	const onChange = (e: KeyboardEvent) => {
		const t = e.target as HTMLInputElement;
		clearTimeout(timer);
		timer = setTimeout(() => {
			onSearch && onSearch(t.value);
		}, 300);
	};
</script>

<section class={`flex items-center border-b border-r-0 border-l-0 py-2 ${size} ${clazz}`}>
	<div class="icon pl-4">
		<i class="icon-search-icon" />
	</div>
	<input type="search" class="pb-2" placeholder="search_" on:keyup={onChange} />
</section>

<!-- <input type="search" class="w-full bg-black h-12 p-4 border border-x-0 border-gray"/> -->
<style>
	.icon-search-icon {
		color: #949494;
		margin-right: 20px;
		position: relative;
		top: 2px;
	}

	section.medium .icon-search-icon {
		font-size: 30px;
	}

	section.medium {
		height: 75px;
	}
	section.large {
		height: 150px;
	}

	section input {
		font-family: 'pp-neue-machina', sans-serif;
		color: #00ffd0;
		text-transform: uppercase;
		margin-bottom: -5px;
		min-width: 60%;
		padding: 0px;
		background-color: #1a1a1a !important;
		border: none;
		color: #00ffd0;
		outline: none;
		border-radius: 0px;
	}

	section.medium input {
		font-size: 24px;
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
