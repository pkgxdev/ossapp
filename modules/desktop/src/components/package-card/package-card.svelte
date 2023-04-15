<script lang="ts">
	import "../../app.css";
	import ProgressCircle from "@tea/ui/progress-circle/progress-circle.svelte";
	import type { GUIPackage } from "$libs/types";
	import { findRecentInstalledVersion } from "$libs/packages/pkg-utils";
	import PackageInstallButton from "$components/package-install-button/package-install-button.svelte";

	export let pkg: GUIPackage;
	export let link: string;
	export let progessLoading = 0;

	$: imgUrl = !pkg.thumb_image_url.includes("https://tea.xyz")
		? "https://tea.xyz/Images/package-thumb-nolabel4.jpg"
		: pkg.thumb_image_url;

	export let onClickCTA = async () => {
		console.log("do nothing");
	};

	// Using this instead of css :active because there is a button inside of a button
	let isActive = false;
	const activate = () => (isActive = true);
	const deactivate = () => (isActive = false);

	const preventPropagation = (evt: MouseEvent) => evt.stopPropagation();
</script>

<section
	class="package-card border-gray relative h-auto border bg-center"
	class:active={isActive}
	style="background-image: url({imgUrl})"
>
	<aside class="blur-sm">
		<figure class="bg-center" style="background-image: url({imgUrl})" />
	</aside>
	<a href={link} on:mousedown={activate} on:mouseup={deactivate} on:mouseleave={deactivate}>
		<div class="package-card-content absolute flex h-full w-full flex-col justify-between">
			<div class="hint-container">
				<div class="hint">
					<div class="text-xs">view more details</div>
					<div class="hint-icon"><i class="icon-upward-arrow" /></div>
				</div>
			</div>
			<div class="content-container relative">
				<article class="card-thumb-label relative">
					<h3 class="text-bold font-mona line-clamp-1 text-2xl font-bold text-white">{pkg.name}</h3>
					<p class="line-clamp-2 h-[32px] text-xs font-thin">{pkg.desc ?? ""}</p>
				</article>
				<div class="relative mt-3.5 flex w-full">
					<div class="install-button" on:mousedown={preventPropagation}>
						<PackageInstallButton
							{pkg}
							onClick={(evt) => {
								// prevent default to prevent the link that this button is inside of from being followed
								evt?.preventDefault();
								onClickCTA();
							}}
						/>
					</div>
				</div>
				<div class="relative mt-1.5 h-[10px] leading-[10px]">
					{#if pkg.state === "NEEDS_UPDATE"}
						<span class="text-[9px]">Updating from v{findRecentInstalledVersion(pkg)}</span>
					{/if}
				</div>
			</div>
		</div>
	</a>

	{#if progessLoading > 0 && progessLoading < 100}
		<div class="absolute left-0 top-0 z-40 h-full w-full bg-black bg-opacity-50">
			<div class="absolute left-0 right-0 top-1/2 m-auto -mt-12 h-24 w-24">
				<ProgressCircle value={progessLoading} />
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		transition: all 0.3s;
		width: 100%;
		height: 340px;
		background-size: cover;
		box-sizing: border-box;
	}

	section.active::before {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(26, 26, 26, 0.7);
		z-index: 2;
		content: "";
		pointer-events: none;
	}

	section.package-card:active {
		border-color: #8000ff;
		box-shadow: 0px 0px 0px 2px rgba(128, 0, 255, 0.5);
	}

	aside {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 50%;
		overflow: hidden;
	}

	figure {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 340px;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.content-container {
		height: 50%;
		background: linear-gradient(180deg, rgba(26, 26, 26, 0.3) 0%, rgba(26, 26, 26, 0.75) 72.92%);
		display: flex;
		flex-direction: column;
		padding: 28px 14px;
		justify-content: space-between;
	}

	.hint-container {
		display: flex;
		justify-content: flex-end;
	}

	.hint {
		width: 60%;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		column-gap: 0.5rem;
		background: linear-gradient(270deg, #e1e1e1 66.29%, rgba(225, 225, 225, 0) 100%);
		color: #1a1a1a;
		visibility: hidden;
	}

	.hint-icon {
		background: #8000ff;
		height: 24px;
		width: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #e1e1e1;
	}

	.package-card {
		background-size: cover;
	}

	.package-card:hover .hint {
		visibility: visible;
	}

	.card-thumb-label {
		text-align: left;
		width: 100%;
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
