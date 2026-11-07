// Content layer. Every page reads content through the functions in this file,
// never from Sanity directly, so the CMS can change without touching pages.
//
// Caching: every Sanity read goes through `fetchContent`, which is cached with
// the "sanity" tag. Publishing in the Studio fires a webhook to
// /api/revalidate, which expires that tag so the site updates right away.
// Without the webhook, content still refreshes on its own within about an hour.

import { cacheLife, cacheTag } from "next/cache";
import { defineQuery, type PortableTextBlock, type QueryParams } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { type CollectionSlug, COLLECTIONS, getCollection } from "./collections";

export { type Collection, type CollectionSlug, COLLECTIONS, getCollection } from "./collections";

export const CONTENT_CACHE_TAG = "sanity";

export type Tag = {
  slug: string;
  name: string;
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO date, YYYY-MM-DD
  author: string;
  collection: CollectionSlug;
  /** Overrides the collection name in the small label above the title. */
  kicker?: string;
  tags: Tag[];
  image: string;
  imageAlt: string;
  /** CSS object-position from the image hotspot, e.g. "50% 62%". */
  imagePosition?: string;
  /** Landscape version for wide spots; falls back to the cover. */
  wide: Picture;
  /** Square version for thumbnails; falls back to the cover. */
  square: Picture;
  layout: string;
};

export type Picture = {
  src: string;
  /** CSS object-position from the image hotspot. */
  position?: string;
};

export type ArticleWithBody = Article & { body: PortableTextBlock[] };

export type RadioEpisode = {
  number: number;
  title: string;
  length: string;
  image: string;
  audioUrl?: string;
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

type SanityImage = {
  asset?: { _ref: string };
  hotspot?: { x: number; y: number };
  crop?: unknown;
  alt?: string;
};

type RawArticle = Omit<Article, "image" | "imageAlt" | "imagePosition" | "wide" | "square" | "tags"> & {
  image?: SanityImage;
  wideImage?: SanityImage;
  squareImage?: SanityImage;
  tags: (Tag | null)[];
};

const ARTICLE_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  "dek": coalesce(dek, ""),
  "date": publishedAt,
  "author": coalesce(author, "Hill Top Hawk"),
  collection,
  kicker,
  "tags": coalesce(tags[]->{ name, "slug": slug.current }, []),
  image,
  wideImage,
  squareImage,
  "layout": coalesce(layout, "standard")
`;

const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current) && defined(collection)]
    | order(publishedAt desc, _createdAt desc) { ${ARTICLE_FIELDS} }
`);

const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] { ${ARTICLE_FIELDS}, "body": coalesce(body, []) }
`);

const TAGS_QUERY = defineQuery(`
  *[_type == "tag" && defined(slug.current)] | order(name asc) { name, "slug": slug.current }
`);

const EPISODES_QUERY = defineQuery(`
  *[_type == "episode"] | order(number desc) { number, title, length, image, audioUrl }
`);

async function fetchContent<T>(query: string, params: QueryParams = {}): Promise<T> {
  "use cache";
  cacheTag(CONTENT_CACHE_TAG);
  cacheLife("hours");
  return client.fetch<T>(query, params);
}

const FALLBACK_IMAGE = "/images/hth-logo.png";

function imageUrl(image?: SanityImage) {
  // Cap the size Sanity sends; next/image resizes further per device.
  return image?.asset ? urlFor(image).width(2400).fit("max").auto("format").url() : FALLBACK_IMAGE;
}

function hotspotPosition(image?: SanityImage) {
  const h = image?.hotspot;
  return h ? `${(h.x * 100).toFixed(1)}% ${(h.y * 100).toFixed(1)}%` : undefined;
}

// Use the given version if it was uploaded, otherwise fall back to the cover.
function picture(version: SanityImage | undefined, cover: SanityImage | undefined): Picture {
  const img = version?.asset ? version : cover;
  return { src: imageUrl(img), position: hotspotPosition(img) };
}

function toArticle({ image, wideImage, squareImage, tags, ...rest }: RawArticle): Article {
  return {
    ...rest,
    tags: tags.filter((t): t is Tag => Boolean(t?.slug)),
    image: imageUrl(image),
    imageAlt: image?.alt ?? "",
    imagePosition: hotspotPosition(image),
    wide: picture(wideImage, image),
    square: picture(squareImage, image),
  };
}

// ---------------------------------------------------------------------------
// Public API used by pages
// ---------------------------------------------------------------------------

export async function getArticles(): Promise<Article[]> {
  const raw = await fetchContent<RawArticle[]>(ARTICLES_QUERY);
  return raw.map(toArticle);
}

export async function getArticle(slug: string): Promise<ArticleWithBody | undefined> {
  const raw = await fetchContent<(RawArticle & { body: PortableTextBlock[] }) | null>(ARTICLE_QUERY, { slug });
  return raw ? { ...toArticle(raw), body: raw.body } : undefined;
}

export async function getArticlesByCollection(slug: CollectionSlug): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.collection === slug);
}

export async function getArticlesByTag(slug: string): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.tags.some((t) => t.slug === slug));
}

export async function getEpisodes(): Promise<RadioEpisode[]> {
  const raw = await fetchContent<(Omit<RadioEpisode, "image"> & { image?: SanityImage; audioUrl: string | null })[]>(
    EPISODES_QUERY,
  );
  return raw.map(({ image, audioUrl, ...ep }) => ({ ...ep, image: imageUrl(image), audioUrl: audioUrl ?? undefined }));
}

export async function getTags(): Promise<Tag[]> {
  return fetchContent<Tag[]>(TAGS_QUERY);
}

export async function getTag(slug: string): Promise<Tag | undefined> {
  return (await getTags()).find((t) => t.slug === slug);
}

/** Collections with at least one item, in nav order. Radio counts episodes. */
export async function getActiveCollections() {
  const [articles, episodes] = await Promise.all([getArticles(), getEpisodes()]);
  return COLLECTIONS.filter((c) =>
    c.slug === "radio" ? episodes.length > 0 : articles.some((a) => a.collection === c.slug),
  );
}

/** Tags with at least one article. */
export async function getActiveTags(): Promise<Tag[]> {
  const [tags, articles] = await Promise.all([getTags(), getArticles()]);
  return tags.filter((t) => articles.some((a) => a.tags.some((at) => at.slug === t.slug)));
}

/**
 * With Cache Components, generateStaticParams must return at least one entry or
 * the build fails. Before any content exists, fall back to a placeholder that
 * the page turns into a 404.
 */
export function atLeastOne<T>(params: T[], placeholder: T): T[] {
  return params.length > 0 ? params : [placeholder];
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
  return article.kicker || getCollection(article.collection)?.name || "";
}

export function colorFor(article: Article) {
  return getCollection(article.collection)?.color ?? "#4E937A";
}
