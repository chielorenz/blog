<script lang="ts">
	import PageContainer from '#lib/components/PageContainer.svelte';
	import SectionHeader from '#lib/components/SectionHeader.svelte';
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
</script>

<PageContainer>
	<SectionHeader />
	<div class="mt-4">{@render children()}</div>
</PageContainer>
