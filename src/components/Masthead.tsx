"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

const FULL = "Hill Top Hawk";
const TAGLINE = "Welcome to the Middle American Freakshow.";
const IDLE_MS = 60_000;

type Phase =
  | "full"
  | "deleting0"
  | "typing1"
  | "condensed"
  | "deleting1"
  | "typing2"
  | "holding2"
  | "deleting2"
  | "typing3";

/**
 * The animated masthead: 1.5s after load (then after every 60s of inactivity)
 * "Hill Top Hawk" is backspaced and "hth*" typed in, the asterisk spins as
 * "hth" is backspaced, the tagline types out, holds, then "Hill Top Hawk"
 * types back. Every change is typed; nothing fades.
 */
export function Masthead({ className }: { className?: string } = {}) {
  const [text, setText] = useState(FULL);
  const [phase, setPhase] = useState<Phase>("full");
  const phaseRef = useRef<Phase>("full");
  const timers = useRef<{ timeouts: number[]; interval?: number; idle?: number }>({ timeouts: [] });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = timers.current;

    const go = (p: Phase) => {
      phaseRef.current = p;
      setPhase(p);
    };
    const later = (fn: () => void, ms: number) => t.timeouts.push(window.setTimeout(fn, ms));

    const deleteText = (from: string, done: () => void) => {
      let s = from;
      window.clearInterval(t.interval);
      t.interval = window.setInterval(() => {
        s = s.slice(0, -1);
        setText(s);
        if (s.length === 0) {
          window.clearInterval(t.interval);
          done();
        }
      }, 32);
    };
    const typeText = (target: string, done: () => void) => {
      let i = 0;
      window.clearInterval(t.interval);
      t.interval = window.setInterval(() => {
        i++;
        setText(target.slice(0, i));
        if (i >= target.length) {
          window.clearInterval(t.interval);
          done();
        }
      }, 55);
    };

    const scheduleIdle = () => {
      window.clearTimeout(t.idle);
      t.idle = window.setTimeout(run, IDLE_MS);
    };

    function run() {
      go("deleting0");
      deleteText(FULL, () => {
        go("typing1");
        typeText("hth", () => {
          go("condensed");
          later(() => {
            go("deleting1");
            deleteText("hth", () => {
              go("typing2");
              typeText(TAGLINE, () => {
                go("holding2");
                later(() => {
                  go("deleting2");
                  deleteText(TAGLINE, () => {
                    go("typing3");
                    typeText(FULL, () => {
                      go("full");
                      scheduleIdle();
                    });
                  });
                }, 3000);
              });
            });
          }, 1800);
        });
      });
    }

    const onActivity = () => {
      if (phaseRef.current === "full") scheduleIdle();
    };

    later(run, 1500);
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("touchstart", onActivity);

    return () => {
      t.timeouts.forEach(window.clearTimeout);
      t.timeouts = [];
      window.clearInterval(t.interval);
      window.clearTimeout(t.idle);
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, []);

  const showAsterisk = phase === "condensed" || phase === "deleting1";

  return (
    <div
      className={className ? `${styles.masthead} ${className}` : styles.masthead}
      aria-label={FULL}
      role="img"
    >
      {/* Zero-width space keeps a text baseline when every letter is deleted,
          so the line box (and the page below it) doesn't jump. */}
      <span>{text || "​"}</span>
      {showAsterisk && (
        <span className={styles.asterisk} style={{ animation: phase === "deleting1" ? "spin .5s linear infinite" : "none" }}>
          *
        </span>
      )}
    </div>
  );
}
