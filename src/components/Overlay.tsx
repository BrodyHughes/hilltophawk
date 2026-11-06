"use client";

import { useEffect, type ReactNode } from "react";
import styles from "./SiteHeader.module.css";

/** Full-screen overlay (info, collections, search). Closes on Escape or when a link inside is clicked. */
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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={`${styles.overlay} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onClose();
      }}
    >
      <button type="button" onClick={onClose} aria-label="Close" className={styles.overlayClose}>
        &times;
      </button>
      {children}
    </div>
  );
}
