import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ShareButton } from "@/components/ShareButton";
import { type ArticleWithBody, tagHref } from "@/lib/content";
import { AUTHORS, CANDIDATES, GUIDE, INTRO } from "./data";
import { Countdown, Leaderboard, RankRail } from "./Interactive";
import { PlayerCard } from "./PlayerCard";
import styles from "./usa2k28.module.css";

const LINKS: Record<string, string> = {
  "Let Us Eat Cake": "/articles/let-us-eat-cake",
  "Integrity Index": "https://integrityindex.us",
};

/** Plain text with [[link]] markers, *emphasis* and a {countdown} slot. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\]|\*[^*]+\*|\{countdown\})/g);
  return (
    <>
      {parts.map((p, i): ReactNode => {
        if (p === "{countdown}") return <Countdown key={i} />;
        const link = p.match(/^\[\[(.+)\]\]$/);
        if (link) {
          const href = LINKS[link[1]];
          const ext = href?.startsWith("http");
          return href ? (
            <a key={i} href={href} className={styles.inlineLink} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {link[1]}
            </a>
          ) : (
            link[1]
          );
        }
        const em = p.match(/^\*(.+)\*$/);
        if (em) return <em key={i}>{em[1]}</em>;
        return p;
      })}
    </>
  );
}

export function Usa2k28Article({ article }: { article: ArticleWithBody }) {
  const date = new Date(`${article.date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const top = CANDIDATES[CANDIDATES.length - 1];

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroArt}>
          <Image className={styles.wideImg} src={article.wide.src} alt={article.imageAlt || "USA 2K28"} fill priority sizes="100vw" style={{ objectPosition: article.wide.position ?? "center" }} />
          <Image className={styles.squareImg} src={article.square.src} alt="" fill sizes="100vw" style={{ objectPosition: article.square.position ?? "center" }} />
        </div>
        <div className={styles.heroText}>
          <Link href="/politics" className={styles.kicker}>Politics · Special</Link>
          <h1 className={styles.title}>
            <span className={styles.usa}><i>U</i><i>S</i><i>A</i></span> 2K28
          </h1>
          <p className={styles.dek}>{article.dek}</p>
          <div className={styles.byline}>
            By {AUTHORS} · <time dateTime={article.date}>{date}</time>
          </div>
          <div className={styles.share}>
            <ShareButton slug={article.slug} title={article.title} />
          </div>
        </div>
      </header>

      <section className={styles.intro}>
        {INTRO.map((p, i) => (
          <p key={i} className={i === 0 ? styles.lede : undefined}><Rich text={p} /></p>
        ))}
      </section>

      <section className={styles.guide} aria-labelledby="the-ratings">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How to read the cards</span>
          <h2 id="the-ratings" className={styles.h2}>The Ratings</h2>
        </div>
        <div className={styles.guideGrid}>
          {GUIDE.map((g) => (
            <details key={g.key} className={styles.guideItem} open={g.key === "ovr"}>
              <summary>
                <span className={styles.guideCode}>{g.key === "ovr" ? "OVR" : g.label}</span>
                <span className={styles.guideMore} aria-hidden="true">+</span>
              </summary>
              {g.text.map((t, i) => <p key={i}><Rich text={t} /></p>)}
            </details>
          ))}
        </div>
      </section>

      <section className={styles.boardSection} aria-labelledby="the-board">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>The whole field</span>
          <h2 id="the-board" className={styles.h2}>The Board</h2>
        </div>
        <Leaderboard />
      </section>

      <RankRail />

      <section className={styles.entries} aria-label="The candidates, counting down">
        {CANDIDATES.map((c) => (
          <section key={c.id} id={c.id} className={`${styles.entry} ${c.endorsed ? styles.entryTop : ""}`} aria-labelledby={`${c.id}-name`}>
            <div className={styles.entryCard}>
              <PlayerCard c={c} priority={c.id === top.id} />
            </div>
            <div className={styles.entryText}>
              <div className={styles.rankRow}>
                <span className={styles.rankNum} aria-label={`Number ${c.rank}`}>{c.rank}</span>
                <div>
                  <h3 id={`${c.id}-name`} className={styles.entryName}>{c.first} {c.last}</h3>
                  <div className={styles.entryMeta}>
                    <span className={`${styles.partyChip} ${styles[c.party]}`}>{c.party}</span>
                    <span>{c.office} · {c.state}</span>
                    <span className={styles.ovrChip}>{c.ovr} OVR</span>
                  </div>
                  <span className={styles.archChip}>{c.archetype}{c.endorsed && " ★ HTH endorsed"}</span>
                </div>
              </div>
              {c.take.map((p, i) => <p key={i} className={styles.take}>{p}</p>)}
              <aside className={styles.comp} aria-label="Newburn player comp">
                <span className={styles.compLabel}>Newburn player comp</span>
                <span className={styles.compPlayer}>{c.comp.player}</span>
                <p>{c.comp.text}</p>
              </aside>
            </div>
          </section>
        ))}
      </section>

      <footer className={styles.end}>
        <p className={styles.endNote}>
          Ratings as of {date}. Integrity grades come from the{" "}
          <a href="https://integrityindex.us" target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>Integrity Index</a>
          ; ratings for anyone outside Congress are our estimates using its criteria.
        </p>
        {article.tags.length > 0 && (
          <div className={styles.tags}>
            {article.tags.map((tag) => (
              <Link key={tag.slug} href={tagHref(tag.slug)} className={styles.tag}>#{tag.name}</Link>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
