<script lang="ts">
	import Logo from './Logo.svelte';
	import ThemeControls from './ThemeControls.svelte';
</script>

<nav class="flex items-center justify-between gap-4" aria-label="Main navigation">
	<a href="/" aria-label="Home"><Logo /></a>
	<ThemeControls />
</nav>
