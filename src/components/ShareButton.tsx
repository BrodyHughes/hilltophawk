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
 * Share controls for an article.
 *
 * - "Share" opens a menu: story/post images (share sheet on phones, download
 *   elsewhere), copy link, and X / Facebook / LinkedIn.
 * - "Share to Story" (phones only) skips the menu and opens the share sheet
 *   with the story image attached. A website can't open Instagram's story
 *   editor directly (Instagram only allows that from installed apps), so this
 *   is the shortest path: tap it, then tap Instagram › Story.
 *
 * Images are fetched ahead of time because phones only allow the share sheet
 * right after a tap; waiting on a download first can make it refuse to open.
 */
export function ShareButton({ slug, title }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [canShareFiles, setCanShareFiles] = useState(false);
  const menuId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const files = useRef<Partial<Record<Format, Promise<File>>>>({});

  const shareText = `${title}\n\nRead on Hill Top Hawk`;
  const articleUrl = () => `${window.location.origin}/articles/${slug}`;

  function getFile(format: Format) {
    files.current[format] ??= fetch(`/articles/${slug}/share/${format}`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then((blob) => new File([blob], `hth-${slug}-${format}.png`, { type: "image/png" }))
      .catch((err) => {
        delete files.current[format]; // let the next tap try again
        throw err;
      });
    return files.current[format];
  }

  // Phones that can share images get the Share to Story button, with the
  // story image loaded in the background so the share sheet opens instantly.
  useEffect(() => {
    const probe = new File([""], "probe.png", { type: "image/png" });
    if (!navigator.canShare?.({ files: [probe] })) return;
    setCanShareFiles(true);
    getFile("story").catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!open) return;
    if (canShareFiles) getFile("feed").catch(() => {});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, canShareFiles]);

  async function shareImage(format: Format) {
    setStatus("Making image…");
    try {
      const file = await getFile(format);

      if (navigator.canShare?.({ files: [file] })) {
        setStatus("");
        // Files only: some apps (Instagram among them) drop the image if text is attached too.
        await navigator.share({ files: [file], title: shareText });
        return;
      }

      const href = URL.createObjectURL(file);
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
    { label: "Post on X", href: `https://x.com/intent/post?text=${enc(shareText)}&url=${enc(articleUrl())}` },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(articleUrl())}` },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(articleUrl())}` },
  ];

  return (
    <div className={styles.wrap} ref={wrap}>
      <div className={styles.row}>
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
        {canShareFiles && (
          <button
            type="button"
            className={styles.storyButton}
            onClick={() => {
              setOpen(false);
              shareImage("story");
            }}
          >
            Share to Story
          </button>
        )}
      </div>

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
        </div>
      )}

      {/* Outside the menu so "Couldn't make the image" still shows after Share to Story. */}
      <p className={styles.status} role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
