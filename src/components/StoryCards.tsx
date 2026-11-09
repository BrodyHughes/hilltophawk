import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { type Article, articleHref, colorFor, kickerFor } from "@/lib/content";
import styles from "./StoryCards.module.css";

const accent = (a: Article) => ({ "--accent": colorFor(a) }) as CSSProperties;

/** Image on top, kicker, title, dek. Used in "Latest" and collection grids. */
export function GridCard({ article, titleSize = 15 }: { article: Article; titleSize?: number }) {
  return (
    <Link href={articleHref(article.slug)} className={`hl-trigger ${styles.grid}`} style={accent(article)}>
      <div className={`frame ${styles.gridImage}`}>
        <Image src={article.wide.src} alt="" fill sizes="(max-width: 860px) 100vw, 360px" style={{ objectPosition: article.wide.position ?? "center" }} />
      </div>
      <div className="kicker">{kickerFor(article)}</div>
      <h3 className={styles.gridTitle} style={{ fontSize: titleSize }}>
        <span className="hl">{article.title}</span>
      </h3>
      <p className="dek" style={{ fontSize: 12.5, lineHeight: 1.4 }}>{article.dek}</p>
    </Link>
  );
}

/** Tall card in the "Also Atop The Hill" drag row. */
export function TallCard({ article }: { article: Article }) {
  return (
    <Link href={articleHref(article.slug)} className={`hl-trigger ${styles.tall}`} style={accent(article)} draggable={false}>
      <div className={`frame ${styles.tallImage}`}>
        <Image src={article.image} alt="" fill sizes="230px" draggable={false} style={{ objectPosition: article.imagePosition ?? "center" }} />
      </div>
      <div className="kicker" style={{ fontSize: 10.5 }}>{kickerFor(article)}</div>
      <h3 className={styles.gridTitle} style={{ margin: 0 }}>
        <span className="hl">{article.title}</span>
      </h3>
    </Link>
  );
}

/** Small square thumbnail + text, in the home page's right rail. */
export function RailCard({ article }: { article: Article }) {
  return (
    <Link href={articleHref(article.slug)} className={`hl-trigger ${styles.rail}`} style={accent(article)}>
      <div className={styles.railThumb}>
        <Image src={article.square.src} alt="" fill sizes="96px" style={{ objectPosition: article.square.position ?? "center" }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="kicker" style={{ fontSize: 11, letterSpacing: ".13em" }}>{kickerFor(article)}</div>
        <h3 className={styles.railTitle}>
          <span className="hl">{article.title}</span>
        </h3>
        <div className={styles.railByline}>{article.author}</div>
      </div>
    </Link>
  );
}

/** Larger bordered card at the bottom of the home page's right rail. */
export function SecondaryCard({ article }: { article: Article }) {
  return (
    <Link href={articleHref(article.slug)} className={`hl-trigger ${styles.rail} ${styles.secondary}`} style={accent(article)}>
      <div className={`frame ${styles.secondaryImage}`}>
        <Image src={article.wide.src} alt="" fill sizes="(max-width: 860px) 100vw, 420px" style={{ objectPosition: article.wide.position ?? "center" }} />
      </div>
      <div className="kicker" style={{ fontSize: 11, letterSpacing: ".13em", marginBottom: 8 }}>{kickerFor(article)}</div>
      <h2 className={styles.secondaryTitle}>
        <span className="hl">{article.title}</span>
      </h2>
      <p className="dek" style={{ fontSize: 14.5, lineHeight: 1.5, color: "rgba(var(--fg),.65)" }}>{article.dek}</p>
    </Link>
  );
}

/** Home page lead story: big image with a dark caption bar over the bottom. */
export function LeadCard({ article }: { article: Article }) {
  return (
    <Link href={articleHref(article.slug)} className={`hl-trigger ${styles.lead}`} style={accent(article)}>
      <div className={styles.leadImage}>
        <Image
          src={article.wide.src}
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 100vw, 700px"
          style={{ objectFit: "cover", objectPosition: article.wide.position ?? "center" }}
        />
        <div className={styles.leadCaption}>
          <div className="kicker" style={{ fontSize: 11, letterSpacing: ".13em" }}>{kickerFor(article)}</div>
          <h1 className={styles.leadTitle}>
            <span className="hl">{article.title}</span>
          </h1>
          {article.dek && <p className={styles.leadDek}>{article.dek}</p>}
          <div className={styles.leadByline}>By {article.author}</div>
        </div>
      </div>
    </Link>
  );
}

/** Collection/tag page featured story: image left, text right. */
export function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link href={articleHref(article.slug)} className={`hl-trigger ${styles.featured}`} style={accent(article)}>
      <div className={`frame ${styles.featuredImage}`}>
        <Image
          src={article.wide.src}
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 100vw, 640px"
          style={{ objectPosition: article.wide.position ?? "center" }}
        />
      </div>
      <div>
        <div className="kicker" style={{ fontSize: 11, letterSpacing: ".13em", marginBottom: 10 }}>Featured</div>
        <h2 className={styles.featuredTitle}>
          <span className="hl">{article.title}</span>
        </h2>
        <p className="dek" style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(var(--fg),.65)", margin: "0 0 10px", maxWidth: 480 }}>
          {article.dek}
        </p>
        <div className="dek" style={{ fontSize: 12.5, color: "rgba(var(--fg),.5)" }}>By {article.author}</div>
      </div>
    </Link>
  );
}
