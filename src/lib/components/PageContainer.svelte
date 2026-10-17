<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children, centered = false }: { children: Snippet; centered?: boolean } = $props();
</script>

<main class={[
	'mx-auto w-full max-w-screen-md px-8',
	centered ? 'flex min-h-svh items-center justify-center py-8' : 'my-8 flex flex-col gap-4'
]}>
	{@render children()}
</main>
