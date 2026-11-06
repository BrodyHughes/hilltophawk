import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Results are cached by Next (see src/lib/content.ts) and expired by the
  // publish webhook, so read straight from the API: the CDN can lag behind a
  // publish by a few seconds, which would cache stale content.
  useCdn: false,
  perspective: "published",
});
