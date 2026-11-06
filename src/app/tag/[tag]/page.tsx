import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionTemplate } from "@/components/CollectionTemplate";
import { TAGS, getActiveTags, getArticlesByTag, getTag } from "@/lib/content";

export function generateStaticParams() {
  return TAGS.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const t = getTag(tag);
  return t ? { title: `#${t.name}` } : {};
}

async function TagContent({ params }: Pick<PageProps<"/tag/[tag]">, "params">) {
  const { tag: slug } = await params;
  const tag = getTag(slug);
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
