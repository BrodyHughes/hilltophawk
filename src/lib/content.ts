// Content layer. Every page reads content through the functions at the bottom
// of this file, never from the data arrays directly. When the CMS is chosen
// (Sanity, or markdown files in the repo), only this file needs to change.
//
// The sample data below is the placeholder content from the Claude Design
// prototype in /handoff/design.

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

export type Tag = {
  slug: string;
  name: string;
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO date
  author: string;
  collection: CollectionSlug;
  /** Overrides the collection name in the small label above the title. */
  kicker?: string;
  tags: string[]; // tag slugs
  image: string;
  /** Focal point for cropped images, e.g. "center 62%". */
  imagePosition?: string;
  body: string[]; // paragraphs; becomes rich text once the CMS is wired up
};

export type RadioEpisode = {
  number: number;
  title: string;
  length: string;
  image: string;
  audioUrl?: string;
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

export const TAGS: Tag[] = [
  { slug: "nba-free-agency", name: "NBA Free Agency" },
  { slug: "the-leftovers", name: "The Leftovers" },
  { slug: "fiction-friday", name: "Fiction Friday" },
  { slug: "mets", name: "Mets" },
  { slug: "special-projects", name: "Special Projects" },
  { slug: "longform", name: "Longform" },
  { slug: "radio-hour", name: "Radio Hour" },
  { slug: "freakshow-files", name: "Freakshow Files" },
  { slug: "nba", name: "NBA" },
  { slug: "mlb", name: "MLB" },
  { slug: "youth-sports", name: "Youth Sports" },
];

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
];

const ARTICLES: Article[] = [
  {
    slug: "anthony-edwards-backslide-to-ascension",
    title: "Anthony Edwards & the Backslide to Ascension",
    dek: "He is just twenty-two years old — in a league this dense with talent, the onslaught was coming for him eventually. He sidestepped it anyway.",
    date: "2026-10-27",
    author: "Hill Top Hawk",
    collection: "sports",
    kicker: "Sports & Culture",
    tags: ["nba", "longform"],
    image: "/images/hero-ae-crop.jpg",
    imagePosition: "center 62%",
    body: LOREM,
  },
  {
    slug: "new-york-baseball-mutually-assured-destruction",
    title: "New York, Baseball, and Mutually Assured Destruction.",
    dek: "A story.",
    date: "2026-10-26",
    author: "Hill Top Hawk",
    collection: "sports",
    kicker: "Fiction",
    tags: ["fiction-friday", "mets", "mlb"],
    image: "/images/card-fiction-mad.png",
    body: LOREM,
  },
  {
    slug: "front-to-back-vol-1-the-leftovers",
    title: "Front to Back, Vol. 1: The Leftovers",
    dek: "Every episode, front to back.",
    date: "2026-10-25",
    author: "Ethan Butler-Hawkins",
    collection: "culture",
    kicker: "Television",
    tags: ["the-leftovers", "longform"],
    image: "/images/card-ftb.png",
    body: LOREM,
  },
  {
    slug: "more-profits-in-q4",
    title: "more profits in Q4",
    dek: "A story.",
    date: "2026-10-24",
    author: "Hill Top Hawk",
    collection: "culture",
    kicker: "Fiction",
    tags: ["fiction-friday"],
    image: "/images/card-fiction-profits.png",
    body: LOREM,
  },
  {
    slug: "great-middle-american-freakshow-field-guide",
    title: "The Great Middle-American Freakshow: A Field Guide",
    dek: "Notes on the discourse, the diners, and the deeply online — from a hill somewhere in the middle of it all.",
    date: "2026-10-23",
    author: "Hill Top Hawk",
    collection: "politics",
    kicker: "Politics & Culture",
    tags: ["freakshow-files", "longform"],
    image: "/images/fill-rain.jpg",
    body: LOREM,
  },
  {
    slug: "baseballs-late-season-zombies",
    title: "Baseball's Late-Season Zombies: A Field Guide to Teams Playing Out the String",
    dek: "They are mathematically alive. Spiritually, less so.",
    date: "2026-10-22",
    author: "Hill Top Hawk",
    collection: "sports",
    tags: ["mlb"],
    image: "/images/fill-out-comic.jpg",
    body: LOREM,
  },
  {
    slug: "malls-are-dead-long-live-the-mall-walk",
    title: "Malls Are Dead. Long Live the Mall Walk.",
    dek: "Inside the 6 a.m. laps of America’s last third places.",
    date: "2026-10-21",
    author: "Hill Top Hawk",
    collection: "culture",
    tags: [],
    image: "/images/fill-biplane.jpg",
    body: LOREM,
  },
  {
    slug: "township-meeting-minutes-nobody-reads",
    title: "The Township Meeting Minutes Nobody Reads (We Read Them)",
    dek: "Democracy happens in a folding chair under fluorescent light.",
    date: "2026-10-20",
    author: "Hill Top Hawk",
    collection: "politics",
    tags: [],
    image: "/images/fill-guerrilla.jpg",
    body: LOREM,
  },
  {
    slug: "the-discourse-economy",
    title: "The Discourse Economy: Who Gets Paid to Be Mad Online",
    dek: "Follow the outrage, find the invoice.",
    date: "2026-10-19",
    author: "Hill Top Hawk",
    collection: "culture",
    tags: ["freakshow-files"],
    image: "/images/fill-ae-quote.jpg",
    body: LOREM,
  },
  {
    slug: "notes-from-a-township-board-meeting-ohio",
    title: "Notes from a Township Board Meeting, Somewhere in Ohio",
    dek: "Item 7 on the agenda was a goose.",
    date: "2026-10-18",
    author: "Hill Top Hawk",
    collection: "politics",
    tags: [],
    image: "/images/fill-profits2.jpg",
    body: LOREM,
  },
  {
    slug: "disposable-camera-every-diner-route-9",
    title: "We Sent a Disposable Camera to Every Diner on Route 9",
    dek: "Twenty-seven exposures, forty-one diners.",
    date: "2026-10-17",
    author: "Hill Top Hawk",
    collection: "special",
    kicker: "Special Projects",
    tags: ["special-projects", "longform"],
    image: "/images/fill-profits3.jpg",
    body: LOREM,
  },
  {
    slug: "youth-travel-baseball-mlm",
    title: "Youth Travel Baseball Is a Multi-Level Marketing Scheme",
    dek: "Every showcase promises exposure. Someone is always buying.",
    date: "2026-10-16",
    author: "Hill Top Hawk",
    collection: "sports",
    tags: ["youth-sports", "mlb"],
    image: "/images/fill-biplane.jpg",
    body: LOREM,
  },
  {
    slug: "the-man-who-alphabetizes-his-regret",
    title: "The Man Who Alphabetizes His Regret",
    dek: "A to Z, and back again.",
    date: "2026-10-15",
    author: "Hill Top Hawk",
    collection: "culture",
    tags: [],
    image: "/images/fill-rain.jpg",
    body: LOREM,
  },
  {
    slug: "taxonomy-of-guys-who-own-a-kayak",
    title: "A Taxonomy of Guys Who Own a Kayak",
    dek: "Genus: Guy. Species: Has a roof rack.",
    date: "2026-10-14",
    author: "Hill Top Hawk",
    collection: "culture",
    tags: [],
    image: "/images/fill-out-comic.jpg",
    body: LOREM,
  },
  {
    slug: "unbearable-sadness-of-preseason-nba",
    title: "The Unbearable Sadness of Preseason NBA Basketball",
    dek: "Meaningless minutes, played with total conviction.",
    date: "2026-10-13",
    author: "Hill Top Hawk",
    collection: "sports",
    tags: ["nba"],
    image: "/images/fill-rain.jpg",
    body: LOREM,
  },
  {
    slug: "little-league-world-series-one-kids-dad",
    title: "Why Every Little League World Series Comes Down to One Kid's Dad",
    dek: "Somewhere behind the backstop, a grown man is losing it.",
    date: "2026-10-12",
    author: "Hill Top Hawk",
    collection: "sports",
    tags: ["youth-sports", "mlb"],
    image: "/images/fill-guerrilla.jpg",
    body: LOREM,
  },
];

const EPISODES: RadioEpisode[] = [
  { number: 6, title: "The Backslide Doctrine", length: "41:12", image: "/images/fill-guerrilla.jpg" },
  { number: 5, title: "Front to Back Live — The Leftovers Postmortem", length: "58:03", image: "/images/card-ftb.png" },
  { number: 4, title: "Freakshow Weekly: Diner Correspondents", length: "33:47", image: "/images/fill-rain.jpg" },
  { number: 3, title: "Atop This Hill (Pilot)", length: "46:20", image: "/images/fill-biplane.jpg" },
  { number: 2, title: "DJ Set: Middle American Nights, Vol. 1", length: "62:15", image: "/images/fill-out-comic.jpg" },
  { number: 1, title: "Rare Audio Essay: On Being a Contributor", length: "21:08", image: "/images/fill-ae-quote.jpg" },
];

// ---------------------------------------------------------------------------
// Queries. Async so the signatures stay the same once these hit a real CMS.
// ---------------------------------------------------------------------------

const newestFirst = (a: Article, b: Article) => b.date.localeCompare(a.date);

export async function getArticles(): Promise<Article[]> {
  return [...ARTICLES].sort(newestFirst);
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return ARTICLES.find((a) => a.slug === slug);
}

export async function getArticlesByCollection(slug: CollectionSlug): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.collection === slug);
}

export async function getArticlesByTag(slug: string): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.tags.includes(slug));
}

export async function getEpisodes(): Promise<RadioEpisode[]> {
  return [...EPISODES].sort((a, b) => b.number - a.number);
}

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getTag(slug: string): Tag | undefined {
  return TAGS.find((t) => t.slug === slug);
}

/** Collections with at least one item, in nav order. Radio counts episodes. */
export async function getActiveCollections(): Promise<Collection[]> {
  const articles = await getArticles();
  const episodes = await getEpisodes();
  return COLLECTIONS.filter((c) =>
    c.slug === "radio" ? episodes.length > 0 : articles.some((a) => a.collection === c.slug),
  );
}

/** Tags with at least one article. */
export async function getActiveTags(): Promise<Tag[]> {
  const articles = await getArticles();
  return TAGS.filter((t) => articles.some((a) => a.tags.includes(t.slug)));
}

export function collectionHref(slug: CollectionSlug) {
  return `/${slug}`;
}

export function tagHref(slug: string) {
  return `/tag/${slug}`;
}

export function articleHref(slug: string) {
  return `/articles/${slug}`;
}

/** Label shown above a story title. */
export function kickerFor(article: Article) {
  return article.kicker ?? getCollection(article.collection)?.name ?? "";
}

export function colorFor(article: Article) {
  return getCollection(article.collection)?.color ?? "#4E937A";
}
