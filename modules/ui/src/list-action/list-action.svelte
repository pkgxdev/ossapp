<script lang="ts">
	import Button from "../button/button.svelte";
	import type { ListActionItem } from "../types";

	export let title: string;
	export let mainCtaTitle: string;
	export let mainCtaLink = "/";

	export let items: ListActionItem[];
	export let onSelectItem = (item: ListActionItem) => console.log(item);

	const onSelect = (item: ListActionItem) => {
		if (onSelectItem) {
			onSelectItem(item);
		}
	};
</script>

<section class="bg-black">
	<header class="w-full border border-gray p-2 text-primary">{title}</header>
	<ul class="border border-b-0 border-r-0 border-l-0 border-gray">
		{#each items as item}
			<li class="flex content-center border border-t-0 border-gray">
				<figure class="m-2 w-10 bg-gray">
					<img src={item.image_url} alt={item.title} />
				</figure>
				<div class="flex flex-grow pt-4 leading-10">
					<div class="text-sm">{item.title}</div>
					<div class="pl-2 text-sm text-gray">{item.sub_title}</div>
				</div>
				<div class="m-2 w-28 border border-gray">
					{#if item.detail_url}
						<a href={item.detail_url}>
							<Button>{item.action_label}</Button>
						</a>
					{:else}
						<Button onClick={() => onSelect(item)}>{item.action_label}</Button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
	<footer class="w-full border border-t-0 border-gray text-gray">
		<a href={mainCtaLink} class="flex w-full">
			<Button>
				<div class="flex w-full justify-between p-2">
					<button>{mainCtaTitle}</button>
					<i class="icon-right-arrow" />
				</div>
			</Button>
		</a>
	</footer>
</section>
