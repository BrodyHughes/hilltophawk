"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import type { RadioEpisode } from "@/lib/content";
import { DragRow } from "./DragRow";
import styles from "./RadioPlayer.module.css";

const epLabel = (ep: RadioEpisode) => `Ep. ${String(ep.number).padStart(2, "0")}`;

/**
 * "Now playing" card, rotary dial for picking an episode, and the episode rail.
 * Ported from design/Radio.dc.html.
 *
 * TODO: the play button is visual only. When episodes have an audioUrl (or an
 * embed from the podcast host), play it here.
 */
export function RadioPlayer({ episodes }: { episodes: RadioEpisode[] }) {
  const [selected, setSelected] = useState(0);
  const [needle, setNeedle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);

  const step = 360 / episodes.length;
  const current = episodes[selected];

  const angleAt = (clientX: number, clientY: number) => {
    const rect = dialRef.current!.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return deg;
  };
  const nearest = (angle: number) => Math.round(angle / step) % episodes.length;

  const select = (i: number) => {
    setSelected(i);
    setNeedle(i * step);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const a = angleAt(e.clientX, e.clientY);
    setNeedle(a);
    setSelected(nearest(a));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const a = angleAt(e.clientX, e.clientY);
    setNeedle(a);
    setSelected(nearest(a));
  };
  const onUp = () => {
    setDragging(false);
    setNeedle(selected * step);
  };

  if (!current) return null;

  return (
    <>
      <div className={`container ${styles.top}`}>
        <div className={styles.nowPlaying}>
          <Image src={current.image} alt="" fill sizes="600px" className={styles.nowPlayingBg} />
          <div className={styles.nowPlayingShade} />
          <div className={styles.nowPlayingLabel}>Now Playing</div>
          <h2 className={styles.nowPlayingTitle}>{current.title}</h2>
          <div className={styles.nowPlayingMeta}>
            {epLabel(current)} &middot; {current.length}
          </div>
          <button type="button" className={styles.playBtn} aria-label={`Play ${current.title}`}>
            <span className={styles.playTriangle} />
          </button>
          <div className={styles.bars} aria-hidden>
            {[".9s 0s", "1.1s .1s", ".8s .2s", "1.2s .05s", "1s .15s", ".95s .25s"].map((t, i) => (
              <div key={i} style={{ animation: `bars ${t.split(" ")[0]} ease-in-out infinite ${t.split(" ")[1]}` }} />
            ))}
          </div>
        </div>

        <div className={styles.dialCard}>
          <div className="eyebrow" style={{ fontSize: 10 }}>Turn To Select</div>
          <div
            ref={dialRef}
            className={styles.dial}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            role="listbox"
            aria-label="Episodes"
          >
            {episodes.map((ep, i) => {
              const isSel = i === selected;
              return (
                <div key={ep.number} className={styles.dialSpoke} style={{ transform: `rotate(${i * step}deg)` }}>
                  <div
                    className={styles.dialStop}
                    style={{ transform: `translateX(-50%) rotate(${-i * step}deg)` }}
                    role="option"
                    aria-selected={isSel}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => select(i)}
                  >
                    <div
                      className={styles.dialDot}
                      style={{
                        width: isSel ? 12 : 8,
                        height: isSel ? 12 : 8,
                        background: isSel ? "var(--gold)" : "rgba(var(--fg),.3)",
                      }}
                    />
                    <div style={{ color: isSel ? "rgb(var(--fg))" : "rgba(var(--fg),.4)" }}>{epLabel(ep)}</div>
                  </div>
                </div>
              );
            })}
            <div
              className={styles.needle}
              style={{
                transform: `translate(-50%,-100%) rotate(${needle}deg)`,
                transition: dragging ? "none" : "transform .35s cubic-bezier(.2,.8,.2,1)",
              }}
            />
            <div className={styles.hub} />
          </div>
        </div>
      </div>

      <section className="container" style={{ marginTop: 36 }}>
        <div className="section-head">
          <div className="eyebrow">All Episodes</div>
          <div className="mono-note">
            Sort: <span style={{ color: "rgb(var(--fg))", textDecoration: "underline", textUnderlineOffset: 3 }}>Newest</span>
          </div>
        </div>
        <DragRow style={{ gap: 16, padding: "4px 2px 12px" }}>
          {episodes.map((ep, i) => (
            <button
              key={ep.number}
              type="button"
              onClick={() => select(i)}
              className={styles.railCard}
              style={{ borderColor: i === selected ? "var(--gold)" : "transparent" }}
            >
              <div className={styles.railImage}>
                <Image src={ep.image} alt="" fill sizes="230px" draggable={false} />
              </div>
              <div style={{ padding: 14 }}>
                <div className="kicker" style={{ color: "var(--gold)" }}>{epLabel(ep)}</div>
                <h3 className={styles.railTitle}>{ep.title}</h3>
                <div className={styles.railLength}>{ep.length}</div>
              </div>
            </button>
          ))}
        </DragRow>
      </section>
    </>
  );
}
