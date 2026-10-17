<script lang="ts">
	import Logo from '#lib/components/Logo.svelte';
	import PageContainer from '#lib/components/PageContainer.svelte';
	import PageMeta from '#lib/components/PageMeta.svelte';
</script>
<PageMeta title="Luca Lorenzini" />
<PageContainer centered>
	<section class="leading-8">
		<p>Hi, my name is</p>
		<div class="mt-4 flex items-center gap-4">
			<Logo />
			<h1 class="text-3xl font-semibold">Luca Lorenzini</h1>
		</div>
		<p class="mt-4 [&_a]:link">Developer working full-time at <a href="https://wethod.com">wethod</a> and on many <a href="https://github.com/chielorenz">side projects</a>.</p>
		<p>DIY supporter and music enthusiast. My internet handler is <strong>@chielorenz</strong>.</p>
		<div class="mt-6">
			<a href="/blog" class="inline-flex h-9 items-center justify-center rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium whitespace-nowrap text-neutral-900 transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700">Read the blog</a>
		</div>
	</section>
</PageContainer>
