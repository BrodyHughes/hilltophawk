import { getShareArticle } from "@/lib/content";
import { renderShareImage, SHARE_SIZES } from "@/lib/share-card";

// The card that shows up when an article link is pasted into iMessage, X,
// Facebook, Slack, LinkedIn and so on. Same look as the share images.
export const alt = "Hill Top Hawk story card";
export const size = SHARE_SIZES.og;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getShareArticle(slug);
  if (!article) return new Response("Not found", { status: 404 });
  return renderShareImage(article, "og");
}
