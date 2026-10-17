<script lang="ts">
 import ErrorPage from '#lib/components/ErrorPage.svelte';
 import type { ErrorProps } from './$types';
 let { error }: ErrorProps = $props();
</script>

<ErrorPage status={error.status} />
