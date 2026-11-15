// Share images for Hill Top Hawk as a whole (the site-wide Share button and
// the home page link preview): a poster of the masthead, the tagline and the
// three newest headlines, so the image stays fresh as stories go up.
// next/og only does flexbox, so every box is flex.

import { ImageResponse } from "next/og";
import { type Article, colorFor, getArticles, kickerFor } from "./content";
import { Mark, SHARE_SIZES, type ShareFormat, shareFonts } from "./share-card";
import { siteUrl } from "./site-url";

const INK = "#141413";
const PAPER = "#F5F5F5";
const GREEN = "#4E937A";
const soft = "rgba(245,245,245,.78)";
const dim = "rgba(245,245,245,.5)";
const rule = "rgba(245,245,245,.16)";

const DISPLAY = "Libre Franklin";
const SERIF = "Source Serif 4";
const UI = "Inter";
const MONO = "Source Code Pro";

export const SITE_TAGLINE = "Welcome to the Middle American Freakshow.";

const host = siteUrl.host;
const clip = (t: string, n: number) => (t.length <= n ? t : `${t.slice(0, n).replace(/\s+\S*$/, "")}…`);

function Latest({ articles, k }: { articles: Article[]; k: number }) {
  if (!articles.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", fontFamily: UI, fontWeight: 700, fontSize: 19 * k, letterSpacing: "0.16em", color: dim }}>
        LATEST ATOP THE HILL
      </div>
      {articles.map((a) => (
        <div
          key={a.slug}
          style={{ display: "flex", flexDirection: "column", marginTop: 20 * k, paddingTop: 18 * k, borderTop: `2px solid ${rule}` }}
        >
          <div style={{ display: "flex", fontFamily: UI, fontWeight: 700, fontSize: 17 * k, letterSpacing: "0.14em", color: colorFor(a) }}>
            {kickerFor(a).toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 6 * k, fontFamily: DISPLAY, fontWeight: 900, fontSize: 34 * k, lineHeight: 1.15, color: PAPER }}>
            {clip(a.title, 64)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Poster({ format, articles }: { format: "feed" | "story"; articles: Article[] }) {
  const story = format === "story";
  const k = story ? 1.12 : 1;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: INK,
        backgroundImage: "radial-gradient(circle at 12% 8%, rgba(78,147,122,.38), rgba(20,20,19,0) 55%)",
        color: PAPER,
        // Stories keep clear of the app's top bar and the link sticker area.
        padding: story ? "170px 72px 260px" : "56px 64px 56px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mark size={story ? 64 : 56} />
        <div style={{ display: "flex", fontFamily: MONO, fontWeight: 600, fontSize: 21 * k, letterSpacing: "0.08em", color: dim }}>
          {host.toUpperCase()}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: story ? 90 : 56,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: (story ? 220 : 196),
          lineHeight: 0.86,
          letterSpacing: "-0.02em",
        }}
      >
        <span>HILL</span>
        <span>TOP</span>
        <span style={{ color: GREEN }}>HAWK</span>
      </div>

      <div style={{ display: "flex", marginTop: 30 * k, fontFamily: SERIF, fontStyle: "italic", fontSize: 40 * k, lineHeight: 1.3, color: soft }}>
        {SITE_TAGLINE}
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <Latest articles={articles.slice(0, story ? 3 : 2)} k={k} />

      <div style={{ display: "flex", marginTop: story ? 56 : 40 }}>
        <div
          style={{
            display: "flex",
            padding: `${16 * k}px ${30 * k}px`,
            borderRadius: 999,
            background: GREEN,
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: 22 * k,
            letterSpacing: "0.06em",
            color: PAPER,
          }}
        >
          READ IT AT {host.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function LinkPreview({ articles }: { articles: Article[] }) {
  const a = articles[0];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: INK,
        backgroundImage: "radial-gradient(circle at 10% 10%, rgba(78,147,122,.38), rgba(20,20,19,0) 55%)",
        color: PAPER,
        padding: "48px 56px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
        <Mark size={44} />
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontFamily: DISPLAY, fontWeight: 900, fontSize: 118, lineHeight: 0.86, letterSpacing: "-0.02em" }}>
          <span>HILL</span>
          <span>TOP</span>
          <span style={{ color: GREEN }}>HAWK</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", width: 1200 - 112 - 560, paddingLeft: 36, borderLeft: `2px solid ${rule}` }}>
        <div style={{ display: "flex", fontFamily: SERIF, fontStyle: "italic", fontSize: 30, lineHeight: 1.3, color: soft }}>{SITE_TAGLINE}</div>
        {a && (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
            <div style={{ display: "flex", fontFamily: UI, fontWeight: 700, fontSize: 14, letterSpacing: "0.14em", color: colorFor(a) }}>
              LATEST · {kickerFor(a).toUpperCase()}
            </div>
            <div style={{ display: "flex", marginTop: 6, fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, lineHeight: 1.15 }}>{clip(a.title, 70)}</div>
          </div>
        )}
        <div style={{ display: "flex", marginTop: 26, fontFamily: MONO, fontWeight: 600, fontSize: 17, letterSpacing: "0.08em", color: dim }}>
          {host.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export async function renderSiteImage(format: ShareFormat, headers?: Record<string, string>) {
  const [fonts, articles] = await Promise.all([shareFonts(), getArticles()]);
  const body = format === "og" ? <LinkPreview articles={articles} /> : <Poster format={format} articles={articles} />;
  return new ImageResponse(body, { ...SHARE_SIZES[format], fonts, headers });
}
