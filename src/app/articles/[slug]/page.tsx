import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type CSSProperties } from "react";
import { getArticle, getArticles, getCollection, getTag, kickerFor, colorFor, tagHref } from "@/lib/content";
import styles from "./article.module.css";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.dek,
    openGraph: {
      title: article.title,
      description: article.dek,
      type: "article",
      publishedTime: article.date,
      images: [article.image],
    },
  };
}

// Standard article layout. The design export doesn't include an article page,
// so this follows the type and spacing of the other pages. Custom per-article
// layouts (plan, phase 7) will hang off a `layout` field and swap this out.
async function ArticleContent({ params }: Pick<PageProps<"/articles/[slug]">, "params">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const collection = getCollection(article.collection);
  const date = new Date(`${article.date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article style={{ "--accent": colorFor(article) } as CSSProperties}>
      <header className={styles.header}>
        {collection && (
          <Link href={`/${collection.slug}`} className="kicker" style={{ fontSize: 11, letterSpacing: ".13em" }}>
            {kickerFor(article)}
          </Link>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.dek}>{article.dek}</p>
        <div className={styles.byline}>
          By {article.author} &middot; <time dateTime={article.date}>{date}</time>
        </div>
      </header>

      <div className={`frame ${styles.hero}`}>
        <Image
          src={article.image}
          alt=""
          fill
          priority
          sizes="(max-width: 960px) 100vw, 960px"
          style={{ objectPosition: article.imagePosition ?? "center" }}
        />
      </div>

      <div className={styles.body}>
        {article.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {article.tags.length > 0 && (
        <div className={styles.tags}>
          {article.tags.map((slug) => {
            const tag = getTag(slug);
            return tag ? (
              <Link key={slug} href={tagHref(slug)} className={styles.tag}>
                #{tag.name}
              </Link>
            ) : null;
          })}
        </div>
      )}
    </article>
  );
}

export default function ArticlePage(props: PageProps<"/articles/[slug]">) {
  return (
    <main>
      <Suspense>
        <ArticleContent params={props.params} />
      </Suspense>
    </main>
  );
}
