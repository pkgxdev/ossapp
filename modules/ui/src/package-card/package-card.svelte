<script lang="ts">
	import "../app.css";
	import type { Package } from "../types";
	import ImgLoader from "../img-loader/img-loader.svelte";

	export let pkg: Package;
	export let link: string;
	export let ctaLabel: string;

	export let onClickCTA = () => {
		console.log("do nothing");
	};
</script>

<section class="package-card border border-gray p-4">
	<a href={link}>
		<figure>
			<ImgLoader
				class="pkg-image"
				src={!pkg.thumb_image_url.includes("https://tea.xyz")
					? "https://tea.xyz/Images/package-thumb-nolabel4.jpg"
					: pkg.thumb_image_url}
				alt={pkg.name}
			/>
			<article class="card-thumb-label">
				<i class="icon-tea-logo-iconasset-1">
					<!-- TODO: replace with icon.svg -->
				</i>
				<h3>{pkg.name}</h3>
				{#if pkg.maintainer}
					<h4>&#x2022;&nbsp;{pkg.maintainer}</h4>
				{/if}
			</article>
		</figure>
	</a>
	<footer class="mt-4 flex items-center justify-between">
		<div>
			<p>
				<span class="pk-version text-xs">V&NonBreakingSpace;{pkg.version}</span>
				<!--
        TODO: uncomment once install counts improve
        <br>
        <span class="package-install-no">>{{- .installs -}}&nbsp;installs</span> -->
			</p>
		</div>
		<button class="p-2 font-machina" on:click={onClickCTA}>{ctaLabel}</button>
	</footer>
</section>

<style>
	section {
		background-color: #1a1a1a;
		transition: all 0.3s;
		width: 100%;
	}

	figure {
		position: relative;
		min-height: 150px;
	}

	.package-card :global(.pkg-image) {
		box-shadow: 0px 0px 12px #0c0c0c !important;
		width: 100%;
		height: 100%;
	}
	.card-thumb-label i {
		font-size: 1.5vw;
		color: black;
	}

	.card-thumb-label h3 {
		color: black;
		font-size: 1.8vw;
		line-height: 1.8vw;
		margin: 0px 0px 0.5vw 0vw;
		padding: 0px;
	}

	.card-thumb-label {
		position: absolute;
		background: rgba(255, 255, 255, 0.9);
		left: 0;
		bottom: 0vw;
		padding: 1.116vw;
		text-align: left;
		width: 90%;
		height: 40%;
	}

	.card-thumb-label h4 {
		color: black;
		font-size: 0.9vw;
		line-height: 1vw;
		margin: 0px;
		padding: 0px;
	}

	button {
		background-color: #1a1a1a;
		border: 0.5px solid #ffffff;
		color: #fff;
		text-decoration: none;
		text-transform: uppercase;
		min-width: 120px;
		transition: 0.1s linear;
	}

	button:hover {
		background-color: #8000ff;
		box-shadow: inset 0vw 0vw 0vw 0.223vw #1a1a1a !important;
	}
</style>
