<script lang="ts">
	import { formatDate, type ContentEntry } from '#lib/content.js';
	import PageMeta from './PageMeta.svelte';
	import type { Picture } from '@sveltejs/enhanced-img';

	const covers = import.meta.glob<Picture>('/src/lib/assets/albums/*/cover.jpeg', {
		eager: true,
		import: 'default',
		query: { enhanced: true, w: '80;112;160;224' }
	});

	let { posts }: { posts: ContentEntry[] } = $props();
	const firstCoverIndex = $derived(posts.findIndex(post => post.type === 'album'));
</script>

<PageMeta title="Posts | Luca Lorenzini" path="/blog" />

<h1 class="sr-only">Posts</h1>
<div class="pb-12">
	{#each posts as post, index (post.href)}
		<article>
			<a href={post.href} class="flex items-start gap-5 py-6 sm:gap-7 sm:py-7">
				{#if post.type === 'album'}
					<enhanced:img
						src={covers[`/src/lib/assets/albums/${post.slug}/cover.jpeg`]}
						alt=""
						sizes="(min-width: 640px) 112px, 80px"
						loading={index === firstCoverIndex ? 'eager' : 'lazy'}
						fetchpriority={index === firstCoverIndex ? 'high' : 'auto'}
						class="aspect-square w-20 shrink-0 object-cover sm:w-28"
					/>
				{/if}
				<div class="min-w-0 flex-1">
					<p class="mb-2 text-xs leading-5 text-neutral-600 sm:text-sm dark:text-neutral-400">
						<time datetime={post.timestamp}>{formatDate(post.timestamp)}</time>
					</p>
					{#if post.type === 'album'}
						<h2 class="leading-tight">
							<span class="mb-1 block text-sm sm:text-base">{post.artist}</span>
							<span class="text-xl font-semibold tracking-tight sm:text-2xl">{post.album}</span>
						</h2>
						<p class="mt-3 flex flex-wrap items-center gap-x-2 text-xs leading-5 text-neutral-600 sm:text-sm dark:text-neutral-400">
							<span>{post.duration}-minute listen</span>
							<span class="whitespace-nowrap" aria-hidden="true">{'🎧 '.repeat(Math.floor(post.duration / 10)).trim()}</span>
						</p>
					{:else}
						<h2 class="text-xl leading-tight font-semibold tracking-tight sm:text-2xl">{post.title}</h2>
						<p class="mt-2 max-w-prose text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7 dark:text-neutral-400">{post.excerpt}</p>
					{/if}
				</div>
			</a>
		</article>
	{:else}
		<p class="py-6">No posts to show.</p>
	{/each}
</div>
