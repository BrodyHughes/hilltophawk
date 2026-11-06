"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Collection, Tag } from "@/lib/content";
import { Clock } from "./Clock";
import { DragRow } from "./DragRow";
import { Masthead } from "./Masthead";
import { Overlay } from "./Overlay";
import styles from "./SiteHeader.module.css";

type SearchEntry = { title: string; kicker: string; href: string };
type OpenOverlay = "info" | "collections" | "search" | null;

export function SiteHeader({
  collections,
  tags,
  searchIndex,
}: {
  collections: Collection[];
  tags: Tag[];
  searchIndex: SearchEntry[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenOverlay>(null);
  const close = useCallback(() => setOpen(null), []);

  // Close any overlay when a link inside it navigates somewhere.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  // The radio page uses a smaller masthead so the player sits above the fold.
  const compact = pathname === "/radio";

  return (
    <header>
      <div className={`${styles.top} ${compact ? styles.topCompact : ""}`}>
        <Link href="/" className={styles.mastheadLink}>
          <Masthead compact={compact} />
        </Link>
        <Clock className={`${styles.clock} ${compact ? styles.clockCompact : ""}`} />
      </div>

      <div className={`${styles.navWrap} ${compact ? styles.navWrapCompact : ""}`}>
        <nav className={styles.nav} aria-label="Main">
          <div className={styles.navItems}>
            <Link href="/" className={styles.navItem} aria-current={pathname === "/" ? "page" : undefined}>
              All
            </Link>
            {collections.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className={styles.navItem}
                aria-current={pathname === `/${c.slug}` ? "page" : undefined}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className={styles.navDivider} />

          <DragRow className={styles.tagRail}>
            {tags.map((t) => (
              <Link key={t.slug} href={`/tag/${t.slug}`} className={styles.tagChip} draggable={false}>
                #{t.name}
              </Link>
            ))}
            <button type="button" onClick={() => setOpen("collections")} className={styles.allTagsBtn}>
              All Collections &amp; Tags &rarr;
            </button>
          </DragRow>

          <button type="button" onClick={() => setOpen("info")} aria-label="About Hill Top Hawk" className={styles.infoBtn}>
            i
          </button>
          <ThemeToggle />
          <button type="button" onClick={() => setOpen("search")} aria-label="Search" className={styles.searchBtn}>
            <span className={styles.searchIcon} />
          </button>
        </nav>
      </div>

      {open === "info" && (
        <Overlay onClose={close} label="About Hill Top Hawk">
          <div className={styles.overlayBody} style={{ maxWidth: 620 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>About</div>
            <h2 className={styles.overlayTitle}>What is Hill Top Hawk?</h2>
            <p className={styles.overlayText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat.
            </p>
            <p className={styles.overlayText}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
          </div>
        </Overlay>
      )}

      {open === "collections" && (
        <Overlay onClose={close} label="All collections and tags">
          <div className={styles.overlayBody} style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Browse</div>
            <h2 className={styles.overlayTitle} style={{ marginBottom: 28 }}>All Collections &amp; Tags</h2>

            <div className="eyebrow" style={{ marginBottom: 12, letterSpacing: ".12em" }}>Main Collections</div>
            <div className={styles.collectionPills}>
              <Link href="/" className={styles.collectionPill}>All</Link>
              {collections.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className={styles.collectionPill}>
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="eyebrow" style={{ marginBottom: 12, letterSpacing: ".12em" }}>Tags</div>
            <div className={styles.tagList}>
              {tags.map((t) => (
                <Link key={t.slug} href={`/tag/${t.slug}`} className={styles.tagListItem}>
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>
        </Overlay>
      )}

      {open === "search" && <SearchOverlay onClose={close} index={searchIndex} />}
    </header>
  );
}

function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme !== "dark";
    if (dark) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem("hth-dark-mode", dark ? "1" : "0");
    } catch {}
  };

  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode" className={styles.themeToggle}>
      <span className={styles.themeKnob} />
    </button>
  );
}

function SearchOverlay({ onClose, index }: { onClose: () => void; index: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q ? index.filter((e) => `${e.title} ${e.kicker}`.toLowerCase().includes(q)).slice(0, 8) : [];

  useEffect(() => {
    document.getElementById("hth-search")?.focus();
  }, []);

  return (
    <Overlay onClose={onClose} label="Search" className={styles.searchOverlay}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={styles.searchInner}>
        <label htmlFor="hth-search" className={styles.searchLabel}>Search Hill Top Hawk</label>
        <input
          id="hth-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Squawk"
          autoComplete="off"
          className={styles.searchInput}
        />
        {q && (
          <ul className={styles.searchResults}>
            {results.length === 0 && <li className={styles.searchEmpty}>Nothing atop the hill for that.</li>}
            {results.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={styles.searchResult}>
                  <span className={styles.searchResultKicker}>{r.kicker}</span>
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Overlay>
  );
}
