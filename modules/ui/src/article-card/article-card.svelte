<script lang="ts">
  import "../app.css";

  type Article = {
    title: string;
    img_url: string;
    copy: string;
    cta_label: string;
    link?: string;
  };

  export let content: Article;
  export let onClick: undefined | (() => void) = undefined;
</script>

<section class="border border-gray">
  <header class="bg-accent p-2 uppercase text-white">{content.title}</header>
  <figure class="h-24">
    <img class="h-24 w-full object-cover" src={content.img_url} alt={content.title} />
  </figure>
  <article class="p-4">
    <p class="text-xs line-clamp-3">{content.copy}</p>
    {#if content.link}
      <a href={content.link || "#"}>
        <button class="mt-2 text-primary">{content.cta_label}</button>
      </a>
    {:else if onClick}
      <button on:click={onClick} class="mt-2 text-primary">{content.cta_label}</button>
    {:else}
      <button disabled class="mt-2 text-gray">{content.cta_label}</button>
    {/if}
  </article>
</section>
