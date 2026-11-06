// Sanity project settings. The project ID and dataset are public (they appear
// in every image URL), so they have defaults here; env vars can override them,
// e.g. to point a preview deploy at a different dataset.

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-06";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "2gccpec8";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
