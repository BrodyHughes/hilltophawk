// The site's fixed sections. Kept in code (not the CMS) because each one has a
// route, a nav slot and an accent color. Shared by the site and Sanity Studio,
// so this file must stay free of server-only imports.

export type CollectionSlug =
  | "sports"
  | "culture"
  | "politics"
  | "mafs"
  | "video"
  | "radio"
  | "special";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  color: string;
  description: string;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "sports",
    name: "Sports",
    color: "#4E937A",
    description:
      "Box scores, backslides, and the Great Middle-American ballgame — covered straight, then covered again from the cheap seats.",
  },
  {
    slug: "culture",
    name: "Culture",
    color: "#226CE0",
    description: "Malls, diners, kayaks, and the people who love them.",
  },
  {
    slug: "politics",
    name: "Politics",
    color: "#FFB100",
    description: "Democracy happens in a folding chair under fluorescent light.",
  },
  {
    slug: "mafs",
    name: "M.A.F.S",
    color: "#4E937A",
    description: "Dispatches from the Middle American Freakshow.",
  },
  { slug: "video", name: "Video", color: "#226CE0", description: "Moving pictures from atop the hill." },
  { slug: "radio", name: "Radio", color: "#FFB100", description: "HTH Radio." },
  {
    slug: "special",
    name: "Special",
    color: "#226CE0",
    description: "Special projects, longform, and things that don't fit anywhere else.",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
