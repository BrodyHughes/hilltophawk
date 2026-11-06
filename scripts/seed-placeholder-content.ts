/**
 * Loads the design's placeholder stories, radio episodes and tags into Sanity,
 * or removes them again. Runs as the logged-in Sanity user (no token needed):
 *
 *   npx sanity exec scripts/seed-placeholder-content.ts --with-user-token
 *   npx sanity exec scripts/seed-placeholder-content.ts --with-user-token -- --delete
 *
 * Seeding skips anything that already exists (matched by slug / episode
 * number), so running it twice is safe. --delete removes only documents that
 * match the placeholder list, never anything else.
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
import { ARTICLES, EPISODES, TAGS } from "./placeholder-content";

const client = getCliClient({ apiVersion: "2025-02-19" });
const PUBLIC_DIR = join(process.cwd(), "public");

async function seed() {
  // Images: upload each file once.
  const assetIds = new Map<string, string>();
  const imagePaths = new Set([...ARTICLES.map((a) => a.image), ...EPISODES.map((e) => e.image)]);
  for (const path of imagePaths) {
    const asset = await client.assets.upload("image", createReadStream(join(PUBLIC_DIR, path)), {
      filename: basename(path),
    });
    assetIds.set(path, asset._id);
    console.log(`image  ${basename(path)}`);
  }
  const imageField = (path: string, position?: string) => {
    // "center 62%" → hotspot at 50% across, 62% down.
    const match = position && /(\d+)%$/.exec(position);
    return {
      _type: "image",
      asset: { _type: "reference", _ref: assetIds.get(path)! },
      ...(match ? { hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: Number(match[1]) / 100, width: 1, height: 1 } } : {}),
    };
  };

  // Tags: reuse existing ones by slug.
  const tagIds = new Map<string, string>();
  for (const t of TAGS) {
    const existing = await client.fetch<string | null>(`*[_type == "tag" && slug.current == $slug][0]._id`, { slug: t.slug });
    const id =
      existing ?? (await client.create({ _type: "tag", name: t.name, slug: { _type: "slug", current: t.slug } }))._id;
    tagIds.set(t.slug, id);
    console.log(`tag    ${existing ? "exists " : "created"} ${t.name}`);
  }

  for (const a of ARTICLES) {
    const exists = await client.fetch<number>(`count(*[_type == "article" && slug.current == $slug])`, { slug: a.slug });
    if (exists) {
      console.log(`article exists  ${a.title}`);
      continue;
    }
    await client.create(
      {
        _type: "article",
        title: a.title,
        slug: { _type: "slug", current: a.slug },
        dek: a.dek,
        image: imageField(a.image, a.imagePosition),
        body: a.body.map((text) => ({
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", text, marks: [] }],
        })),
        collection: a.collection,
        tags: a.tags.map((slug) => ({ _type: "reference", _ref: tagIds.get(slug)! })),
        kicker: a.kicker,
        author: a.author,
        publishedAt: a.date,
        layout: "standard",
      },
      { autoGenerateArrayKeys: true },
    );
    console.log(`article created ${a.title}`);
  }

  for (const e of EPISODES) {
    const exists = await client.fetch<number>(`count(*[_type == "episode" && number == $number])`, { number: e.number });
    if (exists) {
      console.log(`episode exists  ${e.number}`);
      continue;
    }
    await client.create({ _type: "episode", title: e.title, number: e.number, length: e.length, image: imageField(e.image) });
    console.log(`episode created ${e.number} ${e.title}`);
  }
}

async function remove() {
  const ids = await client.fetch<string[]>(
    `*[
      (_type == "article" && slug.current in $articleSlugs) ||
      (_type == "episode" && title in $episodeTitles)
    ]._id`,
    { articleSlugs: ARTICLES.map((a) => a.slug), episodeTitles: EPISODES.map((e) => e.title) },
  );
  // Tags go last and only if nothing else still references them.
  const tagIds = await client.fetch<string[]>(`*[_type == "tag" && slug.current in $slugs]._id`, {
    slugs: TAGS.map((t) => t.slug),
  });

  const tx = client.transaction();
  ids.forEach((id) => tx.delete(id));
  await tx.commit();
  console.log(`deleted ${ids.length} articles/episodes`);

  let deletedTags = 0;
  for (const id of tagIds) {
    const refs = await client.fetch<number>(`count(*[references($id)])`, { id });
    if (refs === 0) {
      await client.delete(id);
      deletedTags++;
    }
  }
  console.log(`deleted ${deletedTags} unused tags (kept ${tagIds.length - deletedTags} still in use)`);
}

const run = process.argv.includes("--delete") ? remove : seed;
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
