# Hill Top Hawk

The Hill Top Hawk website. Next.js (App Router, TypeScript), hosted on Vercel.

The design source is the Claude Design export in `../handoff/design` (open the
`.dc.html` files in a browser to see the originals).

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build; run before pushing
npm run lint
```

## How it's organized

```
src/
  app/
    layout.tsx              fonts, dark-mode bootstrap, header + footer on every page
    page.tsx                home page (sections show/hide based on how much content exists)
    [collection]/page.tsx   /sports, /culture, ... (template: design/Sports.dc.html)
    tag/[tag]/page.tsx      /tag/mets, ... (same template)
    radio/page.tsx          /radio (design/Radio.dc.html)
    articles/[slug]/        standard article page
    globals.css             colors, fonts, shared classes (.eyebrow, .kicker, .hl, ...)
  components/               header, masthead animation, cards, radio dial, contact form
  lib/content.ts            ALL content lives behind the functions in this file
public/images/              images from the design export
```

### Content

Every page reads content through the query functions in `src/lib/content.ts`
(`getArticles`, `getArticle`, `getArticlesByCollection`, ...). Right now they
return the placeholder stories from the design. When the CMS is wired up, only
that file changes; pages and components stay the same.

### Design tokens

Colors live in `src/app/globals.css`. `--fg` / `--bg` are RGB triplets so they
work with alpha (`rgba(var(--fg), .5)`), and they flip when
`<html data-theme="dark">` is set. Collection accent colors are in
`COLLECTIONS` in `src/lib/content.ts`.

### Home page "grow with content" rules

- Lead story: newest article (always)
- Right rail: next 3 articles + 1 larger card
- "Latest From The Hill": shown when there are 2+ articles for it
- "Also Atop The Hill": shown when there are 3+ remaining articles
- HTH Radio row: shown when there is 1+ episode
- Nav: only collections with 1+ item; tag rail: only tags with 1+ article

## Not done yet

- CMS (Sanity or markdown; see `../hilltop.md`) and publish webhook
- Contact form submission (UI only)
- Radio playback (play button is visual only)
- Pagination / "Load more" and sort controls on collection pages
- Video content type, Shop
- Mobile layout is a best guess; the design export is desktop-only
