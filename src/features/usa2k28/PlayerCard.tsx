"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useRef, useState } from "react";
import { ATTRS, BADGE_INFO, type Candidate } from "./data";
import styles from "./usa2k28.module.css";

const ICONS: Record<string, string> = {
  Grassroots: "M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5zM7 21h10",
  Principled: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
  "Political Celebrity": "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  "War Chest": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.3 0-2.4-.5-3-1.5M12 6.5v11",
  "Swing State Proven": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  "Podcast Circuit": "M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3",
  "Crossover Appeal": "M4 8h13l-3-3M20 16H7l3 3",
  "Party Machine": "M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18",
  "Debate Closer": "M4 5h16v10H9l-5 4z",
  "Executive Record": "M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM9 7V5h6v2M3 13h18",
  Outsider: "M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z",
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.badgeIcon}>
      <path d={ICONS[name] ?? ICONS.shield} />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className={styles.star} role="img" aria-label="HTH endorsed">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" />
    </svg>
  );
}

/** Card face, reused for the cover-like hero and the entries. */
export function CardFront({ c, priority = false }: { c: Candidate; priority?: boolean }) {
  return (
    <div className={styles.face}>
      <div className={styles.frame}>
        <div className={styles.photo}>
          <Image src={c.photo} alt={`${c.first} ${c.last}`} fill sizes="(max-width: 700px) 80vw, 380px" priority={priority} />
          <div className={styles.ovrPanel}>
            <span className={styles.ovrNum}>{c.ovr}</span>
            <span className={styles.ovrLabel}>OVR</span>
            <span className={styles.ovrParty}>
              <b>{c.party}</b>
              <span>{c.state}</span>
            </span>
          </div>
          <div className={styles.hthPanel}>
            <span className={styles.hthMark}>hth*</span>
            <span className={styles.hthSub}>USA 2K28</span>
          </div>
          <div className={styles.nameBand}>
            <span className={styles.first}>{c.first.toUpperCase()}</span>
            <span className={styles.last}>{c.last}</span>
            <span className={styles.arch}>
              ARCHETYPE <b>{c.archetype}</b>
              {c.endorsed && <Star />}
            </span>
          </div>
        </div>
        <div className={styles.info}>
          <div><span>AGE</span><b>{c.age}</b></div>
          <div><span>PARTY</span><b>{c.partyName}</b></div>
          <div><span>OFFICE</span><b>{c.office}</b></div>
        </div>
        <div className={styles.attrs}>
          {ATTRS.map((a) => (
            <div key={a.key} className={styles.attr}>
              <div className={styles.attrHead}>
                <span>{a.label}</span>
                <b>{c.ratings[a.key]}</b>
              </div>
              <div className={styles.bar}><i style={{ width: `${c.ratings[a.key]}%` }} /></div>
            </div>
          ))}
        </div>
        <div className={styles.badgesWrap}>
          <span className={styles.badgesLabel}>BADGES</span>
          <div className={styles.badges}>
            {c.badges.map((b) => (
              <div key={b} className={styles.badge}><Icon name={b} /><span>{b}</span></div>
            ))}
          </div>
        </div>
        <div className={styles.cardFoot}>
          <span>HILLTOPHAWK.ONLINE</span>
          {c.endorsed && <span className={styles.key}><Star /> <b>HTH ENDORSED</b></span>}
          <span>USA 2K28 · {c.last.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

function CardBack({ c }: { c: Candidate }) {
  const r = c.integrity;
  return (
    <div className={`${styles.face} ${styles.back}`}>
      <div className={`${styles.frame} ${styles.backFrame}`}>
        <div className={styles.backHead}>
          <span className={styles.hthMark}>hth*</span>
          <span className={styles.backTitle}>RECEIPTS · {c.last.toUpperCase()}</span>
        </div>
        <section className={styles.receipt}>
          <span className={styles.receiptLabel}>INTEGRITY INDEX</span>
          {r.graded ? (
            <>
              <div className={styles.gradeRow}>
                <span className={styles.grade}>{r.grade}</span>
                <span className={styles.gradeMeta}><b>{r.score}</b> / 100<br />{r.rank}</span>
              </div>
              <dl className={styles.facts}>
                {r.facts.map((f) => (
                  <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                ))}
              </dl>
              <a href={r.href} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>Full profile on Integrity Index ↗</a>
            </>
          ) : (
            <>
              <p className={styles.receiptNote}>{r.note}</p>
              {r.href && (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>Their Integrity Index page ↗</a>
              )}
            </>
          )}
        </section>
        <section className={styles.receipt}>
          <span className={styles.receiptLabel}>BADGES</span>
          <ul className={styles.badgeList}>
            {c.badges.map((b) => (
              <li key={b}><Icon name={b} /><span><b>{b}</b>{BADGE_INFO[b] ?? ""}</span></li>
            ))}
          </ul>
        </section>
        {c.links.length > 0 && (
          <section className={styles.receipt}>
            <span className={styles.receiptLabel}>THE RECORD</span>
            <ul className={styles.linkList}>
              {c.links.map((l) => (
                <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a></li>
              ))}
            </ul>
          </section>
        )}
        <div className={styles.cardFoot}>
          <span>HILLTOPHAWK.ONLINE</span>
          <span>USA 2K28 · {c.last.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

/** Flippable, tilting card. Front: the player card. Back: receipts and links. */
export function PlayerCard({ c, priority = false }: { c: Candidate; priority?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    ref.current.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    ref.current.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  }
  function onLeave() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div className={styles.cardStack}>
      <div
        ref={ref}
        className={styles.tilt}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ "--rx": "0deg", "--ry": "0deg" } as CSSProperties}
      >
        <div className={`${styles.card} ${flipped ? styles.flipped : ""}`} onClick={() => !flipped && setFlipped(true)}>
          <div className={styles.side} aria-hidden={flipped}>
            <CardFront c={c} priority={priority} />
            <span className={styles.shine} aria-hidden="true" />
          </div>
          <div className={`${styles.side} ${styles.sideBack}`} aria-hidden={!flipped} inert={!flipped}>
            <CardBack c={c} />
          </div>
        </div>
      </div>
      <button type="button" className={styles.flipBtn} onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>
        {flipped ? "← Back to the card" : "Flip for the receipts →"}
      </button>
    </div>
  );
}
