import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionTemplate } from "@/components/CollectionTemplate";
import { COLLECTIONS, getArticlesByCollection, getCollection } from "@/lib/content";

// /radio has its own route, so it's excluded here.
export function generateStaticParams() {
  return COLLECTIONS.filter((c) => c.slug !== "radio").map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  const c = getCollection(collection);
  return c ? { title: c.name, description: c.description } : {};
}

async function CollectionContent({ params }: Pick<PageProps<"/[collection]">, "params">) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection || collection.slug === "radio") notFound();

  const articles = await getArticlesByCollection(collection.slug);
  // Filter chips: every tag used in this collection, deduplicated by slug.
  const filterTags = [...new Map(articles.flatMap((a) => a.tags).map((t) => [t.slug, t])).values()];

  return (
    <CollectionTemplate
      label="Collection"
      title={collection.name}
      color={collection.color}
      description={collection.description}
      articles={articles}
      filterTags={filterTags}
    />
  );
}

export default function CollectionPage(props: PageProps<"/[collection]">) {
  return (
    <Suspense>
      <CollectionContent params={props.params} />
    </Suspense>
  );
}
