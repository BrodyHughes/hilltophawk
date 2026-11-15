import { renderWhipCountImage } from "@/lib/whip-count-card";

// /whip-count/share/feed  → 1080 × 1350 PNG for feed posts
// /whip-count/share/story → 1080 × 1920 PNG for Stories
export async function GET(_request: Request, { params }: RouteContext<"/whip-count/share/[format]">) {
  const { format } = await params;
  if (format !== "feed" && format !== "story") return new Response("Not found", { status: 404 });
  return renderWhipCountImage(format, {
    "Content-Disposition": `inline; filename="hth-whip-count-${format}.png"`,
    // Short CDN copy: the count changes with each deploy anyway.
    "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
  });
}
