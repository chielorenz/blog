import { parse } from 'yaml';
import { splitFrontmatter } from './frontmatter.js';
import type { ContentMetadata } from '../content.js';
import { isPlayerProvider, isPlayerId } from '../player.js';

export function parseMetadata(source: string, filename: string): ContentMetadata {
	const frontmatter = splitFrontmatter(source);
	if (!frontmatter) throw new Error(`Missing frontmatter in ${filename}`);
	const value: unknown = parse(frontmatter.metadata);
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`Invalid frontmatter in ${filename}`);
	}
	const meta = value as Record<string, unknown>;
	function stringField(key: string) {
		const field = meta[key];
		if (typeof field !== 'string' || !field.trim()) throw new Error(`Invalid ${key} in ${filename}`);
		return field;
	}
	function positiveIntegerField(key: string) {
		const field = meta[key];
		if (typeof field !== 'number' || !Number.isInteger(field) || field <= 0) {
			throw new Error(`Invalid ${key} in ${filename}`);
		}
		return field;
	}
	const { timestamp, published } = meta;
	if (typeof timestamp !== 'string' || !Number.isFinite(Date.parse(timestamp)) ||
		typeof published !== 'boolean') {
		throw new Error(`Invalid content metadata in ${filename}`);
	}
	const type = meta.type ?? 'article';
	const base = { timestamp, published };
	if (type === 'article') {
		const title = stringField('title');
		const { excerpt } = meta;
		if (typeof excerpt !== 'string') {
			throw new Error(`Invalid excerpt in ${filename}`);
		}
		return { ...base, type, title, excerpt };
	}
	if (type !== 'album') throw new Error(`Unknown content type in ${filename}: ${type}`);
	if (!meta.player || typeof meta.player !== 'object' || Array.isArray(meta.player)) {
		throw new Error(`Invalid album player in ${filename}`);
	}
	const { provider, id } = meta.player as Record<string, unknown>;
	if (!isPlayerProvider(provider) || !isPlayerId(provider, id)) {
		throw new Error(`Invalid album player in ${filename}`);
	}
	const artist = stringField('artist');
	const album = stringField('album');
	return {
		...base,
		type,
		title: `${artist} / ${album}`,
		artist,
		album,
		cover: stringField('cover'),
		duration: positiveIntegerField('duration'),
		player: { provider, id }
	};
}

