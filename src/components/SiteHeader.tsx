"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
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
  // This component deliberately doesn't read the URL: with Cache Components,
  // usePathname() in a shared layout must sit inside <Suspense> (see NavLink).
  // The radio page's compact masthead is handled in CSS via [data-compact-header].
  const [open, setOpen] = useState<OpenOverlay>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <header>
      <div className={styles.top}>
        <Link href="/" className={styles.mastheadLink}>
          <Masthead />
        </Link>
        <Clock className={styles.clock} />
      </div>

      <div className={styles.navWrap}>
        <nav className={styles.nav} aria-label="Main">
          <div className={styles.navItems}>
            <NavLink href="/">All</NavLink>
            {collections.map((c) => (
              <NavLink key={c.slug} href={`/${c.slug}`}>
                {c.name}
              </NavLink>
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
          <button type="button" onClick={() => setOpen("search")} className={styles.searchBtn}>
            <span className={styles.searchIcon} aria-hidden="true" />
            <span className={styles.searchText}>Search</span>
          </button>
        </nav>
      </div>

      {open === "info" && (
        <Overlay onClose={close} label="About Hill Top Hawk">
          <div className={styles.overlayBody} style={{ maxWidth: 620 }}>
            <h2 className={styles.aboutMasthead}>
              <Masthead className={styles.mastheadLarge} />
            </h2>
            <p className={styles.overlayText}>
              Hill Top Hawk is a publication and the headline piece therein. It is a cult and a human interest story.
              It is a disciplined left wing militia in cahoots with organized crime all around the western hemisphere.
              It also likes watching basketball.
            </p>
            <p className={styles.overlayText}>The Hawk, as it&rsquo;s colloquially known, is carrying the flame every day.</p>
            <p className={styles.overlayText}>Read Hill Top Hawk, thanks.</p>
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

/** Nav link that highlights itself on the current page. Only the URL read suspends. */
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const plain = (
    <Link href={href} className={styles.navItem}>
      {children}
    </Link>
  );
  return (
    <Suspense fallback={plain}>
      <ActiveNavLink href={href}>{children}</ActiveNavLink>
    </Suspense>
  );
}

function ActiveNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href={href} className={styles.navItem} aria-current={pathname === href ? "page" : undefined}>
      {children}
    </Link>
  );
}

let themeSwitchTimer: number | undefined;

function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    // Fade the page's colors into the new theme instead of snapping (see
    // .theme-switching in globals.css). Skipped for reduced motion.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-switching");
      window.clearTimeout(themeSwitchTimer);
      themeSwitchTimer = window.setTimeout(() => root.classList.remove("theme-switching"), 450);
    }
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
