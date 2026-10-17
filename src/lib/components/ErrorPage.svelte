<script lang="ts">
	import PageContainer from './PageContainer.svelte';
	import Rabbit from './Rabbit.svelte';
	let { status = 404 }: { status?: number } = $props();
	const title = $derived(status === 404 ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
	<title>{title} | Luca Lorenzini</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageContainer centered>
	<section class="text-center">
		<Rabbit />
		<h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
		<a href="/" class="link mt-6 inline-block">Back home</a>
	</section>
</PageContainer>
