import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { DragRow } from "@/components/DragRow";
import { GridCard, LeadCard, RailCard, SecondaryCard, TallCard } from "@/components/StoryCards";
import { getArticles, getEpisodes } from "@/lib/content";
import styles from "./home.module.css";

// Home page sections appear only when there is enough content to fill them
// (see handoff README, section 5). Order is fixed; hidden sections leave no gap.
export default async function Home() {
  const [articles, episodes] = await Promise.all([getArticles(), getEpisodes()]);

  const [lead, ...rest] = articles;
  const rail = rest.slice(0, 3);
  const secondary = rest[3];
  const latest = rest.slice(4, 7);
  const more = rest.slice(7);

  if (!lead) {
    return <main className="container" style={{ padding: "80px 24px", textAlign: "center" }}>Nothing atop the hill yet.</main>;
  }

  return (
    <main>
      <div className={`container ${styles.top}`}>
        <div>
          <LeadCard article={lead} />

          {latest.length >= 2 && (
            <section style={{ marginTop: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Latest From The Hill</div>
              <div className={styles.latestGrid} style={{ gridTemplateColumns: `repeat(${latest.length}, 1fr)` }}>
                {latest.map((a) => (
                  <GridCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        {rail.length > 0 && (
          <aside className={styles.rail}>
            {rail.map((a) => (
              <RailCard key={a.slug} article={a} />
            ))}
            {secondary && <SecondaryCard article={secondary} />}
          </aside>
        )}
      </div>

      {more.length >= 3 && (
        <section className="container" style={{ marginTop: 52 }}>
          <div className="section-head">
            <div className="eyebrow">Also Atop The Hill</div>
            <div className="mono-note">drag to scroll →</div>
          </div>
          <DragRow style={{ gap: 18, paddingBottom: 6 }}>
            {more.map((a) => (
              <TallCard key={a.slug} article={a} />
            ))}
          </DragRow>
        </section>
      )}

      {episodes.length > 0 && (
        <section className="container" style={{ marginTop: 52 }}>
          <div className="section-head">
            <Link href="/radio" className="eyebrow">HTH Radio</Link>
            <div className="mono-note">drag to scroll →</div>
          </div>
          <DragRow style={{ gap: 16, padding: "10px 2px" }}>
            {episodes.map((ep) => (
              <Link key={ep.number} href="/radio" className={styles.episode} draggable={false}>
                <div className={styles.episodeImage}>
                  <Image src={ep.image} alt="" fill sizes="280px" draggable={false} />
                </div>
                <div style={{ padding: 18 }}>
                  <div className={styles.episodeControls}>
                    <div className={styles.playCircle}>
                      <div className={styles.playTriangle} />
                    </div>
                    <div className={styles.waveform}>
                      {[10, 22, 14, 26, 8, 18].map((h, i) => (
                        <div key={i} style={{ height: h }} />
                      ))}
                    </div>
                  </div>
                  <div className="kicker" style={{ color: "var(--gold)" }}>Ep. {String(ep.number).padStart(2, "0")}</div>
                  <h3 className={styles.episodeTitle}>{ep.title}</h3>
                  <div className={styles.episodeLength}>{ep.length}</div>
                </div>
              </Link>
            ))}
          </DragRow>
        </section>
      )}

      <ContactForm />
    </main>
  );
}
