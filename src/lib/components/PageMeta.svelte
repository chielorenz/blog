<script lang="ts">
	let {
		title,
		ogTitle,
		description = 'Personal website',
		path = '/',
		type = 'website',
		image = '/og.png',
		imageWidth = 1200,
		imageHeight = 630
	}: {
		title: string;
		ogTitle?: string;
		description?: string;
		path?: string;
		type?: 'website' | 'article';
		image?: string;
		imageWidth?: number;
		imageHeight?: number;
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={ogTitle ?? title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://chielorenz.com{path}" />
	<meta property="og:type" content={type} />
	<meta property="og:image" content="https://chielorenz.com{image}" />
	<meta property="og:image:width" content={String(imageWidth)} />
	<meta property="og:image:height" content={String(imageHeight)} />
</svelte:head>
