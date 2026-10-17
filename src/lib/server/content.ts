import { parse } from 'yaml';
import { splitFrontmatter } from './frontmatter.js';
import type { ContentEntry, ContentMetadata } from '#lib/content.js';

const sources = import.meta.glob<string>('/src/content/*.md', {
	eager: true, query: '?raw', import: 'default'
});

const coverUrls = import.meta.glob<string>('/src/lib/assets/albums/*/cover.jpeg', {
	eager: true, query: '?url', import: 'default'
});

function parseMetadata(source: string, filename: string): ContentMetadata {
	const frontmatter = splitFrontmatter(source);
	if (!frontmatter) throw new Error(`Missing frontmatter in ${filename}`);
	const value: unknown = parse(frontmatter.metadata);
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`Invalid frontmatter in ${filename}`);
	}
	const meta = value as Record<string, unknown>;
	function stringField(key: string) {
		const field = meta[key];
		if (typeof field !== 'string') throw new Error(`Invalid album ${key} in ${filename}`);
		return field;
	}
	function positiveIntegerField(key: string) {
		const field = meta[key];
		if (typeof field !== 'number' || !Number.isInteger(field) || field <= 0) {
			throw new Error(`Invalid album ${key} in ${filename}`);
		}
		return field;
	}
	const { title, excerpt, timestamp, published } = meta;
	if (typeof title !== 'string' || !title.trim() || typeof excerpt !== 'string' ||
		typeof timestamp !== 'string' || !Number.isFinite(Date.parse(timestamp)) ||
		typeof published !== 'boolean') {
		throw new Error(`Invalid content metadata in ${filename}`);
	}
	const type = meta.type ?? 'article';
	const base = { title, excerpt, timestamp, published };
	if (type === 'article') return { ...base, type };
	if (type !== 'album') throw new Error(`Unknown content type in ${filename}: ${type}`);
	if (!meta.player || typeof meta.player !== 'object' || Array.isArray(meta.player)) {
		throw new Error(`Invalid album player in ${filename}`);
	}
	const { provider, albumId } = meta.player as Record<string, unknown>;
	if ((provider !== 'bandcamp' && provider !== 'spotify') ||
		typeof albumId !== 'string' ||
		!(provider === 'bandcamp' ? /^\d+$/ : /^[a-zA-Z0-9]+$/).test(albumId)) {
		throw new Error(`Invalid album player in ${filename}`);
	}
	return {
		...base,
		type,
		artist: stringField('artist'),
		album: stringField('album'),
		label: stringField('label'),
		color: stringField('color'),
		cover: stringField('cover'),
		releaseYear: positiveIntegerField('releaseYear'),
		duration: positiveIntegerField('duration'),
		coverWidth: positiveIntegerField('coverWidth'),
		coverHeight: positiveIntegerField('coverHeight'),
		player: { provider, albumId }
	};
}

export const entries: ContentEntry[] = Object.entries(sources)
	.map(([path, source]) => {
		const metadata = parseMetadata(source, path);
		const slug = path.split('/').pop()!.replace(/\.md$/, '');
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid content filename: ${path}`);
		if (metadata.type === 'album') {
			const source = `/src/lib/assets${metadata.cover}`;
			if (source !== `/src/lib/assets/albums/${slug}/cover.jpeg` || !coverUrls[source]) {
				throw new Error(`Missing album cover at src/lib/assets/albums/${slug}/cover.jpeg`);
			}
			return { ...metadata, cover: coverUrls[source], slug, href: `/blog/${slug}` };
		}
		return { ...metadata, slug, href: `/blog/${slug}` };
	})
	.filter(entry => entry.published)
	.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

export function getEntry(slug: string) {
	return entries.find(entry => entry.slug === slug);
}
