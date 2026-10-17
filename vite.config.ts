import { mdsvex, escapeSvelte } from 'mdsvex';
import { bundledLanguages, codeToHtml } from 'shiki';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { splitFrontmatter } from './src/lib/server/frontmatter.js';

async function highlightCode(code: string, language?: string | null) {
	const lang = language && Object.hasOwn(bundledLanguages, language) ? language : 'text';
	const html = await codeToHtml(code, {
		lang,
		themes: { light: 'github-light', dark: 'github-dark-dimmed' },
		defaultColor: false
	});
	return escapeSvelte(html);
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			preprocess: [{
				markup: ({ content, filename }) => {
					if (!filename || !/\.(md|svx)$/.test(filename)) return;
					// Metadata is loaded on the server; Markdown chunks only need the body.
					return { code: splitFrontmatter(content)?.body ?? content };
				}
			}, mdsvex({
				extensions: ['.svx', '.md'],
				highlight: { highlighter: highlightCode }
			})],
			extensions: ['.svelte', '.svx', '.md']
		})
	]
});
