<script lang="ts">
	import type { Package } from '../types';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let pkg: Package;

	const computeFileSize = (bytes: number): string => {
		let n: number = bytes;
		let unit = 'bytes';
		let divisor = 1;

		if (n > 1024 ** 3) {
			unit = 'GB';
			divisor = 1024 ** 3;
		} else if (n > 1024 ** 2) {
			unit = 'MB';
			divisor = 1024 ** 2;
		} else if (n > 1024) {
			unit = 'KB';
			divisor = 1024;
		}

		return `${(n / divisor).toFixed(2)} ${unit}`;
	};
</script>

<section class="bg-black">
	<h1 class="border border-gray p-4 text-primary">METADATA</h1>
	<ul class="border border-t-0 border-gray p-4">
		{#if pkg?.bottles}
			<li class="border border-gray p-4">
				<i class="icon-calendar" />
				<span class="ml-4">{dayjs().to(dayjs(pkg?.bottles[0].last_modified_at))}</span>
			</li>
		{/if}
		{#if pkg?.license}
			<li class="border border-gray p-4">
				<i class="icon-calendar" />
				<span class="ml-4">{pkg.license}</span>
			</li>
		{/if}
		{#if pkg?.bottles}
			<li class="border border-gray p-4">
				<i class="icon-calendar" />
				<span class="ml-4">{computeFileSize(pkg?.bottles[0].bytes)}</span>
			</li>
		{/if}
	</ul>
	<h1 class="border border-t-0 border-gray p-4 text-primary">HOMEPAGE</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<a target="_blank" rel="noreferrer" href={pkg.homepage}>
				<span class="ml-4">{pkg.homepage}</span>
			</a>
		</li>
	</ul>
	{#if pkg.documentation_url}
		<h1 class="border border-t-0 border-gray p-4 text-primary">DOCUMENTATION</h1>
		<ul class="border border-t-0 border-gray p-4">
			<li class="border border-gray p-4">
				<i class="icon-calendar" />
				<span class="ml-4">{pkg.documentation_url}</span>
				<a target="_blank" rel="noreferrer" href={pkg.documentation_url}>
					<span class="ml-4">{pkg.documentation_url}</span>
				</a>
			</li>
		</ul>
	{/if}
	{#if pkg.github}
		<h1 class="border border-t-0 border-gray p-4 text-primary">GITHUB REPOSITORY</h1>
		<ul class="border border-t-0 border-gray p-4">
			<li class="border border-gray p-4">
				<i class="icon-calendar" />
				<a target="_blank" rel="noreferrer" href={`https://github.com/${pkg.github}`}>
					<span class="ml-4">{pkg.github}</span>
				</a>
			</li>
		</ul>
	{/if}
	{#if pkg.contributors}
		<h1 class="border border-t-0 border-gray p-4 text-primary">CONTRIBUTORS</h1>
		<ul class="border border-t-0 border-gray p-4">
			{#each pkg.contributors as contributor}
				<a href={`https://github.com/${contributor.login}`} rel="noreferrer" target="_blank">
					<li class="flex items-center border border-gray p-4">
						<figure class="h-5 w-5 bg-gray">
							<img src={contributor.avatar_url} alt={contributor.login} />
						</figure>
						<span class="ml-4">{contributor.login}</span>
					</li>
				</a>
			{/each}
		</ul>
	{/if}
	<h1 class="border border-t-0 border-gray p-4 text-primary">CATEGORIES</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">utility</span>
		</li>
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">design</span>
		</li>
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">gaming</span>
		</li>
	</ul>
</section>
