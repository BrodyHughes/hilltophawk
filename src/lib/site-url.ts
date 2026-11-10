// The site's public address, for absolute URLs (social previews, share links).
// Uses NEXT_PUBLIC_SITE_URL when it's set; on Vercel it falls back to the
// project's production domain, which Vercel provides automatically.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);
