export type PlayerProvider = 'bandcamp' | 'spotify' | 'youtube';

export interface PlayerConfig {
	provider: PlayerProvider;
	id: string;
}

export function isPlayerProvider(value: unknown): value is PlayerProvider {
	return value === 'bandcamp' || value === 'spotify' || value === 'youtube';
}

export function isPlayerId(provider: PlayerProvider, id: unknown): id is string {
	if (typeof id !== 'string') return false;
	const pattern = provider === 'bandcamp' ? /^\d+$/
		: provider === 'youtube' ? /^[a-zA-Z0-9_-]{11}$/ : /^[a-zA-Z0-9]+$/;
	return pattern.test(id);
}

export function getPlayerEmbed(provider: PlayerProvider, id: string) {
	if (!isPlayerProvider(provider) || !isPlayerId(provider, id)) {
		throw new Error(`Invalid player: provider="${provider}" id="${id}"`);
	}
	switch (provider) {
		case 'bandcamp': return {
			name: 'Bandcamp', height: 120,
			src: `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`
		};
		case 'spotify': return {
			name: 'Spotify', height: 152,
			src: `https://open.spotify.com/embed/album/${id}?utm_source=generator`
		};
		case 'youtube': return {
			name: 'YouTube', height: 394,
			src: `https://www.youtube.com/embed/${id}`
		};
	}
}
