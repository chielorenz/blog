<script lang="ts">
	let { glyphs }: {
		glyphs: { id: number; source: { name: string; width: number }; style: string }[];
	} = $props();
</script>
<div aria-hidden="true">
	<svg width="0" height="0" class="absolute">
		<defs>
			<symbol id="background-glyph-square" viewBox="0 0 17 16">
				<rect x="0.5" width="16" height="16" rx="2" fill="#808080"/>
			</symbol>
			<symbol id="background-glyph-square-outline" viewBox="0 0 17 16">
				<mask id="background-square-mask" fill="white">
					<rect x="0.5" width="16" height="16" rx="2"/>
				</mask>
				<rect x="0.5" width="16" height="16" rx="2" stroke="#808080" stroke-width="6" mask="url(#background-square-mask)"/>
			</symbol>
			<symbol id="background-glyph-cross" viewBox="0 0 17 16">
				<rect width="4.52548" height="18.1019" rx="2" transform="matrix(0.707106 0.707107 -0.707106 0.707107 13.3 1.52588e-05)" fill="#808080"/>
				<rect width="4.52548" height="18.1019" rx="2" transform="matrix(0.707106 -0.707107 0.707106 0.707107 0.5 3.2)" fill="#808080"/>
			</symbol>
			<symbol id="background-glyph-bar" viewBox="0 0 15 16">
				<rect width="4.52548" height="18.1019" rx="2" transform="matrix(0.707106 0.707107 -0.707106 0.707107 12.3 0)" fill="#808080"/>
			</symbol>
			<symbol id="background-glyph-triangle" viewBox="0 0 19 16">
				<path d="M7.76795 1C8.53775 -0.333333 10.4623 -0.333333 11.2321 1L18.1603 13C18.9301 14.3333 17.9678 16 16.4282 16H2.5718C1.0322 16 0.069946 14.3333 0.839746 13L7.76795 1Z" fill="#808080"/>
			</symbol>
			<symbol id="background-glyph-circle-outline" viewBox="0 0 17 16">
				<circle cx="8.5" cy="8" r="6.5" stroke="#808080" stroke-width="3"/>
			</symbol>
			<symbol id="background-glyph-circle" viewBox="0 0 17 16">
				<circle cx="8.5" cy="8" r="7.5" fill="#808080" stroke="#808080"/>
			</symbol>
			<symbol id="background-glyph-triangle-outline" viewBox="0 0 19 16">
				<path d="M9.93301 1.75L16.8612 13.75C17.0537 14.0833 16.8131 14.5 16.4282 14.5H2.5718C2.1869 14.5 1.94633 14.0833 2.13878 13.75L9.06699 1.75C9.25944 1.41667 9.74056 1.41667 9.93301 1.75Z" stroke="#808080" stroke-width="3"/>
			</symbol>
		</defs>
	</svg>
	{#each glyphs as glyph (glyph.id)}
		<svg width="16" height="16" viewBox="0 0 {glyph.source.width} 16" fill="none" style={glyph.style} class="glyph invisible glyphs:visible">
			<use href="#background-glyph-{glyph.source.name}" />
		</svg>
	{/each}
</div>
