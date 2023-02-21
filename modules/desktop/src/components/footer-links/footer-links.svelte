<script lang="ts">
	import Button from '@tea/ui/Button/Button.svelte';
	import * as pub from '$env/static/public';
pub.</script>

<footer class="font-machina relative h-auto w-full bg-black">
	<section class="p-4 px-16 py-16">
		<h3 class="text-primary mb-5 text-2xl">QUICK LINKS</h3>
		<menu class="flex gap-4">
			<div class="border-gray flex-grow border border-l-0 border-r-0">
				<a href="/">
					<Button>
						<div class="text-primary flex justify-between hover:text-black">
							<div class="uppercase">About the tea store</div>
							<div>&#8594</div>
						</div>
					</Button>
				</a>
			</div>
			<div class="border-gray flex-grow border border-l-0 border-r-0">
				<a href="/">
					<Button>
						<div class="text-primary flex justify-between hover:text-black">
							<div class="uppercase">REPORT A PROBLEM</div>
							<div>&#8594</div>
						</div>
					</Button>
				</a>
			</div>
			<div class="border-gray flex-grow border border-l-0 border-r-0">
				<a href="https://tea.xyz" target="_blank" rel="noreferrer">
					<Button>
						<div class="text-primary flex justify-between hover:text-black">
							<div class="uppercase">VISIT TEA.XYZ</div>
							<div>&#8594</div>
						</div>
					</Button>
				</a>
			</div>
		</menu>
	</section>

	<section class="border-gray h-16 border border-r-0 p-4 px-16 flex justify-between">
		<div class="text-gray flex gap-4 text-xs">
			<a
				href="https://tea.xyz/terms-of-use/"
				target="_blank"
				rel="noreferrer"
				class="hover:text-white"
			>
				TERMS & SERVICES
			</a>
			<a
				href="https://tea.xyz/privacy-policy/"
				target="_blank"
				rel="noreferrer"
				class="hover:text-white"
			>
				PRIVACY POLICY
			</a>
		</div>
		{#if pub.PUBLIC_VERSION}
			<div class="text-gray flex gap-4 text-xs">
				<span>v{pub.PUBLIC_VERSION}</span>
			</div>
		{/if}
	</section>
</footer>

<style>
	h3 {
		font-family: 'pp-neue-machina', sans-serif;
		color: #00ffd0;
	}

	p,
	.nav-item {
		font-family: 'sono', sans-serif;
		color: #ffffff;
	}

	.list-group-item {
		font-family: 'pp-neue-machina', sans-serif;
		text-transform: uppercase;
		transition: 0.1s ease-in;
	}

	.list-group-item:hover {
		padding-left: 1vw;
	}
</style>
