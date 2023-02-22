<script lang="ts">
	import '$appcss';
	import Button from '@tea/ui/button/button.svelte';
	import { openTerminal } from '@native';

	let copyButtonText = 'COPY';
	const copyValue = `sh <(curl https://tea.xyz)`;

	const onCopy = () => {
		copyButtonText = 'COPIED!';
		navigator.clipboard.writeText(copyValue);
	};

	const onInstall = () => {
		openTerminal(copyValue);
	}
</script>

<section class="border-gray mt-4 border bg-black">
	<header class="flex flex-col items-center py-8">
		<figure>
			<img alt="tea" src="/images/tea-icon.png" class="rounded-md" />
		</figure>
		<p class="text-primary">tea.cli ver. 0.6.0</p>
	</header>
	<footer class="border-gray flex h-20 border-t text-white">
		<input class="flex-grow bg-black pl-4" disabled value="sh <(curl tea.xyz)>" />
		<Button class="w-16 border-0 border-l-2 text-sm" onClick={onCopy}>{copyButtonText}</Button>
		<Button class="w-56 border-0 border-l-2 text-sm" onClick={onInstall}
			>OPEN IN TERMINAL</Button
		>
	</footer>
</section>
