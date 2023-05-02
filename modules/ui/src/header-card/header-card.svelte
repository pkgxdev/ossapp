<script lang="ts">
  import "../app.css";

  export let title: string;
  export let imgUrl: string;
  export let ctaUrl: string;
  export let ctaLabel: string;

  export let articleTitle: string;
  export let description: string;
</script>

<section class="border border-gray bg-black">
  <header class="flex justify-between p-4 text-primary">
    <h1 class="uppercase">{title}</h1>
    <a href={ctaUrl} class="text-sm">{ctaLabel}</a>
  </header>
  <figure class="h-40">
    <img class="h-40 w-full object-cover" src={imgUrl} alt={title} />
  </figure>
  <article class="m-4 border border-gray p-4">
    <h2 class="uppercase text-primary">{articleTitle}</h2>
    <p class="text-gray">{description}</p>
  </article>
</section>
