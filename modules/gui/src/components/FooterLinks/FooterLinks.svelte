<script lang="ts">
	import Button from '@tea/ui/Button/Button.svelte';
</script>

<footer class="relative h-auto w-full bg-black font-machina">
	<section class="p-4 px-16 py-16">
		<h3 class="mb-5 text-2xl text-primary">QUICK LINKS</h3>
		<menu class="flex gap-4">
			<div class="flex-grow border border-l-0 border-r-0 border-gray">
				<a href="/">
					<Button>
						<div class="flex justify-between text-primary hover:text-black">
							<div class="uppercase">About the tea store</div>
							<div>&#8594</div>
						</div>
					</Button>
				</a>
			</div>
			<div class="flex-grow border border-l-0 border-r-0 border-gray">
				<a href="/">
					<Button>
						<div class="flex justify-between text-primary hover:text-black">
							<div class="uppercase">REPORT A PROBLEM</div>
							<div>&#8594</div>
						</div>
					</Button>
				</a>
			</div>
			<div class="flex-grow border border-l-0 border-r-0 border-gray">
				<a href="https://tea.xyz" target="_blank" rel="noreferrer">
					<Button>
						<div class="flex justify-between text-primary hover:text-black">
							<div class="uppercase">VISIT TEA.XYZ</div>
							<div>&#8594</div>
						</div>
					</Button>
				</a>
			</div>
		</menu>
	</section>

	<section class="h-16 border border-r-0 border-gray p-4 px-16">
		<div class="flex gap-4 text-xs text-gray">
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
