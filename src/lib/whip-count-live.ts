import { cacheLife } from "next/cache";
import { beforeVote } from "./whip-count";

/**
 * Server-side "is the vote still ahead?" check. Cached for about an hour so
 * pages that use it stay prerendered; the home page module also hides itself
 * in the browser the moment the deadline passes (see UntilVote).
 */
export async function whipCountIsLive() {
  "use cache";
  cacheLife("hours");
  return beforeVote(Date.now());
}
