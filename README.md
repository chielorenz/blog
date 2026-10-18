# My personal website

## Development

```sh
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm preview
```

## Writing posts

For example, create `src/posts/cooking-with-my-laptop/index.md`:

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

Place media alongside `index.md` and import it using a relative path. For example,
with `photo.png` in the same folder, add this after the frontmatter:

```svelte
<script>
  import photo from './photo.png';
</script>

<img src={photo} alt="My laptop cooking experiment" />
```

Vite copies imported media into the build and generates their public URLs.
Use the same relative imports for audio, video, or downloadable files.

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

Album reviews live alongside other posts in `src/posts/<slug>/index.md`,
with `type: album`. Their cover files live alongside the Markdown at
`src/posts/<slug>/cover.jpeg`. Reviews render at `/blog/<slug>` and their
Markdown components load individually. The post index shows the listening
duration with one headphone emoji per complete ten minutes.

The post list uses `@sveltejs/enhanced-img` to generate AVIF, WebP, and JPEG
thumbnails at 80, 112, 160, and 224 pixels wide during the build. Responsive
sources match the 80px mobile and 112px desktop covers, including retina displays.
The first cover loads eagerly with high priority; remaining covers load lazily.
Keep originals at `src/posts/<slug>/cover.jpeg`; they also serve social previews
through Vite-generated asset URLs. Set the frontmatter `cover` field to
`./cover.jpeg`, relative to the post's `index.md`.
The first build processes the images; subsequent builds reuse the image cache.

Album frontmatter includes `type: album`, `artist`, `album`, `timestamp` (date only),
`published`, `duration`, `cover`, and `player`. The title is generated as
`artist / album`; albums do not need `title` or `excerpt`. The player contains a `provider`
(`bandcamp`, `spotify`, or `youtube`) and an `id` string. `player` is required
for every album and renders below the heading, before the review. For YouTube, `id` holds
the video ID.

```yaml
player: { provider: spotify, id: "2V23C4HrEmedy2uevqwIiN" }
```

Frontmatter and inline players share the same `provider` and `id` fields.

For an album available only on YouTube, use the video's ID from its URL:

```yaml
player: { provider: youtube, id: "r8qOELxiXd0" }
```

Add extra players anywhere in an article or album's Markdown body, without imports:

```html
<player provider="youtube" id="r8qOELxiXd0" title="Generic animal" />

<player provider="spotify" id="2V23C4HrEmedy2uevqwIiN" />

<player provider="bandcamp" id="3440541770" />
```

Use a YouTube video ID, Spotify album ID, or numeric Bandcamp album ID. `title` is
optional and labels the iframe for screen readers. Put each player on its own
line, separated from surrounding Markdown by blank lines. YouTube players keep
a responsive 16:9 aspect ratio. All players are capped at 700px wide.

`ContentPage.svelte` uses the same prose typography and update date for articles
and album reviews. Album Markdown files contain frontmatter, review text, and optional inline players;
the page supplies the artist / album heading. The title is followed
by the embedded player, capped at 700px wide, and then the review text. Artwork is shown
inside the Bandcamp or Spotify player; local covers remain available for social previews. Players use
official iframe embeds. They depend on
Bandcamp, Spotify, or YouTube availability; no CMS, API credentials, or backend is required.

`/blog` combines all published content in chronological order without tags or filters.
The homepage links to `/blog`.

The public routes are `/`, `/blog`, `/blog/<slug>`, and the static `/404` page.
Legacy post and category URLs return 404; no redirect routes are retained.
All pages are prerendered for static hosting.

`PageContainer.svelte` provides the shared page width, horizontal padding, and
layout spacing. Article and album pages share the same prose typography.

Missing pages use the custom rabbit error page. The build also generates
`404.html`; configure the static host to serve it with a 404 status for unknown URLs.
