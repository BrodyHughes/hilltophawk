"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

const HINT_KEY = "hth-swipe-hint";

/**
 * Horizontally scrollable row that can also be dragged with the mouse.
 * Touch devices already scroll natively, so only mouse drags are handled.
 * A drag of more than a few pixels suppresses the click on whatever link
 * the pointer was released over.
 *
 * `fade`: soften whichever edge has more content past it, so a clipped item
 *   reads as "keeps going" rather than a layout bug (see .drag-row[data-fade]).
 * `hint`: once per visit, if the row overflows, glide it a little and back so
 *   people see it swipes. Skipped with reduced motion.
 */
export function DragRow({
  className = "",
  children,
  fade = false,
  hint = false,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { fade?: boolean; hint?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  // Track which edges have more content beyond them.
  useEffect(() => {
    const el = ref.current;
    if (!el || !fade) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      el.toggleAttribute("data-more-left", el.scrollLeft > 2);
      el.toggleAttribute("data-more-right", el.scrollLeft < max - 2);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [fade]);

  // One gentle peek per visit.
  useEffect(() => {
    const el = ref.current;
    if (!el || !hint) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem(HINT_KEY)) return;
    } catch {}
    let back: number | undefined;
    const start = window.setTimeout(() => {
      if (el.scrollWidth - el.clientWidth < 12 || el.scrollLeft > 0) return;
      try {
        sessionStorage.setItem(HINT_KEY, "1");
      } catch {}
      el.scrollTo({ left: Math.min(48, el.scrollWidth - el.clientWidth), behavior: "smooth" });
      back = window.setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 700);
    }, 1100);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(back);
    };
  }, [hint]);

  return (
    <div
      {...rest}
      ref={ref}
      data-fade={fade ? "" : undefined}
      className={`drag-row ${dragging ? "dragging" : ""} ${className}`}
      onMouseDown={(e) => {
        const el = ref.current;
        if (!el || e.button !== 0) return;
        drag.current = { active: true, startX: e.pageX, startScroll: el.scrollLeft, moved: false };
      }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || !drag.current.active) return;
        const walk = (e.pageX - drag.current.startX) * 1.2;
        if (!drag.current.moved && Math.abs(walk) > 4) {
          drag.current.moved = true;
          setDragging(true);
        }
        if (drag.current.moved) {
          e.preventDefault();
          el.scrollLeft = drag.current.startScroll - walk;
        }
      }}
      onMouseUp={() => {
        drag.current.active = false;
        setDragging(false);
      }}
      onMouseLeave={() => {
        drag.current.active = false;
        setDragging(false);
      }}
      onClickCapture={(e) => {
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }
      }}
    >
      {children}
    </div>
  );
}
