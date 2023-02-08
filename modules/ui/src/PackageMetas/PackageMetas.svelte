<script lang="ts">
	const data = {
		last_modified: new Date(), // convert this to time ago
		license: 'MIT',
		byte_size: 22700000,
		homepage_url: 'homepage.org',
		documentation_url: 'https://docs.org',
		repo_url: 'https://github.orm/owner/repo',
		contributors: [
			{
				login: 'optimus_prime',
				avatar_url: '',
				owner: true
			},
			{
				login: 'batman_suparman',
				avatar_url: '',
				owner: false
			}
		],
		categories: [
			{
				name: 'utility'
			},
			{
				name: 'design'
			},
			{
				name: 'gaming'
			}
		]
	};
</script>

<section class="bg-black">
	<h1 class="border border-gray p-4 text-primary">METADATA</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">{data.last_modified}</span>
		</li>
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">{data.license}</span>
		</li>
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">{data.byte_size}</span>
		</li>
	</ul>
	<h1 class="border border-t-0 border-gray p-4 text-primary">HOMEPAGE</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">{data.homepage_url}</span>
		</li>
	</ul>
	<h1 class="border border-t-0 border-gray p-4 text-primary">DOCUMENTATION</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">{data.documentation_url}</span>
		</li>
	</ul>
	<h1 class="border border-t-0 border-gray p-4 text-primary">GITHUB REPOSITORY</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="border border-gray p-4">
			<i class="icon-calendar" />
			<span class="ml-4">{data.repo_url}</span>
		</li>
	</ul>
	<h1 class="border border-t-0 border-gray p-4 text-primary">CONTRIBUTORS</h1>
	<ul class="border border-t-0 border-gray p-4">
		<li class="flex items-center border border-gray p-4">
			<figure class="h-5 w-5 bg-gray" />
			<span class="ml-4">optimus_prime</span>
		</li>
		<li class="flex items-center border border-gray p-4">
			<figure class="h-5 w-5 bg-gray" />
			<span class="ml-4">batman_suparman</span>
		</li>
		<li class="flex items-center border border-gray p-4">
			<figure class="h-5 w-5 bg-gray" />
			<span class="ml-4">james_bond</span>
		</li>
		<li class="flex items-center border border-gray p-4">
			<figure class="h-5 w-5 bg-gray" />
			<span class="ml-4">pizza-rocks</span>
		</li>
		<li class="flex items-center border border-gray p-4">
			<figure class="h-5 w-5 bg-gray" />
			<span class="ml-4">cognito_inc</span>
		</li>
	</ul>
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
