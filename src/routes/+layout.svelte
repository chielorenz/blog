<script lang="ts">
	import './layout.css';
	import outfitFont from '@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?url';
	import ThemeProvider from '#lib/components/ThemeProvider.svelte';
	import Glyphs from '#lib/components/Glyphs.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="preload" href={outfitFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="icon" href="/favicon.svg" />
	<meta property="og:site_name" content="chielorenz" />
	<meta property="og:locale" content="en_US" />
</svelte:head>

<ThemeProvider>
	<Glyphs glyphs={data.glyphs} />
	{@render children()}
</ThemeProvider>
