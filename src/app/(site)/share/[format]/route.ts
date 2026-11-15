import { renderSiteImage } from "@/lib/site-card";

// /share/feed  → 1080 × 1350 PNG for feed posts
// /share/story → 1080 × 1920 PNG for Stories
// Used by the site-wide "Share Hill Top Hawk" button.
export async function GET(_request: Request, { params }: RouteContext<"/share/[format]">) {
  const { format } = await params;
  if (format !== "feed" && format !== "story") return new Response("Not found", { status: 404 });
  return renderSiteImage(format, {
    "Content-Disposition": `inline; filename="hill-top-hawk-${format}.png"`,
    "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  });
}
