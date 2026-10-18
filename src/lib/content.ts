import type { PlayerConfig } from './player.js';

interface BaseMetadata {
	title: string;
	timestamp: string;
	published: boolean;
}

export interface ArticleMetadata extends BaseMetadata {
	type: 'article';
	excerpt: string;
}

export interface AlbumMetadata extends BaseMetadata {
	type: 'album';
	artist: string;
	album: string;
	duration: number;
	cover: string;
	player: PlayerConfig;
}

export type ContentMetadata = ArticleMetadata | AlbumMetadata;
export type ContentEntry = ContentMetadata & { slug: string; href: string };

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
});

export function formatDate(timestamp: string) {
	return dateFormatter.format(new Date(timestamp));
}
