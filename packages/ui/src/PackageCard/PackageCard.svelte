<script type="ts">

	import '../app.css';
	import type { Package } from '../types';
	export let pkg: Package;
	export let link: string;
</script>

<section class="p-4 border border-gray">
	<figure>
		<img
			src={!pkg.thumb_image_url.includes('https://tea.xyz')
				? 'https://tea.xyz/Images/package-thumb-nolabel4.jpg'
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
	<footer class="flex mt-4 justify-between items-center">
		<div>
			<p>
				<span class="text-xs">V&NonBreakingSpace;{pkg.version}</span>
				<!--
        TODO: uncomment once install counts improve
        <br>
        <span class="package-install-no">>{{- .installs -}}&nbsp;installs</span> -->
			</p>
		</div>
		<!-- TODO: move this button into its own reusable component -->
		<a href={link}>
			<button class="detail-btn"><i class="icon-enter-arrow" />details</button>
		</a>
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
	}


	img {
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
		font-size: .9vw;
		line-height: 1vw;
		margin: 0px;
		padding: 0px;
	}

	.detail-btn {
		position: relative;
		float: right;
		right: 0;
		display: inline-block;
		font-family: 'pp-neue-machina', sans-serif;
		background-color: #1a1a1a;
		border: 0.5px solid #ffffff;
		color: #fff;
		padding-top: 0.279vw;
		text-decoration: none;
		text-transform: uppercase;
		width: 120px;
		height: 2.232vw;
		min-height: 34px;
		transition: 0.1s linear;
	}

	.detail-btn:hover {
		background-color: #8000ff;
		box-shadow: inset 0vw 0vw 0vw 0.223vw #1a1a1a !important;
	}

	/* Icon Styling */

	.detail-btn .icon-enter-arrow {
		display: inline-block;
		position: relative;
		margin-right: 0.558vw;
		transition: 0.2s ease-in-out;
	}

	.detail-btn:hover .icon-enter-arrow {
		display: inline-block;
		transform: rotate(-45deg) !important;
	}
</style>
