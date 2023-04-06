<script lang="ts">
	import "../../app.css";
	import ImgLoader from "@tea/ui/img-loader/img-loader.svelte";
	import ProgressCircle from "@tea/ui/progress-circle/progress-circle.svelte";
	import InstallButton from "../install-button/install-button.svelte";
	import type { GUIPackage } from "$libs/types";

	export let pkg: GUIPackage;
	export let availableVersions: string[];
	export let link: string;
	export let progessLoading = 0;

	export let onClickCTA = async (_version: string) => {
		console.log("do nothing");
	};
</script>

<section class="package-card border-gray relative h-auto border">
	<a href={link}>
		<figure class="relative">
			<ImgLoader
				class="pkg-image object-cover"
				src={!pkg.thumb_image_url.includes("https://tea.xyz")
					? "https://tea.xyz/Images/package-thumb-nolabel4.jpg"
					: pkg.thumb_image_url}
				alt={pkg.name}
			/>
		</figure>
		<article class="card-thumb-label">
			<h3 class="text-bold font-mona text-xl font-bold text-white">{pkg.name}</h3>
			{#if pkg.maintainer}
				<h4 class="text-sm font-light">&#x2022;&nbsp;{pkg.maintainer}</h4>
			{/if}
			{#if pkg.desc}
				<p class="line-clamp-2 text-xs font-thin">{pkg.desc}</p>
			{/if}
		</article>
	</a>
	<footer class="absolute bottom-0 left-0 flex w-full p-3">
		<div class="install-button">
			<InstallButton {pkg} {availableVersions} onClick={onClickCTA} />
		</div>
	</footer>
	{#if progessLoading > 0 && progessLoading < 100}
		<div class="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50">
			<div class="absolute left-0 right-0 top-1/2 m-auto -mt-12 h-24 w-24">
				<ProgressCircle value={progessLoading} />
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		background-color: #1a1a1a;
		transition: all 0.3s;
		width: 100%;
		height: 230px;
	}
	section:hover {
		background-color: #252525;
	}

	figure {
		position: relative;
		height: 70px;
	}

	.package-card :global(.pkg-image) {
		width: 100%;
		height: 100%;
	}

	.card-thumb-label {
		padding: 1.116vw;
		text-align: left;
		width: 100%;
		height: 110px;
	}

	.card-thumb-label p {
		color: white;
	}

	.install-button {
		min-width: 100%;
	}

	@media screen and (min-width: 650px) {
		.install-button {
			min-width: 60%;
		}
	}

	@media screen and (min-width: 1000px) {
		.install-button {
			min-width: 50%;
		}
	}
</style>
