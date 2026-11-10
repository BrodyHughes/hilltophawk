import type { NextRequest } from "next/server";
import { getShareArticle } from "@/lib/content";
import { renderShareImage } from "@/lib/share-card";
import { DEFAULT_POST_STYLE, isPostStyle } from "@/lib/share-styles";

// /articles/<slug>/share/feed  → 1080 × 1350 PNG for feed posts
//   ?style=classic | picture | lead | bleed  picks the layout (default classic)
// /articles/<slug>/share/story → 1080 × 1920 PNG for Stories
export async function GET(request: NextRequest, { params }: RouteContext<"/articles/[slug]/share/[format]">) {
  const { slug, format } = await params;
  if (format !== "feed" && format !== "story") return new Response("Not found", { status: 404 });

  const requested = request.nextUrl.searchParams.get("style");
  const style = isPostStyle(requested) ? requested : DEFAULT_POST_STYLE;

  const article = await getShareArticle(slug);
  if (!article) return new Response("Not found", { status: 404 });

  const name = format === "feed" && style !== DEFAULT_POST_STYLE ? `${format}-${style}` : format;
  return renderShareImage(article, format, {
    style,
    headers: {
      "Content-Disposition": `inline; filename="hth-${slug}-${name}.png"`,
      // Let Vercel's CDN keep a copy; a republished article refreshes within the hour.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
