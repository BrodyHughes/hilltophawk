import { SHARE_SIZES } from "@/lib/share-card";
import { renderSiteImage } from "@/lib/site-card";

// Link preview for the home page (and any page without its own).
export const alt = "Hill Top Hawk";
export const size = SHARE_SIZES.og;
export const contentType = "image/png";

export default function Image() {
  return renderSiteImage("og");
}
