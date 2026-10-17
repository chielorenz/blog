export interface ArticleMetadata {
	title: string;
	excerpt: string;
	timestamp: string;
	published: boolean;
	type: 'article';
}

export interface AlbumMetadata extends Omit<ArticleMetadata, 'type'> {
	type: 'album';
	artist: string;
	album: string;
	label: string;
	releaseYear: number;
	duration: number;
	color: string;
	cover: string;
	coverWidth: number;
	coverHeight: number;
	player: { provider: 'bandcamp' | 'spotify'; albumId: string };
}

export type ContentMetadata = ArticleMetadata | AlbumMetadata;
export type ContentEntry = ContentMetadata & { slug: string; href: string };

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
});

export function formatDate(timestamp: string) {
	return dateFormatter.format(new Date(timestamp));
}
