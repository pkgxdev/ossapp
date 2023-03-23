<script lang="ts">
	import type { GUIPackage } from '$libs/types';
	import Button from "@tea/ui/button/button.svelte";
  import ImgLoader from "@tea/ui/img-loader/img-loader.svelte";
  export let pkg:GUIPackage;
  export let ctaLabel = "INSTALL";
	export let ctaType: "ghost" | "plain" = "plain";
	export let ctaColor: "green" | "secondary" = "secondary";
  export let onClick: () => void;
</script>

<figure class="flex flex-row p-2 gap-2 border border-gray">
  <ImgLoader
    class="pkg-image object-cover w-16 h-16"
    src={!pkg.thumb_image_url.includes("https://tea.xyz")
      ? "https://tea.xyz/Images/package-thumb-nolabel4.jpg"
      : pkg.thumb_image_url}
    alt={pkg.name}
  />
  <header class="flex-grow">
    <h1>{pkg.full_name}</h1>
    <p class="text-xs line-clamp-2">{pkg.desc}</p>
  </header>
  <aside>
    <Button
      class="h-8 w-1/2 border border-gray p-2 text-xs"
      onClick={onClick}
      type={ctaType}
      color={ctaColor}
    >{ctaLabel}
    </Button>
    <footer class="text-xs text-center mt-2">v{pkg.version}</footer>
  </aside>
</figure>