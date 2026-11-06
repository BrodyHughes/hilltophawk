# Hill Top Hawk

The Hill Top Hawk website. Next.js (App Router, TypeScript) with Sanity as the
CMS, hosted on Vercel. Articles are written in Sanity Studio at `/studio`.

The design source is the Claude Design export in `../handoff/design` (open the
`.dc.html` files in a browser to see the originals).

## Running it

Needs Node 22.12+ (`nvm use` picks up `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in SANITY_REVALIDATE_SECRET
npm run dev     # site: http://localhost:3000   editor: http://localhost:3000/studio
npm run build   # production build; run before pushing
npm run lint
```

## How it's organized

```
src/
  app/
    layout.tsx              fonts, dark-mode bootstrap (shared by site and studio)
    (site)/layout.tsx       header + footer on every site page
    (site)/page.tsx         home page (sections show/hide based on how much content exists)
    (site)/[collection]/    /sports, /culture, ... (template: design/Sports.dc.html)
    (site)/tag/[tag]/       /tag/mets, ... (same template)
    (site)/radio/           /radio (design/Radio.dc.html)
    (site)/articles/[slug]/ standard article page
    studio/                 Sanity Studio (the editor) at /studio
    api/revalidate/         webhook Sanity calls on publish
    globals.css             colors, fonts, shared classes (.eyebrow, .kicker, .hl, ...)
  components/               header, masthead animation, cards, radio dial, contact form
  lib/content.ts            ALL content lives behind the functions in this file
  lib/collections.ts        the fixed sections (Sports, Culture, ...) and their colors
  sanity/                   Sanity schemas, Studio sidebar, client
scripts/                    seed / remove the design's placeholder content
public/images/              images from the design export
```

### Content

Every page reads content through the query functions in `src/lib/content.ts`
(`getArticles`, `getArticle`, `getArticlesByCollection`, ...), which query
Sanity and cache the results. Publishing in the Studio triggers a webhook that
refreshes the site within seconds. Details in `docs/HANDOFF.md`.

### Design tokens

Colors live in `src/app/globals.css`. `--fg` / `--bg` are RGB triplets so they
work with alpha (`rgba(var(--fg), .5)`), and they flip when
`<html data-theme="dark">` is set. Collection accent colors are in
`COLLECTIONS` in `src/lib/collections.ts`.

### Home page "grow with content" rules

- Lead story: newest article (always)
- Right rail: next 3 articles + 1 larger card
- "Latest From The Hill": shown when there are 2+ articles for it
- "Also Atop The Hill": shown when there are 3+ remaining articles
- HTH Radio row: shown when there is 1+ episode
- Nav: only collections with 1+ item; tag rail: only tags with 1+ article

## Not done yet

See `docs/HANDOFF.md` for the go-live checklist and how to wire each of these up.

- Publish webhook in Sanity + Vercel env vars (needs the live URL)
- Draft preview
- Contact form submission (UI only)
- Radio playback (play button is visual only)
- Pagination / "Load more" and sort controls on collection pages
- Video content type, Shop
- Mobile layout is a best guess; the design export is desktop-only
