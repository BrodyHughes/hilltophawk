// Share images: the "hth*" story cards people post to social media, plus the
// link preview (Open Graph) card. Rendered to PNG with next/og, which supports
// flexbox and a subset of CSS only (no grid, no box-decoration-break), so the
// layout here is plain flex and the headline is laid out word by word.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ShareArticle } from "./content";
import { siteUrl } from "./site-url";

export type ShareFormat = "feed" | "story" | "og";

export const SHARE_SIZES: Record<ShareFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1350 }, // Instagram / Facebook feed, 4:5
  story: { width: 1080, height: 1920 }, // Stories / Reels, 9:16
  og: { width: 1200, height: 630 }, // link previews
};

const INK = "#141413";
const CARD = "#1C1C1B";
const FRAME = "#262624";
const PAPER = "#F5F5F5";
const soft = "rgba(245,245,245,.75)";
const dim = "rgba(245,245,245,.55)";

const DISPLAY = "Libre Franklin";
const SERIF = "Source Serif 4";
const UI = "Inter";
const MONO = "Source Code Pro";

const fontDir = join(process.cwd(), "assets/share-fonts");
const fontsPromise = Promise.all([
  readFile(join(fontDir, "LibreFranklin-Black.woff")),
  readFile(join(fontDir, "SourceSerif4-Italic.woff")),
  readFile(join(fontDir, "Inter-Bold.woff")),
  readFile(join(fontDir, "SourceCodePro-Medium.woff")),
  readFile(join(fontDir, "SourceCodePro-SemiBold.woff")),
]).then(([franklin, serif, inter, mono, monoBold]) => [
  { name: DISPLAY, data: franklin, weight: 900 as const, style: "normal" as const },
  { name: SERIF, data: serif, weight: 400 as const, style: "italic" as const },
  { name: UI, data: inter, weight: 700 as const, style: "normal" as const },
  { name: MONO, data: mono, weight: 500 as const, style: "normal" as const },
  { name: MONO, data: monoBold, weight: 600 as const, style: "normal" as const },
]);

const siteHost = siteUrl.host;

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Mark({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: "-0.015em", color: PAPER }}>
      <span>hth</span>
      {/* The mark is always one color: hth and * together. */}
      <span>*</span>
    </div>
  );
}

function Pills({ article, size }: { article: ShareArticle; size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          display: "flex",
          padding: `${Math.round(size * 0.5)}px ${Math.round(size * 1.1)}px`,
          borderRadius: 999,
          border: `3px solid ${article.color}`,
          fontFamily: UI,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: PAPER,
        }}
      >
        {article.kicker}
      </div>
      {article.tags.slice(0, 2).map((tag) => (
        <div
          key={tag}
          style={{
            display: "flex",
            padding: `${Math.round(size * 0.5)}px ${Math.round(size * 1.1)}px`,
            borderRadius: 999,
            border: "2px solid rgba(78,147,122,.55)",
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: size * 1.1,
            color: soft,
          }}
        >
          #{tag}
        </div>
      ))}
    </div>
  );
}

/** Split the headline into words, marking the ones inside the highlight. */
function headlineWords(title: string, highlight?: string) {
  const words = (text: string, hl: boolean) =>
    text.split(/\s+/).filter(Boolean).map((text) => ({ text, hl }));
  const at = highlight ? title.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (!highlight || at < 0) return words(title, false);
  return [
    ...words(title.slice(0, at), false),
    ...words(title.slice(at, at + highlight.length), true),
    ...words(title.slice(at + highlight.length), false),
  ];
}

function headlineSize(title: string, base: number) {
  const n = title.length;
  if (n <= 24) return base * 1.45;
  if (n <= 50) return base * 1.2;
  if (n <= 90) return base;
  return base * 0.84;
}

function Headline({ article, size }: { article: ShareArticle; size: number }) {
  const words = headlineWords(article.title, article.highlight);
  const gap = Math.round(size * 0.26);
  const pad = Math.round(size * 0.1);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: "-0.01em",
        color: PAPER,
      }}
    >
      {words.map((w, i) => {
        const prevHl = words[i - 1]?.hl;
        const nextHl = words[i + 1]?.hl;
        if (!w.hl) return <span key={i} style={{ marginRight: gap }}>{w.text}</span>;
        // A highlighted run is drawn as touching boxes so it reads as one mark.
        return (
          <span
            key={i}
            style={{
              background: "rgba(78,147,122,.55)",
              paddingLeft: prevHl ? 0 : pad,
              paddingRight: nextHl ? gap : pad,
              marginLeft: prevHl ? 0 : -pad,
              marginRight: nextHl ? 0 : gap - pad,
              borderTopLeftRadius: prevHl ? 0 : pad,
              borderBottomLeftRadius: prevHl ? 0 : pad,
              borderTopRightRadius: nextHl ? 0 : pad,
              borderBottomRightRadius: nextHl ? 0 : pad,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
}

function clip(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function Cover({ src }: { src?: string }) {
  return (
    <div style={{ display: "flex", flexGrow: 1, minHeight: 0, position: "relative", background: FRAME }}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={src} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layouts
// ---------------------------------------------------------------------------

function Vertical({ article, format }: { article: ShareArticle; format: "feed" | "story" }) {
  const story = format === "story";
  const s = story ? 1.12 : 1;
  const { width } = SHARE_SIZES[format];
  const sidePad = 48;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: INK,
        // Stories keep clear of the app's top bar and the link sticker area.
        padding: story ? `170px ${sidePad}px 260px` : `44px ${sidePad}px 40px`,
      }}
    >
      <Mark size={story ? 68 : 60} />
      <div
        style={{
          marginTop: story ? 36 : 28,
          alignSelf: "stretch",
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: story ? 26 : 24,
          overflow: "hidden",
          background: CARD,
          border: "2px solid rgba(245,245,245,.14)",
        }}
      >
        <Cover src={article.image(width - sidePad * 2 - 4, story ? 900 : 640)} />
        <div style={{ display: "flex", flexDirection: "column", padding: story ? "42px 48px 48px" : "36px 44px 42px" }}>
          <Pills article={article} size={Math.round(20 * s)} />
          <div style={{ display: "flex", marginTop: Math.round(26 * s) }}>
            <Headline article={article} size={Math.round(headlineSize(article.title, 64) * s)} />
          </div>
          {article.dek && (
            <div style={{ display: "flex", marginTop: Math.round(18 * s), fontFamily: SERIF, fontStyle: "italic", fontSize: Math.round(32 * s), lineHeight: 1.4, color: soft }}>
              {clip(article.dek, 170)}
            </div>
          )}
          <div style={{ display: "flex", marginTop: Math.round(20 * s), fontFamily: MONO, fontWeight: 500, fontSize: Math.round(22 * s), letterSpacing: "0.04em", color: dim }}>
            By {article.author}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: story ? 34 : 26, fontFamily: MONO, fontWeight: 600, fontSize: story ? 24 : 22, letterSpacing: "0.08em", textTransform: "uppercase", color: dim }}>
        Read it at {siteHost}
      </div>
    </div>
  );
}

function LinkPreview({ article }: { article: ShareArticle }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: INK, padding: 36 }}>
      <div
        style={{
          width: 1200 - 72,
          display: "flex",
          borderRadius: 22,
          overflow: "hidden",
          background: CARD,
          border: "2px solid rgba(245,245,245,.14)",
        }}
      >
        <div style={{ display: "flex", width: 470, flexShrink: 0 }}>
          <Cover src={article.image(470, 554)} />
        </div>
        {/* Explicit width: the renderer won't shrink a wrapping flex column on its own. */}
        <div style={{ display: "flex", flexDirection: "column", width: 1200 - 72 - 4 - 470, padding: "36px 40px 36px" }}>
          <Mark size={40} />
          <div style={{ display: "flex", flexGrow: 1 }} />
          <Pills article={article} size={16} />
          <div style={{ display: "flex", marginTop: 20, width: "100%" }}>
            <Headline article={article} size={Math.round(headlineSize(article.title, 40))} />
          </div>
          <div style={{ display: "flex", marginTop: 18, fontFamily: MONO, fontWeight: 500, fontSize: 17, letterSpacing: "0.04em", color: dim }}>
            By {article.author} · {siteHost}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export async function renderShareImage(article: ShareArticle, format: ShareFormat, headers?: Record<string, string>) {
  const fonts = await fontsPromise;
  return new ImageResponse(
    format === "og" ? <LinkPreview article={article} /> : <Vertical article={article} format={format} />,
    { ...SHARE_SIZES[format], fonts, headers },
  );
}
