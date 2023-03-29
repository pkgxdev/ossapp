<script lang="ts">
	import "../app.css";
	import type { Package } from "../types";
	import ImgLoader from "../img-loader/img-loader.svelte";
	import ProgressCircle from "../progress-circle/progress-circle.svelte";
	import InstallButton from "./install-button.svelte";

	export let pkg: Package;
	export let availableVersions: string[];
	export let link: string;
	export let ctaLabel: string;
	export let progessLoading = 0;
	export let ctaType: "ghost" | "plain" = "ghost";
	export let ctaColor: "green" | "secondary" = "secondary";

	export let onClickCTA = async (_version: string) => {
		console.log("do nothing");
	};
</script>

<section class="package-card relative h-auto border border-gray">
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
				<p class="text-xs font-thin line-clamp-2">{pkg.desc}</p>
			{/if}
		</article>
	</a>
	<footer class="absolute bottom-0 left-0 flex w-full items-stretch justify-between gap-2 p-2">
		<div>
			<p>
				<span class="pk-version text-xs font-extralight">v{pkg.version}</span>
				<!--
        TODO: uncomment once install counts improve
        <br>
        <span class="package-install-no">>{{- .installs -}}&nbsp;installs</span> -->
			</p>
		</div>
		<InstallButton {ctaLabel} {ctaColor} {ctaType} {onClickCTA} {availableVersions} />
	</footer>
	{#if progessLoading > 0 && progessLoading < 100}
		<div class="absolute top-0 left-0 h-full w-full bg-black bg-opacity-50">
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
		cursor: auto;
	}
	section:hover {
		background-color: #252525;
	}

	figure {
		position: relative;
		height: 70px;
	}

	.package-card :global(.pkg-image) {
		box-shadow: 0px 0px 12px #0c0c0c !important;
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
</style>
