/**
 * Sanity Studio, the editor for articles, radio episodes and tags, mounted at
 * /studio. All routes under /studio are handled by this catch-all page.
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// The generated file exported `dynamic = 'force-static'` here; route segment
// configs aren't allowed with Cache Components, and the page is static anyway.

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
