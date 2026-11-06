import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionTemplate } from "@/components/CollectionTemplate";
import { atLeastOne, getActiveTags, getArticlesByTag, getTag, getTags } from "@/lib/content";

export async function generateStaticParams() {
  const tags = await getTags();
  return atLeastOne(
    tags.map((t) => ({ tag: t.slug })),
    { tag: "__none__" },
  );
}

export async function generateMetadata({ params }: PageProps<"/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const t = await getTag(tag);
  return t ? { title: `#${t.name}` } : {};
}

async function TagContent({ params }: Pick<PageProps<"/tag/[tag]">, "params">) {
  const { tag: slug } = await params;
  const tag = await getTag(slug);
  if (!tag) notFound();

  const [articles, filterTags] = await Promise.all([getArticlesByTag(tag.slug), getActiveTags()]);

  return (
    <CollectionTemplate
      label="Tag"
      title={`#${tag.name}`}
      articles={articles}
      filterTags={filterTags}
      activeTag={tag.slug}
    />
  );
}

export default function TagPage(props: PageProps<"/tag/[tag]">) {
  return (
    <Suspense>
      <TagContent params={props.params} />
    </Suspense>
  );
}
