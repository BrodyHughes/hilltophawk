"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ShareButton.module.css";

type Props = { slug: string; title: string };
type Format = "feed" | "story";

const FORMATS: { format: Format; label: string; note: string }[] = [
  { format: "story", label: "Story image", note: "9:16, for Stories" },
  { format: "feed", label: "Post image", note: "4:5, for feed posts" },
];

/**
 * Share menu for an article. On phones the image options open the native share
 * sheet with the PNG attached (the only way a website can hand an image to
 * Instagram, Messages, etc.); elsewhere they download the image instead.
 */
export function ShareButton({ slug, title }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const menuId = useId();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const articleUrl = () => `${window.location.origin}/articles/${slug}`;

  async function shareImage(format: Format) {
    setStatus("Making image…");
    try {
      const res = await fetch(`/articles/${slug}/share/${format}`);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const file = new File([blob], `hth-${slug}-${format}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        setStatus("");
        // Files only: some apps (Instagram among them) drop the image if text is attached too.
        await navigator.share({ files: [file], title });
        return;
      }

      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
      setStatus("Image downloaded.");
    } catch (err) {
      // Closing the share sheet without picking an app isn't an error.
      setStatus(err instanceof DOMException && err.name === "AbortError" ? "" : "Couldn't make the image. Try again?");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(articleUrl());
      setStatus("Link copied.");
    } catch {
      setStatus("Couldn't copy. The link is in your address bar.");
    }
  }

  const enc = (s: string) => encodeURIComponent(s);
  const socials = () => [
    { label: "Post on X", href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(articleUrl())}` },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(articleUrl())}` },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(articleUrl())}` },
  ];

  return (
    <div className={styles.wrap} ref={wrap}>
      <button
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setStatus("");
          setOpen((o) => !o);
        }}
      >
        Share
      </button>

      {open && (
        <div id={menuId} className={styles.menu}>
          <div className={styles.group}>
            {FORMATS.map((f) => (
              <button key={f.format} type="button" className={styles.item} onClick={() => shareImage(f.format)}>
                <span className={styles.itemLabel}>{f.label}</span>
                <span className={styles.itemNote}>{f.note}</span>
              </button>
            ))}
          </div>
          <div className={styles.group}>
            <button type="button" className={styles.item} onClick={copyLink}>
              <span className={styles.itemLabel}>Copy link</span>
            </button>
            {socials().map((s) => (
              <a key={s.label} className={styles.item} href={s.href} target="_blank" rel="noopener noreferrer">
                <span className={styles.itemLabel}>{s.label}</span>
              </a>
            ))}
          </div>
          <p className={styles.status} role="status" aria-live="polite">
            {status}
          </p>
        </div>
      )}
    </div>
  );
}
