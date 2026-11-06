"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

/**
 * Horizontally scrollable row that can also be dragged with the mouse.
 * Touch devices already scroll natively, so only mouse drags are handled.
 * A drag of more than a few pixels suppresses the click on whatever link
 * the pointer was released over.
 */
export function DragRow({ className = "", children, ...rest }: ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  return (
    <div
      {...rest}
      ref={ref}
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
