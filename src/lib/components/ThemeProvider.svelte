<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { setTheme, isDark, nextMode, type Mode } from '#lib/theme.js';
	let { children }: { children: Snippet } = $props();
	let mode: Mode = 'system';
	let glyphs = $state(true);
	let media: MediaQueryList;
	function apply() {
		const root = document.documentElement;
		root.dataset.themeMode = mode;
		root.classList.toggle('glyphs', glyphs);
		root.classList.toggle('no-glyphs', !glyphs);
	}
	function readPreferences() {
		try {
			const saved = localStorage.getItem('theme-mode');
			mode = saved === 'light' || saved === 'dark' ? saved : 'system';
			glyphs = localStorage.getItem('theme-glyphs') !== 'false';
		} catch {}
		apply();
	}
	function toggleMode() {
		mode = nextMode(isDark(mode, media.matches), media.matches);
		try { localStorage.setItem('theme-mode', mode); } catch {}
		apply();
	}
	function toggleGlyphs() {
		glyphs = !glyphs;
		try { localStorage.setItem('theme-glyphs', String(glyphs)); } catch {}
		apply();
	}
	onMount(() => {
		media = window.matchMedia('(prefers-color-scheme: dark)');
		// CSS follows the OS in system mode; JavaScript only manages explicit preferences.
		const root = document.documentElement;
		const initialMode = root.dataset.themeMode;
		mode = initialMode === 'light' || initialMode === 'dark' ? initialMode : 'system';
		glyphs = root.classList.contains('glyphs');
		window.addEventListener('storage', readPreferences);
		return () => {
			window.removeEventListener('storage', readPreferences);
		};
	});

	setTheme({ get glyphs() { return glyphs; }, toggleMode, toggleGlyphs });
</script>
{@render children()}
