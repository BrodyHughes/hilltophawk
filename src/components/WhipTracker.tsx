"use client";

import { useState } from "react";
import { CAMP_LABEL, CAMP_ORDER, type Camp, SENATORS, type Senator } from "@/lib/whip-count";
import styles from "./WhipCount.module.css";

type Filter = "all" | Camp;
type SortKey = "camp" | "name" | "state" | "date";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "S", label: "Schumer" },
  { id: "V", label: "Van Hollen" },
  { id: "U", label: "Undecided" },
  { id: "N", label: "No statement" },
];

const DOT_COLOR: Record<Camp, string> = {
  S: "var(--blue)",
  V: "var(--green)",
  U: "var(--gold)",
  N: "rgba(var(--fg), .22)",
};

const rowId = (s: Senator) => `senator-${s.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);
const shortDate = (d?: string) =>
  d ? new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

function position(s: Senator) {
  if (s.camp !== "V") return CAMP_LABEL[s.camp];
  return s.sub === "endorse" ? "Endorses Van Hollen" : "Won’t back Schumer";
}

/** Dot map + filterable table of every caucus member, with how to reach them. */
export function WhipTracker() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [electOnly, setElectOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "camp", dir: 1 });
  const [highlight, setHighlight] = useState<string | null>(null);

  const dots = [...SENATORS].sort(
    (a, b) => CAMP_ORDER[a.camp] - CAMP_ORDER[b.camp] || Number(b.sub === "endorse") - Number(a.sub === "endorse"),
  );

  const q = query.trim().toLowerCase();
  const rows = SENATORS.filter(
    (s) =>
      (filter === "all" || s.camp === filter) &&
      (!electOnly || s.elect) &&
      (!q || `${s.name} ${s.state}`.toLowerCase().includes(q)),
  ).sort((a, b) => {
    let x: string | number;
    let y: string | number;
    if (sort.key === "camp") {
      x = CAMP_ORDER[a.camp];
      y = CAMP_ORDER[b.camp];
      if (x === y) {
        x = a.date ?? "";
        y = b.date ?? "";
      }
    } else {
      x = a[sort.key] ?? "";
      y = b[sort.key] ?? "";
    }
    return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
  });

  function sortBy(key: SortKey) {
    setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));
  }

  function jumpTo(s: Senator) {
    setFilter("all");
    setQuery("");
    setElectOnly(false);
    setHighlight(s.name);
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(rowId(s))?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
  }

  const sortHead = (key: SortKey, label: string, className?: string) => (
    <th className={className} aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
      <button type="button" onClick={() => sortBy(key)}>{label}</button>
    </th>
  );

  return (
    <>
      <h2 className={styles.sectionTitle}>The Caucus, Seat by Seat</h2>
      <div className={styles.dots}>
        {dots.map((s) => (
          <button
            key={s.name}
            type="button"
            data-camp={s.camp}
            className={`${styles.dot} ${s.elect ? styles.dotElect : ""}`}
            style={{ background: DOT_COLOR[s.camp] }}
            title={`${s.name} (${s.party}-${s.state}) · ${position(s)}`}
            aria-label={`${s.name}, ${position(s)}. Jump to row.`}
            onClick={() => jumpTo(s)}
          >
            {initials(s.name)}
          </button>
        ))}
      </div>
      <div className={styles.note}>Each dot is one voting member. Dashed outline = senator-elect. Tap a dot to jump to that senator.</div>

      <h2 className={styles.sectionTitle}>Every Senator</h2>
      <div className={styles.controls}>
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className={styles.chip} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
        <input
          type="search"
          className={styles.search}
          placeholder="Search name or state"
          aria-label="Search senators by name or state"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={styles.toggle}>
          <input type="checkbox" checked={electOnly} onChange={(e) => setElectOnly(e.target.checked)} /> Senators-elect only
        </label>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {sortHead("name", "Senator")}
              {sortHead("state", "State")}
              {sortHead("camp", "Position")}
              {sortHead("date", "As of", styles.hideSm)}
              <th className={styles.hideSm}>Note</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.name} id={rowId(s)} className={highlight === s.name ? styles.hl : undefined}>
                <td>
                  <span className={styles.who}>{s.name}</span>
                  {s.elect && <span className={styles.mono}> &middot; sen.-elect</span>}
                </td>
                <td className={styles.mono}>{s.party}-{s.state}</td>
                <td>
                  <span className={styles.pill} data-camp={s.camp}>{position(s)}</span>
                  {s.flag && <span className={styles.flag}>&#9873; {s.flag}</span>}
                </td>
                <td className={`${styles.mono} ${styles.hideSm}`}>{shortDate(s.date)}</td>
                <td className={`${styles.noteCell} ${styles.hideSm}`}>{s.note}</td>
                <td className={styles.contact}>
                  {s.phone ? (
                    <>
                      <a className={styles.phone} href={`tel:+1${s.phone.replace(/\D/g, "")}`}>{s.phone}</a>
                      {s.contact && (
                        <a className={styles.form} href={s.contact} target="_blank" rel="noopener noreferrer">
                          Contact form &#8599;
                        </a>
                      )}
                    </>
                  ) : (
                    <span className={styles.noOffice}>{s.elect ? "No Senate office until sworn in Jan. 3" : "—"}</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.mono}>No matches.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
