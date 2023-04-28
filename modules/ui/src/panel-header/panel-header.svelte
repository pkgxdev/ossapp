<script lang="ts">
  export let title: string;
  export let ctaLabel: string;
  export let ctaLink: string;
</script>

<header class="flex items-center justify-between border border-gray bg-black p-4 text-primary">
  <span class="uppercase">{title}</span>
  <a href={ctaLink} class="text-sm underline">{ctaLabel}</a>
</header>
