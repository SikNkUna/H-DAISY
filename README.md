# A Little Gift for Daisy 🎀

A cozy, mobile-first interactive digital gift site with a pastel pink,
scrapbook-menu feel: a loading screen, a welcome page, an animated menu,
a typewriter letter, a set of appreciation cards, and a final celebration
with confetti.

## Files

```
index.html          → structure/markup for every screen
css/style.css        → all styling, colors, animations (design tokens at top)
js/script.js          → navigation, effects, music, confetti (CONFIG at top)
assets/images/        → optional custom images
assets/music/         → background music (mp3)
assets/icons/         → favicon / custom icons
```

## How to view it

Just open `index.html` in any modern browser (double-click it, or drag it
into a browser tab). No build step, server, or install required.

## How to customize

**Text & content** — open `js/script.js` and edit the `CONFIG` object at the
top: the letter, the list of reasons, and timing values. Recipient name and
other on-page copy can be edited directly in `index.html` (look for
`data-text-key` attributes to find them quickly).

**Colors** — open `css/style.css` and edit the CSS variables at the top of
the file (under `:root`), e.g. `--color-rose`, `--color-lavender`,
`--color-gold`. Every other rule in the file references these variables, so
changing them re-themes the whole site.

**Fonts** — swap the Google Fonts `<link>` in `index.html`'s `<head>` and
update `--font-display` / `--font-body` in `css/style.css` to match.

**Music** — add an mp3 file to `assets/music/` named `background-music.mp3`
(or update the `<source>` path in `index.html`).

**Images** — drop files into `assets/images/` and reference them with
`assets/images/your-file.jpg` wherever you'd like an `<img>` or background.

## Accessibility notes

- All interactive elements are real `<button>`s, keyboard-reachable and
  screen-reader labeled.
- Focus moves to each new screen's heading on navigation.
- Respects `prefers-reduced-motion`: floating hearts/sparkles, confetti, and
  most animations are disabled or shortened automatically for users who have
  that OS setting on.
- Color contrast was chosen to stay readable on the pastel background.
