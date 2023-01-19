<script>
	export let href = '';
	export let title = '';

	let isBlank = href.includes('http') || href.includes('https');
</script>

<a {href} {title} target={isBlank ? '_blank' : ''} rel=""><slot /></a>
