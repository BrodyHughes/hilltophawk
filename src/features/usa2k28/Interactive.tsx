"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ATTRS, type AttrKey, CANDIDATES, ELECTION_DAY, PUBLISH_DAYS } from "./data";
import styles from "./usa2k28.module.css";

const DAY = 86_400_000;
const noSubscribe = () => () => {};
const daysLeft = () => Math.max(0, Math.ceil((Date.parse(ELECTION_DAY) - Date.now()) / DAY));

/** "719 days ... just about 17,256 hours (or so)", live on the client. */
export function Countdown() {
  const days = useSyncExternalStore(noSubscribe, daysLeft, () => PUBLISH_DAYS);
  return (
    <>
      <b className={styles.count}>{days.toLocaleString("en-US")} days</b> until the 2028 presidential election, just about{" "}
      <b className={styles.count}>{(days * 24).toLocaleString("en-US")} hours</b> (or so)
    </>
  );
}

type SortKey = "ovr" | AttrKey;

function jump(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/** Sortable ratings table. Click a column to re-rank the field by it. */
export function Leaderboard() {
  const [sort, setSort] = useState<SortKey>("ovr");
  const rows = useMemo(() => {
    const val = (c: (typeof CANDIDATES)[number]) => (sort === "ovr" ? c.ovr : c.ratings[sort]);
    return [...CANDIDATES].sort((a, b) => val(b) - val(a) || a.rank - b.rank);
  }, [sort]);
  const cols: { key: SortKey; label: string; short: string }[] = [{ key: "ovr", label: "Overall", short: "OVR" }, ...ATTRS];

  return (
    <div className={styles.board}>
      <div className={styles.sortBar} role="group" aria-label="Rank the field by">
        <span className={styles.sortLabel}>Rank by</span>
        {cols.map((col) => (
          <button
            key={col.key}
            type="button"
            aria-pressed={sort === col.key}
            className={styles.sortBtn}
            onClick={() => setSort(col.key)}
          >
            {col.label}
          </button>
        ))}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>USA 2K28 ratings, sorted by {cols.find((c) => c.key === sort)?.label}</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thName}>Candidate</th>
              {cols.map((col) => (
                <th key={col.key} scope="col" aria-sort={sort === col.key ? "descending" : "none"} className={sort === col.key ? styles.thActive : undefined}>
                  <button type="button" onClick={() => setSort(col.key)} title={col.label}>{col.short}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id}>
                <th scope="row" className={styles.tdName}>
                  <button type="button" onClick={() => jump(c.id)}>
                    <span className={styles.rowRank}>{i + 1}</span>
                    <span className={styles.rowName}>{c.first} {c.last}</span>
                    <span className={`${styles.partyChip} ${styles[c.party]}`}>{c.party}</span>
                  </button>
                </th>
                {cols.map((col) => {
                  const v = col.key === "ovr" ? c.ovr : c.ratings[col.key];
                  return (
                    <td key={col.key} className={sort === col.key ? styles.tdActive : undefined}>
                      <span className={styles.cellNum}>{v}</span>
                      <span className={styles.cellBar}><i style={{ width: `${v}%` }} /></span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.boardNote}>Tap a name to jump to their card. OVR is the overall call, not an average of the six attributes.</p>
    </div>
  );
}

/** Sticky strip of the countdown. Highlights whoever is on screen. */
export function RankRail() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = CANDIDATES.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <nav className={styles.rail} aria-label="Jump to a candidate">
      <div className={styles.railInner}>
        <span className={styles.railLogo} aria-hidden="true"><i>U</i><i>S</i><i>A</i> 2K28</span>
        <ol className={styles.railList}>
          {CANDIDATES.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={active === c.id ? "true" : undefined}
                className={styles.railItem}
                onClick={(e) => {
                  e.preventDefault();
                  jump(c.id);
                }}
              >
                <span className={styles.railRank}>{c.rank}</span>
                <span className={styles.railName}>{c.last}</span>
                <span className={styles.railOvr}>{c.ovr}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
