import type { Metadata } from "next";
import { ShareButton } from "@/components/ShareButton";
import { UntilVote } from "@/components/UntilVote";
import { WhipScore } from "@/components/WhipCount";
import styles from "@/components/WhipCount.module.css";
import { WhipTracker } from "@/components/WhipTracker";
import {
  NEEDED,
  SOURCES,
  tally,
  UPDATED,
  VOTE_DATE_LABEL,
  WHIP_CTA,
  WHIP_DEK,
  WHIP_SHARE_TEXT,
  WHIP_TITLE,
} from "@/lib/whip-count";

export const metadata: Metadata = {
  title: WHIP_TITLE,
  description: WHIP_DEK,
  openGraph: { title: WHIP_TITLE, description: WHIP_DEK, type: "article" },
  twitter: { card: "summary_large_image", title: WHIP_TITLE, description: WHIP_DEK },
};


export default function WhipCountPage() {
  const t = tally();
  return (
    <main className={`container ${styles.root}`} style={{ maxWidth: 1080, paddingBottom: 64 }}>
      <div className="kicker" style={{ marginTop: 28, fontSize: 11, letterSpacing: ".13em", color: "var(--gold)" }}>
        Senate Democratic Leadership &middot; Secret ballot {VOTE_DATE_LABEL}
      </div>
      <h1 className={styles.title}>Schumer vs. Van Hollen: The Whip Count</h1>
      <p className={styles.dek}>{WHIP_DEK}</p>
      <UntilVote
        after={
          <p className={styles.done}>
            Senate Democrats voted {VOTE_DATE_LABEL}. This was the last public count before the secret ballot.
          </p>
        }
      >
        <p className={styles.cta}>{WHIP_CTA}</p>
      </UntilVote>
      <div className={styles.stamp}>Updated {UPDATED} &middot; {t.total} voting members tracked</div>
      <ShareButton slug="whip-count" title={WHIP_TITLE} path="/whip-count" text={WHIP_SHARE_TEXT} styleChoices={false} />

      <WhipScore />

      <div className={styles.callouts}>
        <div className={styles.callout}>
          <b>The math</b>
          <p>
            Schumer is {NEEDED - t.S} short of a majority. Van Hollen is {NEEDED - t.V} short, and only {t.endorse} have endorsed him by name.{" "}
            {t.U + t.N} members haven&rsquo;t picked a side publicly.
          </p>
        </div>
        <div className={styles.callout}>
          <b>The wildcard</b>
          <p>Van Hollen says about 15 colleagues back him, though most haven&rsquo;t said so publicly. It&rsquo;s a secret ballot, so public pledges can&rsquo;t be checked against actual votes.</p>
        </div>
        <div className={styles.callout}>
          <b>The freshmen</b>
          <p>Of the 13 incoming senators, only Sherrod Brown has publicly backed Schumer. The rest have refused to back him or are holding off, and Schumer is meeting with them one-on-one.</p>
        </div>
      </div>

      <WhipTracker />

      <h2 className={styles.sectionTitle}>Sources</h2>
      <ol className={styles.sources}>
        {SOURCES.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          </li>
        ))}
      </ol>
    </main>
  );
}
