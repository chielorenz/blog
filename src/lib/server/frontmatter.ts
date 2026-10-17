export function splitFrontmatter(source: string) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	return match ? { metadata: match[1], body: source.slice(match[0].length) } : null;
}
