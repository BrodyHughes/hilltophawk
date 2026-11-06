import Link from "next/link";
import { DragRow } from "./DragRow";
import { FeaturedCard, GridCard } from "./StoryCards";
import { type Article, type Tag, tagHref } from "@/lib/content";
import styles from "./CollectionTemplate.module.css";

/**
 * Shared template for collection pages (/sports) and tag pages (/tag/mets),
 * ported from design/Sports.dc.html.
 */
export function CollectionTemplate({
  label,
  title,
  color,
  description,
  articles,
  filterTags,
  activeTag,
}: {
  label: string;
  title: string;
  color?: string;
  description?: string;
  articles: Article[];
  filterTags: Tag[];
  activeTag?: string;
}) {
  const [featured, ...grid] = articles;

  return (
    <main>
      <div className={`container ${styles.header}`}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>{label}</div>
        <div className={styles.titleRow}>
          <h1 className={styles.title} style={{ color: color ?? "rgb(var(--fg))" }}>{title}</h1>
          <div className={styles.count}>
            {articles.length} {articles.length === 1 ? "story" : "stories"}
          </div>
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {filterTags.length > 0 && (
        <div className={`container ${styles.filters}`}>
          <DragRow style={{ gap: 8, flex: 1, minWidth: 0 }}>
            {filterTags.map((t) => (
              <Link
                key={t.slug}
                href={tagHref(t.slug)}
                className={styles.filterChip}
                aria-current={activeTag === t.slug ? "page" : undefined}
                draggable={false}
              >
                #{t.name}
              </Link>
            ))}
          </DragRow>
          <div className={styles.sort}>
            Sort: <span>Newest</span>
          </div>
        </div>
      )}

      {featured && (
        <div className="container" style={{ marginTop: 28 }}>
          <FeaturedCard article={featured} />
        </div>
      )}

      {grid.length > 0 && (
        <div className={`container ${styles.grid}`}>
          {grid.map((a) => (
            <GridCard key={a.slug} article={a} titleSize={16} />
          ))}
        </div>
      )}
    </main>
  );
}
