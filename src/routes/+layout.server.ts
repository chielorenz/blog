import type { LayoutServerLoad } from './$types';

const sources = [
	{ name: 'square', width: 17 },
	{ name: 'square-outline', width: 17 },
	{ name: 'cross', width: 17 },
	{ name: 'bar', width: 15 },
	{ name: 'triangle', width: 19 },
	{ name: 'circle-outline', width: 17 },
	{ name: 'circle', width: 17 },
	{ name: 'triangle-outline', width: 19 }
];
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export const load: LayoutServerLoad = () => ({
	glyphs: Array.from({ length: random(10, 20) }, (_, id) => ({
		id, source: sources[random(0, sources.length)],
		style: `left:${random(0, 100)}vw;top:${random(0, 100)}vh;--glyph-x:${random(-50, 50)}vw;--glyph-y:${random(-50, 50)}vh;--glyph-duration:${random(60, 90)}s`
	}))
});
