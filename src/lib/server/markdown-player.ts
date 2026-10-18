import { parse, type AST, type PreprocessorGroup } from 'svelte/compiler';

// Run after mdsvex so the Svelte parser distinguishes tags from examples, comments and strings.
export const markdownPlayer: PreprocessorGroup = {
	name: 'markdown-player',
	markup: ({ content, filename }) => {
		if (!filename || !/\.(md|svx)$/.test(filename) || !content.includes('<player')) return;
		const ast = parse(content, { modern: true });
		let componentName = 'MarkdownPlayer';
		while (content.includes(componentName)) componentName += '_';
		const edits: { start: number; end: number; text: string }[] = [];
		function visit(value: unknown) {
			if (!value || typeof value !== 'object') return;
			if (Array.isArray(value)) return value.forEach(visit);
			if ('type' in value && value.type === 'RegularElement') {
				const node = value as AST.RegularElement;
				if (node.name === 'player') {
					edits.push({ start: node.start + 1, end: node.start + 7, text: componentName });
					const closing = content.slice(node.start, node.end).match(/<\/player\s*>$/);
					if (closing) {
						const start = node.end - closing[0].length + 2;
						edits.push({ start, end: start + 6, text: componentName });
					}
				}
			}
			Object.values(value).forEach(visit);
		}
		visit(ast.fragment);
		if (!edits.length) return;
		const importCode = `\nimport ${componentName} from '#lib/components/Player.svelte';\n`;
		const script = ast.instance;
		const start = script ? content.indexOf('>', script.attributes.at(-1)?.end ?? script.start) + 1 : 0;
		edits.push({ start, end: start, text: ast.instance ? importCode : `<script>${importCode}</script>\n` });
		let code = content;
		for (const edit of edits.sort((a, b) => b.start - a.start)) {
			code = code.slice(0, edit.start) + edit.text + code.slice(edit.end);
		}
		return { code };
	}
};
