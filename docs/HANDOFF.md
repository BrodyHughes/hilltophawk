# Handoff: Hill Top Hawk

For the next developer or agent. Read `README.md` and `CLAUDE.md` first; this
covers what is finished, what is stubbed, and what's left to take the site live.

Background docs outside the repo (in the parent `hilltop/` folder):
- `hilltop.md`: the overall plan (Next.js + Vercel + Sanity + domain).
- `handoff/README.md`: the owner's original brief (content model, home page rules, effect blocks).
- `handoff/design/*.dc.html`: the design source. Open in a browser (needs `support.js` beside it).

---

## 1. Current state

| Area | Status |
|---|---|
| Home, collection (`/sports` …), tag (`/tag/[tag]`), radio, article (`/articles/[slug]`) pages | Done, match the design |
| Header: masthead typewriter animation, live clock, nav, draggable tag rail, dark mode, info / collections / search overlays | Done |
| Home "grow with content" rules (sections and nav items hide when empty) | Done, driven by data |
| CMS: Sanity project `2gccpec8`, dataset `production`, Studio embedded at `/studio` | Done |
| Content | Design placeholder stories seeded into Sanity (see §5 to remove) |
| Instant publishing (webhook → `/api/revalidate`) | Built and tested locally; **webhook not yet created in Sanity** (needs the live URL) |
| Draft preview before publishing | Not built (see §4) |
| Contact form | Works: type or draw; saved to Sanity as private `contactMessage` docs (`contact.<uuid>` IDs, sketch stored as a PNG data URL), listed under **Messages** in the Studio. Needs `SANITY_API_WRITE_TOKEN`. No email notification yet. |
| Radio playback | **UI only**; episodes have an `audioUrl` field ready |
| Search | Works, client-side, matches title + kicker only |
| Collection page "Sort" and pagination | Static label, no pagination |
| Video content type, Shop | Not built; nav hides them while empty |
| About text (info overlay) | Lorem ipsum, in `src/components/SiteHeader.tsx` |
| Favicon / OG image | None yet (`src/app/icon.png`, `src/app/opengraph-image.png` would be picked up automatically) |
| Mobile | Basic responsive rules; the design is desktop-only, needs a real-device pass |
| Hosting | Repo on GitHub (`BrodyHughes/hilltophawk`); Vercel + domain pending |

## 2. How content flows

```
Sanity Studio (/studio) ──publish──▶ Sanity dataset
                                         │
           webhook POST /api/revalidate ◀┘   (signed with SANITY_REVALIDATE_SECRET)
                     │
          revalidateTag("sanity", { expire: 0 })
                     │
src/lib/content.ts ──"use cache" + cacheTag("sanity") + cacheLife("hours")──▶ pages
```

- **Pages never talk to Sanity directly.** They call the functions in
  `src/lib/content.ts` (`getArticles`, `getArticle`, `getArticlesByCollection`,
  `getArticlesByTag`, `getEpisodes`, `getTags`, `getTag`, `getActiveCollections`,
  `getActiveTags`). Those map Sanity documents into the plain `Article` /
  `RadioEpisode` / `Tag` types the components use (image → URL + hotspot →
  CSS `object-position`).
- Every Sanity read goes through one cached helper, `fetchContent`, tagged
  `"sanity"`. Publishing anything expires everything; fine at this size.
- Without the webhook, content still refreshes within about an hour (`cacheLife("hours")`).
- The Sanity client uses `useCdn: false` and `perspective: "published"`: the
  CDN can lag a publish by seconds, which would get cached as stale.
- Collections are a fixed list in `src/lib/collections.ts` (shared with the
  Studio schema for the dropdown). Tags, articles and episodes live in Sanity.

### Sanity files

| File | What |
|---|---|
| `sanity.config.ts` | Studio config (mounted at `/studio`) |
| `src/sanity/schemaTypes/` | `article`, `episode`, `tag`, `blockContent` (rich text: headings, quotes, links, inline images, pull quotes) |
| `src/sanity/structure.ts` | Studio sidebar: Articles, Radio Episodes, Tags |
| `src/sanity/env.ts` | Project ID / dataset (public, with defaults) |
| `src/sanity/lib/client.ts`, `image.ts` | Client and image URL builder |
| `src/components/ArticleBody.tsx` | Renders the rich-text body |
| `src/app/api/revalidate/route.ts` | Webhook endpoint |
| `scripts/seed-placeholder-content.ts` | Loads / removes the design's placeholder content |

The site and Studio share the root layout (fonts, globals). The site's header
and footer live in `src/app/(site)/layout.tsx` so `/studio` doesn't get them.

## 3. Cache Components gotchas (Next 16.4)

`next.config.ts` has `cacheComponents: true`. Read `node_modules/next/dist/docs/`
before using any Next API from memory. Things that already bit this project:

1. **Uncached data outside `<Suspense>` fails the build.** Any new data
   function must go through `fetchContent` (or its own `"use cache"`).
2. **`generateStaticParams` must return at least one entry.** Use the
   `atLeastOne()` helper in `content.ts` (already applied to article and tag
   routes) so an empty dataset doesn't break the build.
3. **URL hooks in shared layouts must be inside `<Suspense>`.** `usePathname()`
   in the header caused 500s on dynamic routes once pages started re-rendering
   at runtime. Nav highlighting now lives in a Suspense-wrapped `NavLink`;
   the radio page's compact header uses `body:has([data-compact-header])` in
   CSS instead of reading the path. Keep URL reads in small leaf components.
4. No `dynamicParams`, `dynamic`, `revalidate` or `runtime` route exports;
   they're rejected. (The Sanity installer's generated studio page had
   `dynamic = 'force-static'`; it was removed.)
5. `revalidateTag` needs a second argument in Next 16. `{ expire: 0 }` is
   used so the owner sees his post on the very next refresh (the `"max"` profile
   would serve one stale copy first).
6. Unknown URLs return HTTP 200 with the not-found page on first render
   (streaming), and a proper 404 after. Expected.

## 4. Going live checklist

1. **Vercel:** import the GitHub repo. Set env vars from `.env.example`:
   `SANITY_REVALIDATE_SECRET` (new random value) and `NEXT_PUBLIC_SITE_URL`.
   Node version comes from `package.json` engines (≥22.12).
2. **Sanity CORS:** allow the live site to use the Studio with login:
   `npx sanity cors add https://<domain> --credentials` (and the
   `*.vercel.app` URL if editing there). `localhost:3000` is already allowed.
3. **Studio registration:** first visit to `/studio` on a new host shows
   "Connect this studio to your project"; choose **Register this studio**.
4. **Webhook:** sanity.io/manage → project → API → Webhooks → Create:
   - URL `https://<domain>/api/revalidate`, method POST
   - Trigger on Create, Update, Delete
   - Filter `_type in ["article", "episode", "tag"]`
   - Secret: same value as `SANITY_REVALIDATE_SECRET` in Vercel
   - Test: change an article title, refresh the live site.
5. **Invite the owner:** sanity.io/manage → project → Members → Invite, role
   **Administrator**.
6. **Swap placeholder content** for real stories (§5).

## 5. Placeholder content

The design's 16 sample stories, 6 radio episodes and 11 tags are in Sanity so
the site looks like the design. Remove them all at once (only those documents,
and only tags nothing else references):

```bash
npx sanity exec scripts/seed-placeholder-content.ts --with-user-token -- --delete
```

Re-add with the same command minus `-- --delete` (safe to re-run). Do this
after at least one real article exists, or the home page will be empty.

## 6. Other stubs

| Stub | Where | What to do |
|---|---|---|
| Draft preview | n/a | Sanity's Presentation tool + Next draft mode. Under Cache Components this needs the `resolvePerspectiveFromCookies` pattern from `next-sanity/live` (see its typings) so `draftMode()` is read outside `"use cache"`. Not needed for launch; the owner can check the Studio form before publishing. |
| Contact form | `src/components/ContactForm.tsx` | Server action that emails the owner (e.g. Resend; key in Vercel env). Draw mode: send `canvas.toDataURL()` as an attachment. Add a honeypot field. Need the destination email. |
| Radio playback | `src/components/RadioPlayer.tsx` | When episodes have `audioUrl`, drive an `<audio>` element from the play button (or an embed for a podcast host). Home radio cards link to `/radio`; consider `/radio?ep=N`. |
| Per-article layouts | `article.layout` field (only "standard" now) | Add a layout component, register it in the article page by `article.layout`, add the option to the schema's list. |
| Video | not modeled | Add a `video` type (title, date, collection, tags, embedUrl, thumbnail). Host on YouTube/Vimeo/Mux; don't serve video from Sanity file assets. Count videos in `getActiveCollections()` and add the home "Video row". |
| About text | `src/components/SiteHeader.tsx` | Replace lorem ipsum, or move to a Sanity singleton. |
| Search | `SearchOverlay` in `SiteHeader.tsx`, index built in `src/app/(site)/layout.tsx` | Add dek/tags to the index. Pagefind past a few hundred articles. |
| Sort / pagination | `src/components/CollectionTemplate.tsx` | "Sort: Newest" is a label. Add "Load more" past ~13 items. |
| Favicon / OG image | `src/app/` | Ask the owner for a simple mark; `hth-logo.png` is too detailed for 16px. |

## 7. Things that look like bugs but aren't

- The masthead shows "Hill Top Hawk" in static screenshots. The typewriter
  sequence starts 1.5s after load and repeats after 60s idle; it's skipped with
  `prefers-reduced-motion`. Every change is typed (no fades), and a zero-width
  space holds the line height while the text is empty so the page doesn't jump;
  don't remove it.
- The clock is blank in server HTML on purpose; it renders the visitor's local time on the client.
- `npm` prints `EBADENGINE` warnings on Node 20: the Sanity packages need Node
  ≥22.12. Use `nvm use` (reads `.nvmrc`, Node 24).
- A stray `~/package-lock.json` on Brody's machine confused Turbopack's root
  detection; `turbopack.root` in `next.config.ts` pins it. Harmless elsewhere.
