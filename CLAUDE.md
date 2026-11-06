@AGENTS.md

# Hill Top Hawk

See README.md for layout and conventions, and docs/HANDOFF.md for what is stubbed and how to connect it. Key rules:

- Pages never query Sanity directly; they call the functions in `src/lib/content.ts`. New Sanity reads go through its cached `fetchContent` helper.
- Match the design in `../handoff/design/*.dc.html` (fonts, colors, spacing). Styles use CSS Modules plus the shared classes in `src/app/globals.css`.
- Cache Components is on (`next.config.ts`). Dynamic routes read `params` inside a `<Suspense>` boundary and use `generateStaticParams` (wrapped in `atLeastOne`). Client components that call `usePathname()` in shared layouts must be inside `<Suspense>`. Don't add `dynamicParams`, `dynamic` or `runtime` exports. See docs/HANDOFF.md §3.
- Sanity schemas live in `src/sanity/schemaTypes/`. Editor-facing field titles and descriptions should be plain English; the owner isn't technical.
- Use Node 22.12+ (`nvm use`).
- Respect `prefers-reduced-motion` for any new animation.
- Run `npm run lint && npm run build` before calling a change done.
