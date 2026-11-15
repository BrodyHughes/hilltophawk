// Share images for the Senate leader whip count (/whip-count): the feed post,
// the Story, and the link preview. Same renderer and fonts as the article
// cards (share-card.tsx); next/og only does flexbox, so every box is flex.

import { ImageResponse } from "next/og";
import { Mark, SHARE_SIZES, type ShareFormat, shareFonts } from "./share-card";
import { siteUrl } from "./site-url";
import { NEEDED, tally, UPDATED, VOTE_DATE_LABEL, WHIP_CTA } from "./whip-count";

const INK = "#141413";
const PAPER = "#F5F5F5";
const BLUE = "#226CE0";
const GREEN = "#4E937A";
const GOLD = "#FFB100";
const dim = "rgba(245,245,245,.55)";
const soft = "rgba(245,245,245,.8)";

const DISPLAY = "Libre Franklin";
const UI = "Inter";
const MONO = "Source Code Pro";

const link = `${siteUrl.host}/whip-count`;

function Bar({ height, width }: { height: number; width: number }) {
  const t = tally();
  const seg = (n: number) => Math.round((n / t.total) * width);
  return (
    <div style={{ display: "flex", position: "relative", width, height, border: "2px solid rgba(245,245,245,.6)", borderRadius: 4 }}>
      <div style={{ display: "flex", width: seg(t.S), height: "100%", background: BLUE }} />
      <div style={{ display: "flex", width: seg(t.U), height: "100%", background: GOLD }} />
      <div style={{ display: "flex", width: seg(t.N), height: "100%", background: "rgba(245,245,245,.22)" }} />
      <div style={{ display: "flex", flexGrow: 1, height: "100%", background: GREEN }} />
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -14,
          bottom: -14,
          left: Math.round((NEEDED / t.total) * width) - 3,
          width: 6,
          background: PAPER,
        }}
      />
    </div>
  );
}

function Side({ label, value, color, note, align, size }: { label: string; value: number; color: string; note: string; align: "left" | "right"; size: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "flex-end" }}>
      <div style={{ display: "flex", fontFamily: DISPLAY, fontWeight: 900, fontSize: size * 0.3, textTransform: "uppercase", color }}>{label}</div>
      <div style={{ display: "flex", fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 0.95, color }}>{value}</div>
      <div style={{ display: "flex", fontFamily: MONO, fontWeight: 500, fontSize: size * 0.17, color: dim }}>{note}</div>
    </div>
  );
}

function Poster({ format }: { format: "feed" | "story" }) {
  const story = format === "story";
  const { width } = SHARE_SIZES[format];
  const pad = story ? 72 : 64;
  const inner = width - pad * 2;
  const t = tally();
  const k = story ? 1.1 : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: INK,
        color: PAPER,
        // Stories keep clear of the app's top bar and the link sticker area.
        padding: story ? `170px ${pad}px 260px` : `56px ${pad}px 52px`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mark size={story ? 64 : 56} />
        <div style={{ display: "flex", fontFamily: MONO, fontWeight: 600, fontSize: 22 * k, letterSpacing: "0.08em", color: GOLD }}>
          SECRET BALLOT · {VOTE_DATE_LABEL.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: story ? 70 : 48 }}>
        <div style={{ display: "flex", fontFamily: UI, fontWeight: 700, fontSize: 22 * k, letterSpacing: "0.14em", color: dim }}>
          SENATE DEMOCRATIC LEADER
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 14, fontFamily: DISPLAY, fontWeight: 900, fontSize: 104 * k, lineHeight: 0.98, letterSpacing: "-0.01em" }}>
          <span>SCHUMER VS.</span>
          <span>VAN HOLLEN</span>
        </div>
        <div style={{ display: "flex", marginTop: 12, fontFamily: DISPLAY, fontWeight: 900, fontSize: 44 * k, color: soft }}>
          THE WHIP COUNT
        </div>
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: inner }}>
        <Side label="Schumer" value={t.S} color={BLUE} note="public backers" align="left" size={190 * k} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 30 }}>
          <div style={{ display: "flex", fontFamily: DISPLAY, fontWeight: 900, fontSize: 64 * k }}>{NEEDED}</div>
          <div style={{ display: "flex", fontFamily: MONO, fontWeight: 500, fontSize: 20 * k, color: dim }}>TO WIN</div>
        </div>
        <Side label="Van Hollen" value={t.V} color={GREEN} note="his camp" align="right" size={190 * k} />
      </div>

      <div style={{ display: "flex", marginTop: 34 }}>
        <Bar width={inner} height={story ? 58 : 50} />
      </div>
      <div style={{ display: "flex", marginTop: 26, gap: 30, fontFamily: MONO, fontWeight: 500, fontSize: 24 * k, color: soft }}>
        <span style={{ color: GOLD }}>{t.U} undecided</span>
        <span>{t.N} no statement</span>
      </div>

      <div style={{ display: "flex", flexGrow: 1 }} />

      <div
        style={{
          display: "flex",
          background: GOLD,
          color: INK,
          borderRadius: 6,
          padding: story ? "30px 34px" : "24px 30px",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 44 * k,
          lineHeight: 1.12,
          textTransform: "uppercase",
        }}
      >
        {WHIP_CTA}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: MONO, fontWeight: 600, fontSize: 21 * k, letterSpacing: "0.06em", color: dim }}>
        <span>UPDATED {UPDATED.toUpperCase()}</span>
        <span>{link.toUpperCase()}</span>
      </div>
    </div>
  );
}

function LinkPreview() {
  const t = tally();
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: INK, color: PAPER, padding: "44px 56px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mark size={44} />
        <div style={{ display: "flex", fontFamily: MONO, fontWeight: 600, fontSize: 18, letterSpacing: "0.08em", color: GOLD }}>
          SECRET BALLOT · {VOTE_DATE_LABEL.toUpperCase()}
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 26, fontFamily: DISPLAY, fontWeight: 900, fontSize: 68, lineHeight: 1 }}>
        SCHUMER VS. VAN HOLLEN
      </div>
      <div style={{ display: "flex", flexGrow: 1 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: 1088 }}>
        <Side label="Schumer" value={t.S} color={BLUE} note="public backers" align="left" size={120} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 18 }}>
          <div style={{ display: "flex", fontFamily: DISPLAY, fontWeight: 900, fontSize: 44 }}>{NEEDED}</div>
          <div style={{ display: "flex", fontFamily: MONO, fontWeight: 500, fontSize: 15, color: dim }}>TO WIN · {t.U} UNDECIDED</div>
        </div>
        <Side label="Van Hollen" value={t.V} color={GREEN} note="his camp" align="right" size={120} />
      </div>
      <div style={{ display: "flex", marginTop: 22 }}>
        <Bar width={1088} height={36} />
      </div>
    </div>
  );
}

export async function renderWhipCountImage(format: ShareFormat, headers?: Record<string, string>) {
  const fonts = await shareFonts();
  const body = format === "og" ? <LinkPreview /> : <Poster format={format} />;
  return new ImageResponse(body, { ...SHARE_SIZES[format], fonts, headers });
}
