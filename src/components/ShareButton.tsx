"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { DEFAULT_POST_STYLE, POST_STYLES, type PostStyle } from "@/lib/share-styles";
import styles from "./ShareButton.module.css";

let canShareFilesCache: boolean | undefined;
function browserCanShareFiles() {
  canShareFilesCache ??= Boolean(
    navigator.canShare?.({ files: [new File([""], "probe.png", { type: "image/png" })] }),
  );
  return canShareFilesCache;
}
const noSubscribe = () => () => {};

type Props = { slug: string; title: string };
type Format = "feed" | "story";

const FORMATS: { id: Format; label: string }[] = [
  { id: "feed", label: "Post · 4:5" },
  { id: "story", label: "Story · 9:16" },
];

/**
 * Share menu for an article: "Share image…" (a panel where readers pick Post or
 * Story and a post style, see a preview, then share or save it), copy link,
 * and X / Facebook / LinkedIn.
 *
 * The previewed image is the exact file that gets shared, already downloaded,
 * because phones only allow the share sheet right after a tap; waiting on a
 * download first can make it refuse to open.
 */
export function ShareButton({ slug, title }: Props) {
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [format, setFormat] = useState<Format>("feed");
  const [postStyle, setPostStyle] = useState<PostStyle>(DEFAULT_POST_STYLE);
  const [preview, setPreview] = useState<{ key: string; url: string } | { key: string; error: true } | null>(null);
  const [status, setStatus] = useState("");
  const [panelStatus, setPanelStatus] = useState("");
  const canShareFiles = useSyncExternalStore(noSubscribe, browserCanShareFiles, () => false);

  const menuId = useId();
  const panelTitleId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shareBtn = useRef<HTMLButtonElement>(null);
  const files = useRef(new Map<string, Promise<File>>());

  const shareText = `${title}\n\nRead on Hill Top Hawk`;
  const articleUrl = () => `${window.location.origin}/articles/${slug}`;

  const keyFor = (f: Format, s: PostStyle) => (f === "story" ? "story" : `feed-${s}`);
  const currentKey = keyFor(format, postStyle);

  function getFile(key: string) {
    let file = files.current.get(key);
    if (!file) {
      const [f, s] = key.split("-");
      const query = f === "feed" && s !== DEFAULT_POST_STYLE ? `?style=${s}` : "";
      file = fetch(`/articles/${slug}/share/${f}${query}`)
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.blob();
        })
        .then((blob) => new File([blob], `hth-${slug}-${key}.png`, { type: "image/png" }))
        .catch((err) => {
          files.current.delete(key); // let the next try fetch again
          throw err;
        });
      files.current.set(key, file);
    }
    return file;
  }

  // Close the menu on outside click / Escape.
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

  // Show / hide the panel as a modal dialog.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (panelOpen && !d.open) {
      d.showModal();
      d.focus(); // start on the panel itself rather than ringing the close button
    }
    if (!panelOpen && d.open) d.close();
  }, [panelOpen]);

  // Load the preview for the current choice. It's the same file Share sends.
  useEffect(() => {
    if (!panelOpen) return;
    let cancelled = false;
    let url: string | undefined;
    getFile(currentKey)
      .then((file) => {
        if (cancelled) return;
        url = URL.createObjectURL(file);
        setPreview({ key: currentKey, url });
      })
      .catch(() => {
        if (!cancelled) setPreview({ key: currentKey, error: true });
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen, currentKey]);

  const ready = preview && preview.key === currentKey ? preview : null;
  const loading = !ready;
  const failed = !!ready && "error" in ready;
  const previewUrl = ready && "url" in ready ? ready.url : undefined;

  function openPanel() {
    setOpen(false);
    setStatus("");
    setPanelStatus("");
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    shareBtn.current?.focus();
  }

  async function shareImage() {
    setPanelStatus("");
    try {
      const file = await getFile(currentKey);
      // Files only: some apps (Instagram among them) drop the image if text is attached too.
      await navigator.share({ files: [file], title: shareText });
    } catch (err) {
      // Closing the share sheet without picking an app isn't an error.
      if (!(err instanceof DOMException && err.name === "AbortError")) setPanelStatus("Couldn't share. Try Save image instead?");
    }
  }

  async function saveImage() {
    setPanelStatus("");
    try {
      const file = await getFile(currentKey);
      const href = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = href;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
      setPanelStatus("Image saved.");
    } catch {
      setPanelStatus("Couldn't make the image. Try again?");
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
      <button
        ref={shareBtn}
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
            <button type="button" className={styles.item} onClick={openPanel}>
              <span className={styles.itemLabel}>Share image…</span>
              <span className={styles.itemNote}>post or story</span>
            </button>
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

      <p className={styles.status} role="status" aria-live="polite">
        {status}
      </p>

      <dialog
        ref={dialog}
        tabIndex={-1}
        className={styles.panel}
        aria-labelledby={panelTitleId}
        onClose={() => setPanelOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) closePanel(); // click on the dimmed backdrop
        }}
      >
        <div className={styles.panelHead}>
          <h2 id={panelTitleId} className={styles.panelTitle}>
            Share image
          </h2>
          <button type="button" className={styles.close} onClick={closePanel} aria-label="Close">
            ×
          </button>
        </div>

        <fieldset className={styles.choices}>
          <legend className={styles.srOnly}>Size</legend>
          {FORMATS.map((f) => (
            <label key={f.id} className={styles.choice}>
              <input type="radio" name="hth-share-format" checked={format === f.id} onChange={() => setFormat(f.id)} />
              <span>{f.label}</span>
            </label>
          ))}
        </fieldset>

        {format === "feed" && (
          <fieldset className={styles.choices}>
            <legend className={styles.srOnly}>Style</legend>
            {POST_STYLES.map((s) => (
              <label key={s.id} className={styles.choice} title={s.note}>
                <input type="radio" name="hth-share-style" checked={postStyle === s.id} onChange={() => setPostStyle(s.id)} />
                <span>{s.label}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className={`${styles.preview} ${format === "story" ? styles.previewStory : styles.previewPost}`}>
          {loading && <p className={styles.previewNote}>Making image…</p>}
          {failed && <p className={styles.previewNote}>Couldn&rsquo;t make this one. Try another style?</p>}
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`Preview of the ${format === "story" ? "story" : "post"} image`}
              className={styles.previewImg}
            />
          )}
        </div>

        <div className={styles.actions}>
          {canShareFiles && (
            <button type="button" className={styles.primary} onClick={shareImage} disabled={failed}>
              Share
            </button>
          )}
          <button
            type="button"
            className={canShareFiles ? styles.secondary : styles.primary}
            onClick={saveImage}
            disabled={failed}
          >
            Save image
          </button>
        </div>
        <p className={styles.panelStatus} role="status" aria-live="polite">
          {panelStatus}
        </p>
      </dialog>
    </div>
  );
}
