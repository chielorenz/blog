import { parseMetadata } from './metadata.js';
import type { ContentEntry } from '#lib/content.js';

const sources = import.meta.glob<string>('/src/posts/*/index.md', {
	eager: true, query: '?raw', import: 'default'
});

const coverUrls = import.meta.glob<string>('/src/posts/*/cover.jpeg', {
	eager: true, query: '?url', import: 'default'
});

export const entries: ContentEntry[] = Object.entries(sources)
	.map(([path, source]) => {
		const metadata = parseMetadata(source, path);
		const slug = path.split('/').at(-2)!;
		if (!/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(slug)) throw new Error(`Invalid content filename: ${path}`);
		if (metadata.type === 'album') {
			const source = `/src/posts/${slug}/cover.jpeg`;
			if (metadata.cover !== './cover.jpeg' || !coverUrls[source]) {
				throw new Error(`Missing album cover at src/posts/${slug}/cover.jpeg (use cover: "./cover.jpeg")`);
			}
			metadata.cover = coverUrls[source];
		}
		return { ...metadata, slug, href: `/blog/${slug}` };
	})
	.filter(entry => entry.published)
	.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

export function getEntry(slug: string) {
	return entries.find(entry => entry.slug === slug);
}
