<script>
	import '$appcss';
	import PageHeader from '$components/PageHeader/PageHeader.svelte';
	import ProfileBanner from '$components/ProfileBanner/ProfileBanner.svelte';
	import Preflight from '$components/Preflight/Preflight.svelte';
	import Badges from '$components/Badges/Badges.svelte';
	import InstalledPackages from '$components/InstalledPackages/InstalledPackages.svelte';
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
