"use client";

import { useSyncExternalStore } from "react";
import styles from "./StoryCards.module.css";

/** How long a story wears the "New" label after its publish date. */
const NEW_FOR_DAYS = 5;

const noSubscribe = () => () => {};

/**
 * "New" label for stories published in the last five days. Worked out in the
 * reader's browser (pages are cached, so the server can't know today's date),
 * so it appears just after the page loads.
 */
export function NewBadge({ date, size = "sm" }: { date: string; size?: "sm" | "lg" }) {
  const isNew = useSyncExternalStore(
    noSubscribe,
    () => {
      const start = new Date(`${date}T00:00:00`).getTime();
      return Number.isFinite(start) && Date.now() < start + NEW_FOR_DAYS * 86_400_000;
    },
    () => false,
  );
  if (!isNew) return null;
  return (
    <span className={`${styles.newBadge} ${size === "lg" ? styles.newBadgeLg : ""}`} data-new>
      New
      <i aria-hidden="true">*</i>
    </span>
  );
}
