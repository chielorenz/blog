import { createContext } from 'svelte';

export type Mode = 'light' | 'dark' | 'system';

export function isDark(mode: Mode, systemDark: boolean) {
	return mode === 'dark' || (mode === 'system' && systemDark);
}

// Selecting the system's color resumes automatic mode, so there are only two options.
export function nextMode(currentDark: boolean, systemDark: boolean): Mode {
	const nextDark = !currentDark;
	return nextDark === systemDark ? 'system' : nextDark ? 'dark' : 'light';
}
export interface Theme {
	readonly glyphs: boolean;
	toggleMode: () => void;
	toggleGlyphs: () => void;
}

export const [getTheme, setTheme] = createContext<Theme>();
