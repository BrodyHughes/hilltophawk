// Turns a pasted link into something the article page can embed.
// Shared by the article renderer; imports nothing.

export type EmbedKind =
  | { kind: "x"; url: string }
  | { kind: "tiktok"; src: string }
  | { kind: "video"; src: string }
  | { kind: "link"; url: string };

export function parseEmbed(raw: string): EmbedKind {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { kind: "link", url: raw };
  }
  const host = u.hostname.replace(/^www\./, "");

  if ((host === "x.com" || host === "twitter.com" || host === "mobile.twitter.com") && /\/status\/\d+/.test(u.pathname)) {
    return { kind: "x", url: `https://x.com${u.pathname}` };
  }

  if (host.endsWith("tiktok.com")) {
    const id = /\/(?:video|player\/v1|embed\/v2)\/(\d+)/.exec(u.pathname)?.[1];
    if (id) return { kind: "tiktok", src: `https://www.tiktok.com/player/v1/${id}?music_info=1&description=1` };
  }

  if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") {
    const id = host === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") ?? /\/(?:embed|shorts)\/([\w-]+)/.exec(u.pathname)?.[1];
    if (id) return { kind: "video", src: `https://www.youtube-nocookie.com/embed/${id}` };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = /(\d+)/.exec(u.pathname)?.[1];
    if (id) return { kind: "video", src: `https://player.vimeo.com/video/${id}` };
  }

  // C-SPAN clips and other JW Player embeds.
  if (host === "cdn.jwplayer.com" && /^\/players\/[\w-]+\.html$/.test(u.pathname)) {
    return { kind: "video", src: `https://cdn.jwplayer.com${u.pathname}` };
  }

  return { kind: "link", url: u.toString() };
}
