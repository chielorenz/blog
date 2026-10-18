<script lang="ts">
	import { getTheme } from '#lib/theme.js';
	const theme = getTheme();
</script>
<div class="flex items-center gap-4">
 <button type="button" onclick={theme.toggleMode} aria-label="Toggle light/dark mode" title="Toggle light/dark mode">
  <img src="/images/sun.svg" alt="" width="16" height="16" class="dark:hidden" />
  <img src="/images/moon.svg" alt="" width="16" height="16" class="hidden dark:block" />
 </button>
 <button type="button" onclick={theme.toggleGlyphs} aria-label="Toggle glyphs" aria-pressed={theme.glyphs} title="Toggle glyphs">
  <img src="/images/glyphs-toggle.svg" alt="" width="16" height="16" class="hidden glyphs:light:block" />
  <img src="/images/glyphs-toggle-inverted.svg" alt="" width="16" height="16" class="hidden glyphs:dark:block" />
  <img src="/images/glyphs-toggle-disabled.svg" alt="" width="16" height="16" class="hidden no-glyphs:block" />
 </button>
</div>
