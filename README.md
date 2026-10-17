# My personal website

## Development

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
```

## Static port

The site uses Svelte 5, SvelteKit, Tailwind CSS, and mdsvex. Run `pnpm dev` to develop,
and `pnpm check` for type and accessibility checks.
`pnpm build` generates the complete static website in `build/`; `pnpm preview` serves it locally.

All published content lives in `src/content/*.md`. Every entry declares `title`,
`excerpt`, `timestamp`, and `published` in frontmatter.
Keep drafts in `src/content/drafts/`, which is excluded from public bundles. To
publish a draft, move it into `src/content/` and set `published: true`.

## Writing posts

For example, create `src/content/cooking-with-my-laptop.md`:

```markdown
---
title: Cooking with my laptop
excerpt: An experiment with cooking and computers.
timestamp: '2026-10-15'
published: true
---

# Cooking with my laptop

Write the post here.
```

Rebuild with `pnpm build`. This generates `/blog/cooking-with-my-laptop` and adds
it to the single chronological post list at `/blog`.

The loader in `src/lib/server/content.ts` discovers metadata at build time.
Frontmatter is stripped before Markdown compilation, keeping unused metadata
out of article chunks. `PageMeta.svelte` owns each page's description and social
preview tags so they are emitted once.
Content defaults to `type: article`; use `type: album` for the album player layout.

The theme toggle switches between the OS theme (`system`) and the opposite explicit
color. System mode follows `prefers-color-scheme` directly in CSS, including OS changes.
The document-head script applies saved overrides and glyph preferences before paint.

Code fences are highlighted at build time by calling Shiki directly from mdsvex's
highlighter hook in `vite.config.ts`. GitHub light and dark palettes follow the existing theme toggle.
Unknown or unlabelled languages render as plain text.

The post index reads frontmatter on the server during prerendering; article components
are imported on demand as separate chunks. Both HTML and navigation data are static.
Outfit is self-hosted using `@fontsource-variable/outfit`, including its Latin and Latin
Extended variable fonts. The Latin font is preloaded; `font-display: block` gives
it a short loading window before showing a fallback, avoiding the usual font swap.
Font loading no longer contacts Google Fonts. The logo and decorative glyphs use
inline SVG; the server layout generates and serializes glyph positions so they
render in the initial HTML and remain stable during hydration.
The font's redistribution license is included at `static/fonts/Outfit-OFL.txt`.

## Albums

The nine published Undiscover reviews live alongside other posts in `src/content/`,
with `type: album`. Their cover files remain in
`src/lib/assets/albums/<slug>/cover.jpeg`. Reviews render at `/blog/<slug>` and their
Markdown components load individually. The post index shows the listening
duration with one headphone emoji per complete ten minutes.

The post list uses `@sveltejs/enhanced-img` to generate AVIF, WebP, and JPEG
thumbnails at 80, 112, 160, and 224 pixels wide during the build. Responsive
sources match the 80px mobile and 112px desktop covers, including retina displays.
The first cover loads eagerly with high priority; remaining covers load lazily.
Keep originals at `src/lib/assets/albums/<slug>/cover.jpeg`; they also serve social previews
through Vite-generated asset URLs. The frontmatter `cover` field remains
`/albums/<slug>/cover.jpeg`, relative to `src/lib/assets`.
The first build processes the images; subsequent builds reuse the image cache.

Album frontmatter includes the common fields, plus `type: album`, `artist`, `album`, `label`, `releaseYear`, `duration`, `color`, `cover`,
`coverWidth`, `coverHeight`, and `player`. The latter contains a `provider`
(`bandcamp` or `spotify`) and an `albumId` string.

`ContentPage.svelte` uses the same prose typography and update date for articles
and album reviews. Album Markdown files contain only frontmatter and review text;
the page supplies the artist / album heading. The title is followed
by review text and the embedded player, capped at 700px wide. Artwork is shown
inside the Bandcamp or Spotify player; local covers remain available for social previews. Players use
official iframe embeds. They depend on
Bandcamp or Spotify availability; no CMS, API credentials, or backend is required.

`/blog` combines all published content in chronological order without tags or filters.
The homepage links to `/blog`.

The public routes are `/`, `/blog`, `/blog/<slug>`, and the static `/404` page.
Legacy post and category URLs return 404; no redirect routes are retained.
All pages are prerendered for static hosting.

`PageContainer.svelte` provides the shared page width, horizontal padding, and
layout spacing. Article and album pages share the same prose typography.

Missing pages use the custom rabbit error page. The build also generates
`404.html`; configure the static host to serve it with a 404 status for unknown URLs.
