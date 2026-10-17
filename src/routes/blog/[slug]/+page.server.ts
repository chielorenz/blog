import { error } from '@sveltejs/kit';
import { entries as contentEntries, getEntry } from '#lib/server/content.js';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => contentEntries.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
 const meta = getEntry(params.slug);
 if (!meta) error(404, 'Post not found');
 return { meta };
};
