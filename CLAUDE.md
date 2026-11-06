@AGENTS.md

# Hill Top Hawk

See README.md for layout and conventions. Key rules:

- Pages never import content data directly; they call the query functions in `src/lib/content.ts`.
- Match the design in `../handoff/design/*.dc.html` (fonts, colors, spacing). Styles use CSS Modules plus the shared classes in `src/app/globals.css`.
- Cache Components is on (`next.config.ts`). Dynamic routes read `params` inside a `<Suspense>` boundary and use `generateStaticParams`. Don't add `dynamicParams` or `runtime` exports; they're incompatible.
- Respect `prefers-reduced-motion` for any new animation.
- Run `npm run lint && npm run build` before calling a change done.
