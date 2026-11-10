"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import styles from "./SiteHeader.module.css";

/** How long the closing fade runs; matches .overlayClosing in SiteHeader.module.css. */
const CLOSE_MS = 220;

/**
 * Full-screen overlay (info, collections, search). Fades in, and fades out
 * before unmounting. Closes on Escape, the close button, or when a link inside
 * is clicked.
 */
export function Overlay({
  onClose,
  label,
  className = "",
  children,
}: {
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    // With reduced motion there is no fade to wait for.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) onClose();
    else setClosing(true);
  }, [onClose]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(onClose, CLOSE_MS);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ""} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) requestClose();
      }}
    >
      <button type="button" onClick={requestClose} aria-label="Close" className={styles.overlayClose}>
        &times;
      </button>
      {children}
    </div>
  );
}
