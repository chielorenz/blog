<script lang="ts">
	import type { Component } from 'svelte';
	import Player from './Player.svelte';
	import PageMeta from './PageMeta.svelte';
	import { formatDate, type ContentEntry } from '#lib/content.js';
	let { meta, content: Content }: { meta: ContentEntry; content: Component } = $props();
</script>

<PageMeta
	title={`${meta.title} | Luca Lorenzini`}
	ogTitle={meta.title}
	description={meta.type === 'article' ? meta.excerpt : undefined}
	path={meta.href}
	type="article"
	image={meta.type === 'album' ? meta.cover : undefined}
/>

<article class="prose flow-root max-w-none pt-6 sm:pt-7 dark:prose-invert">
	{#key meta.slug}
		<p>Posted on <time datetime={meta.timestamp}>{formatDate(meta.timestamp)}</time></p>
		{#if meta.type === 'album'}
			<h1>{meta.title}</h1>
			<Player {...meta.player} title={meta.title} />
		{/if}
		<Content />
	{/key}
</article>

<style>
	article :global(a) { overflow-wrap: anywhere; }
</style>
