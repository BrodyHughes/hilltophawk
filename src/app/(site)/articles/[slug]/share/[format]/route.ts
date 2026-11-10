import { getShareArticle } from "@/lib/content";
import { renderShareImage } from "@/lib/share-card";

// /articles/<slug>/share/feed  → 1080 × 1350 PNG for feed posts
// /articles/<slug>/share/story → 1080 × 1920 PNG for Stories
export async function GET(_request: Request, { params }: RouteContext<"/articles/[slug]/share/[format]">) {
  const { slug, format } = await params;
  if (format !== "feed" && format !== "story") return new Response("Not found", { status: 404 });

  const article = await getShareArticle(slug);
  if (!article) return new Response("Not found", { status: 404 });

  return renderShareImage(article, format, {
    "Content-Disposition": `inline; filename="hth-${slug}-${format}.png"`,
    // Let Vercel's CDN keep a copy; a republished article refreshes within the hour.
    "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  });
}
