import { NEEDED, tally } from "@/lib/whip-count";
import styles from "./WhipCount.module.css";

/** Big Schumer / Van Hollen numbers, the bar with the 28-vote line, and the legend. */
export function WhipScore() {
  const t = tally();
  return (
    <div>
      <div className={styles.score}>
        <div className={styles.side}>
          <div className={`${styles.name} ${styles.isS}`}>Schumer</div>
          <div className={`${styles.num} ${styles.isS}`}>{t.S}</div>
          <div className={styles.sub}>public backers</div>
        </div>
        <div className={styles.need}>
          <div className={styles.needNum}>{NEEDED}</div>
          <div className={styles.needLabel}>to win (of {t.total})</div>
        </div>
        <div className={`${styles.side} ${styles.sideRight}`}>
          <div className={`${styles.name} ${styles.isV}`}>Van Hollen</div>
          <div className={`${styles.num} ${styles.isV}`}>{t.V}</div>
          <div className={styles.sub}>endorsed or won&rsquo;t back Schumer</div>
        </div>
      </div>

      <div
        className={styles.bar}
        role="img"
        aria-label={`${t.S} back Schumer, ${t.U} undecided, ${t.N} no statement, ${t.V} in the Van Hollen camp. ${NEEDED} of ${t.total} needed to win.`}
      >
        <span className={styles.barS} style={{ flexGrow: t.S }} />
        <span className={styles.barU} style={{ flexGrow: t.U }} />
        <span className={styles.barN} style={{ flexGrow: t.N }} />
        <span className={styles.barV} style={{ flexGrow: t.V }} />
        <span className={styles.tick} style={{ left: `${(NEEDED / t.total) * 100}%` }} />
      </div>

      <div className={styles.legend}>
        <span><i style={{ background: "var(--blue)" }} />Backs Schumer</span>
        <span><i style={{ background: "var(--gold)" }} />Undecided</span>
        <span><i style={{ background: "rgba(var(--fg), .22)" }} />No public statement</span>
        <span><i style={{ background: "var(--green)" }} />Van Hollen camp</span>
      </div>
    </div>
  );
}
