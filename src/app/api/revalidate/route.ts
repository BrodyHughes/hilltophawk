import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_CACHE_TAG } from "@/lib/content";

/**
 * Called by a Sanity webhook whenever an article, episode or tag is published,
 * changed or deleted. Expires all cached content so the next visit is fresh.
 * Set up in sanity.io/manage → API → Webhooks; see docs/HANDOFF.md.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });
  }

  const { isValidSignature } = await parseBody(req, secret);
  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }

  // expire: 0 so the very next request gets fresh content instead of the
  // stale-while-revalidate copy; the owner expects to see his post on refresh.
  revalidateTag(CONTENT_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: CONTENT_CACHE_TAG, at: Date.now() });
}
