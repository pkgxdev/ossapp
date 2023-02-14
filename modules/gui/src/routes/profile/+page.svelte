<script>
	import '$appcss';
	import PageHeader from '$components/page-header/page-header.svelte';
	import ProfileBanner from '$components/profile-banner/profile-banner.svelte';
	import Preflight from '$components/Preflight/Preflight.svelte';
	import Badges from '$components/badges/Badges.svelte';
	import InstalledPackages from '$components/installed-packages/installed-packages.svelte';
</script>

<div>
	<PageHeader>PROFILE</PageHeader>
	<section>
		<ProfileBanner />
	</section>

	<section class="mt-8 grid grid-cols-2 gap-8">
		<div>
			<Preflight />
		</div>
		<div>
			<Badges />
		</div>
	</section>

	<section class="mt-8">
		<InstalledPackages />
	</section>
</div>
