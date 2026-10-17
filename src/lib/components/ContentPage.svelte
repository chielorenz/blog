<script lang="ts">
	import type { Component } from 'svelte';
	import AlbumPlayer from './AlbumPlayer.svelte';
	import PageMeta from './PageMeta.svelte';
	import { formatDate, type ContentEntry } from '#lib/content.js';
	let { meta, content: Content }: { meta: ContentEntry; content: Component } = $props();
</script>

<PageMeta
	title={`${meta.title} | Luca Lorenzini`}
	ogTitle={meta.title}
	description={meta.excerpt}
	path={meta.href}
	type="article"
	image={meta.type === 'album' ? meta.cover : undefined}
	imageWidth={meta.type === 'album' ? meta.coverWidth : undefined}
	imageHeight={meta.type === 'album' ? meta.coverHeight : undefined}
/>

<article class="prose flow-root max-w-none pt-6 sm:pt-7 dark:prose-invert">
	{#key meta.slug}
		<p>Last updated <time datetime={meta.timestamp}>{formatDate(meta.timestamp)}</time></p>
		{#if meta.type === 'album'}
			<h1>{meta.artist} / {meta.album}</h1>
		{/if}
		<Content />
		{#if meta.type === 'album'}
			<!-- Bandcamp caps its internal player at 700px. -->
			<div class="not-prose mt-6 mb-4 flex w-full max-w-[700px] flex-col">
				<AlbumPlayer provider={meta.player.provider} albumId={meta.player.albumId} title={meta.title} />
			</div>
		{/if}
	{/key}
</article>

<style>
	article :global(a) { overflow-wrap: anywhere; }
</style>
