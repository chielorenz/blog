<script lang="ts">
	import PostIndex from '#lib/components/PostIndex.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<PostIndex {...data} />
