"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WelcomePopup.module.css";

// Shown for the 240 hours (10 days) after launch, then never again.
const SHOW_UNTIL = Date.parse("2026-11-21T01:32:00Z");
const SEEN_KEY = "hth-welcome-seen";
const HEADLINE = "Thanks For Visiting Hill Top Hawk!";

/**
 * Launch welcome note. Appears once per visitor during the launch window, over
 * a frosted view of the site. The card flips the site's colors: white in dark
 * mode, black in light mode. The headline types in, then the note fades up.
 */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Decide on the client only, after hydration (no server/client mismatch).
  useEffect(() => {
    if (Date.now() >= SHOW_UNTIL) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const t = window.setTimeout(() => {
      // Reduced motion: no typing, the whole note appears at once.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTyped(HEADLINE);
        setDone(true);
      }
      setOpen(true);
    }, 400);
    return () => window.clearTimeout(t);
  }, []);

  // Type the headline.
  useEffect(() => {
    if (!open || done) return;
    let i = 0;
    const start = window.setTimeout(() => {
      const iv = window.setInterval(() => {
        i++;
        setTyped(HEADLINE.slice(0, i));
        if (i >= HEADLINE.length) {
          window.clearInterval(iv);
          setDone(true);
        }
      }, 55);
      cleanup.iv = iv;
    }, 350);
    const cleanup: { iv?: number } = {};
    return () => {
      window.clearTimeout(start);
      window.clearInterval(cleanup.iv);
    };
  }, [open, done]);

  // While open: lock page scroll, focus the button, Esc closes.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    buttonRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOpen(false);
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 240);
  }

  if (!open) return null;

  return (
    <div className={closing ? `${styles.backdrop} ${styles.closing}` : styles.backdrop}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <h2 id="welcome-title" className={styles.title} aria-label={HEADLINE}>
          {/* The invisible full headline holds the final size so nothing jumps while it types. */}
          <span className={styles.titleSizer} aria-hidden="true">
            {HEADLINE}
          </span>
          <span className={styles.titleTyped} aria-hidden="true">
            {typed}
            {!done && <span className={styles.cursor} />}
          </span>
        </h2>
        <div className={done ? `${styles.body} ${styles.bodyIn}` : styles.body}>
          <p>
            Welcome to the newest iteration of my website — the fourth iteration of Hill Top Hawk. If you&rsquo;re
            reading this, I want to give my sincerest thanks to you for giving me a moment of your time in the most
            information-dense time in human history. Whether we&rsquo;ve been well acquainted for the bulk of our lives
            or have never spoken, to me, you&rsquo;re one of the best among us.
          </p>
          <p>
            Welcome to the <em>Middle American Freakshow</em>.
          </p>
          <p className={styles.signoff}>
            My best,
            <br />
            <span className={styles.name}>Ethan Butler-Hawkins</span>
          </p>
          <button ref={buttonRef} type="button" className={styles.button} onClick={close}>
            Continue to site
          </button>
        </div>
      </div>
    </div>
  );
}
