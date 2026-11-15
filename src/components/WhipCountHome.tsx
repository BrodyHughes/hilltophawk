import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";
import { UntilVote } from "@/components/UntilVote";
import { WhipScore } from "@/components/WhipCount";
import styles from "@/components/WhipCount.module.css";
import { UPDATED, VOTE_DATE_LABEL, WHIP_CTA, WHIP_DEK, WHIP_SHARE_TEXT, WHIP_TITLE } from "@/lib/whip-count";
import { whipCountIsLive } from "@/lib/whip-count-live";


/**
 * Home page module for the Senate leader race. Removes itself after the vote:
 * the server stops rendering it within the hour, and UntilVote hides it in
 * the browser right at the deadline.
 */
export async function WhipCountHome() {
  if (!(await whipCountIsLive())) return null;
  return (
    <UntilVote>
      <section className={`container ${styles.root}`} style={{ marginTop: 40 }}>
        <div className={styles.home}>
          <div className="kicker" style={{ fontSize: 11, letterSpacing: ".13em", color: "var(--gold)" }}>
            Tracker &middot; Secret ballot {VOTE_DATE_LABEL}
          </div>
          <h2 className={`${styles.title} ${styles.titleSmall}`}>
            <Link href="/whip-count">Schumer vs. Van Hollen: The Whip Count</Link>
          </h2>
          <p className={styles.dek} style={{ fontSize: 17 }}>{WHIP_DEK}</p>
          <p className={styles.cta}>{WHIP_CTA}</p>
          <div className={styles.stamp}>Updated {UPDATED}</div>

          <WhipScore />

          <div className={styles.homeFoot}>
            <Link href="/whip-count" className={styles.more}>
              Every senator + how to call them &rarr;
            </Link>
            <ShareButton slug="whip-count" title={WHIP_TITLE} path="/whip-count" text={WHIP_SHARE_TEXT} styleChoices={false} />
          </div>
        </div>
      </section>
    </UntilVote>
  );
}
