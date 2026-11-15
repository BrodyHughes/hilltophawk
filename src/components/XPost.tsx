"use client";

import { useEffect, useRef } from "react";

type Twttr = { widgets?: { load: (el?: Element) => void } };

/**
 * A post from X, rendered by X's own widget script. Until the script runs (or
 * if it's blocked) readers see a plain link to the post.
 */
export function XPost({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const quote = el.querySelector("blockquote");
    if (quote && document.documentElement.dataset.theme === "dark") quote.setAttribute("data-theme", "dark");
    const w = window as unknown as { twttr?: Twttr };
    if (w.twttr?.widgets) {
      w.twttr.widgets.load(el);
      return;
    }
    if (!document.getElementById("x-widgets")) {
      const s = document.createElement("script");
      s.id = "x-widgets";
      s.src = "https://platform.x.com/widgets.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [url]);

  return (
    <div ref={ref}>
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={url}>View this post on X</a>
      </blockquote>
    </div>
  );
}
