<script lang="ts">
	import Button from '../Button/Button.svelte';

	export let title: string;
	export let mainCtaTitle: string;
	export let mainCtaLink = '/';
</script>

<section class="bg-black">
	<header class="w-full border border-gray p-2 text-primary">{title}</header>
	<ul class="border border-b-0 border-r-0 border-l-0 border-gray">
		<li class="flex content-center border border-t-0 border-gray">
			<figure class="m-2 w-10 bg-gray" />
			<div class="flex flex-grow pt-4 leading-10">
				<div class="text-sm">Homebrew</div>
				<div class="pl-2 text-sm text-gray">ver 1.21</div>
			</div>
			<div class="m-2 w-28 border border-gray">
				<Button>INSTALL</Button>
			</div>
		</li>
		<li class="flex content-center border border-t-0 border-gray">
			<figure class="m-2 w-10 bg-gray" />
			<div class="flex flex-grow pt-4 leading-10">
				<div class="text-sm">Homebrew</div>
				<div class="pl-2 text-sm text-gray">ver 1.21</div>
			</div>
			<div class="m-2 w-28 border border-gray">
				<Button>INSTALL</Button>
			</div>
		</li>
		<li class="flex content-center border border-t-0 border-gray">
			<figure class="m-2 w-10 bg-gray" />
			<div class="flex flex-grow pt-4 leading-10">
				<div class="text-sm">Homebrew</div>
				<div class="pl-2 text-sm text-gray">ver 1.21</div>
			</div>
			<div class="m-2 w-28 border border-gray">
				<Button>INSTALL</Button>
			</div>
		</li>
		<li class="flex content-center border border-t-0 border-gray">
			<figure class="m-2 w-10 bg-gray" />
			<div class="flex flex-grow pt-4 leading-10">
				<div class="text-sm">Homebrew</div>
				<div class="pl-2 text-sm text-gray">ver 1.21</div>
			</div>
			<div class="m-2 w-28 border border-gray">
				<Button>INSTALL</Button>
			</div>
		</li>
		<li class="flex content-center border border-t-0 border-gray">
			<figure class="m-2 w-10 bg-gray" />
			<div class="flex flex-grow pt-4 leading-10">
				<div class="text-sm">Homebrew</div>
				<div class="pl-2 text-sm text-gray">ver 1.21</div>
			</div>
			<div class="m-2 w-28 border border-gray">
				<Button>INSTALL</Button>
			</div>
		</li>
	</ul>
	<footer class="w-full border border-t-0 border-gray text-gray">
		<a href={mainCtaLink} class="flex w-full">
			<Button>
				<div class="flex w-full justify-between p-2">
					<button>{mainCtaTitle}</button>
					<i class="icon-right-arrow" />
				</div>
			</Button>
		</a>
	</footer>
</section>
