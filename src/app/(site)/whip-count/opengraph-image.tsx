import { SHARE_SIZES } from "@/lib/share-card";
import { renderWhipCountImage } from "@/lib/whip-count-card";

// Link preview for /whip-count (iMessage, X, Facebook, Slack...).
export const alt = "Schumer vs. Van Hollen whip count";
export const size = SHARE_SIZES.og;
export const contentType = "image/png";

export default function Image() {
  return renderWhipCountImage("og");
}
