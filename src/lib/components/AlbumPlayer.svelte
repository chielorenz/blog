<script lang="ts">
	import type { AlbumMetadata } from '#lib/content.js';
	let { provider, albumId, title }: {
		title: string;
	} & AlbumMetadata['player'] = $props();
	const src = $derived(provider === 'bandcamp'
		? `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`
		: `https://open.spotify.com/embed/album/${albumId}?utm_source=generator`);
</script>

<aside class="not-prose w-full" aria-label="Listen to the album">
	<iframe
		{src}
		title={`${title} — ${provider === 'bandcamp' ? 'Bandcamp' : 'Spotify'}`}
		width="100%"
		height={provider === 'bandcamp' ? 120 : 152}
		class={['block w-full border-0', { 'rounded-xl': provider === 'spotify' }]}
		loading="lazy"
		allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
		allowfullscreen
	></iframe>
</aside>
