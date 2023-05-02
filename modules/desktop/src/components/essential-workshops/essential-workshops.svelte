<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";
  import type { AirtablePost } from "@tea/ui/types";
  import Posts from "@tea/ui/posts/posts.svelte";
  import PanelHeader from "@tea/ui/panel-header/panel-header.svelte";
  import Preloader from "@tea/ui/Preloader/Preloader.svelte";
  import { postsStore } from "$libs/stores";

  export let title = "Workshops";
  export let ctaLabel = "View all";

  let courses: AirtablePost[] = [];

  postsStore.subscribeByTag("course", (posts) => (courses = posts));
</script>

<PanelHeader {title} {ctaLabel} ctaLink="/" />
{#if courses.length}
  <Posts posts={courses} linkTarget="_blank" />
{:else}
  <section class="h-64 border border-gray bg-black p-4">
    <Preloader />
  </section>
{/if}
