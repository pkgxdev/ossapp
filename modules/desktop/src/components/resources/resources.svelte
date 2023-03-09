<script lang="ts">
	import '$appcss';
	import { t } from '$libs/translations'; 
	import { postsStore } from '$libs/stores';
	import type { AirtablePost } from '@tea/ui/types';
	import Posts from '@tea/ui/posts/posts.svelte';
	import Preloader from '@tea/ui/Preloader/Preloader.svelte';

	let posts: AirtablePost[] = [];

  let tab: "ALL" | "ARTICLE" | "WORKSHOP" = "ALL";

  const setPosts = (newPosts: AirtablePost[]) => {
    posts = tab === "ALL" ? newPosts : newPosts.filter((p) => p.tags.includes(tab));
  }

  const switchTab = (nextTab: "ALL" | "ARTICLE" | "WORKSHOP") => {
		tab = nextTab;
    setPosts($postsStore);
	}

  postsStore.subscribe(setPosts);
</script>

<header class="flex items-center justify-between border border-gray bg-black p-4 text-primary">
  <div>{$t("home.resources")}</div>

  <section class="border border-gray mr-2 rounded-sm h-10 text-gray font-thin flex">
    <button on:click={() => switchTab("ALL")} class={`px-2 ${tab === "ALL" && "active"}`}>{$t("common.all")}</button>
    <button on:click={() => switchTab("ARTICLE")} class={`px-2 ${tab === "ARTICLE" && "active"}`}>{$t("common.articles")}</button>
    <button on:click={() => switchTab("WORKSHOP")} class={`px-2 ${tab === "WORKSHOP" && "active"}`}>{$t("common.workshops")}</button>
  </section>
</header>
  
{#if posts.length}
	<Posts {posts} linkTarget="_blank" />
{:else}
	<section class="border-gray h-64 border bg-black p-4">
		<Preloader />
	</section>
{/if}


<style>
	button {
		height: 100%;
		text-decoration: none;
		min-width: 120px;
		transition: 0.1s linear;
	}

	button:hover, button.active {
		color: white;
		background-color: #8000ff;
		box-shadow: inset 0vw 0vw 0vw 0.223vw #1a1a1a !important;
		box-sizing: border-box;
	}
</style>