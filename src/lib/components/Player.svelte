<script lang="ts">
	import { getPlayerEmbed, type PlayerConfig } from '#lib/player.js';
	let { provider, id, title }: {
		title?: string;
	} & PlayerConfig = $props();
	const embed = $derived(getPlayerEmbed(provider, id));
</script>

<aside class="not-prose my-6 w-full max-w-[700px]" aria-label={title ?? `Play on ${embed.name}`}>
	<iframe
		src={embed.src}
		title={title ? `${title} — ${embed.name}` : `${embed.name} player`}
		width="100%"
		height={embed.height}
		class={['block w-full border-0', {
			'rounded-xl': provider === 'spotify',
			'aspect-video h-auto min-h-[200px]': provider === 'youtube'
		}]}
		loading="lazy"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen; picture-in-picture"
		allowfullscreen
	></iframe>
</aside>
