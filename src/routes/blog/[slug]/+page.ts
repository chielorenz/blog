import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

// Drafts stay outside this glob; published articles load as individual chunks.
const modules = import.meta.glob<{ default: Component }>('/src/posts/*/index.md');

export const load: PageLoad = async ({ data }) => {
	const post = await modules[`/src/posts/${data.meta.slug}/index.md`]?.();
	if (!post) error(404, 'Post not found');
	return { ...data, content: post.default };
};
