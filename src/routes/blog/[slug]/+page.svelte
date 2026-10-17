<script lang="ts">
 import ContentPage from '#lib/components/ContentPage.svelte';
 import type { PageProps } from './$types';
 let { data }: PageProps = $props();
</script>

<ContentPage meta={data.meta} content={data.content} />
