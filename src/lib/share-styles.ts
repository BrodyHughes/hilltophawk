// The layouts a reader can pick for the 4:5 post share image. Shared by the
// image renderer (server) and the Share panel (browser), so it imports nothing.

export const POST_STYLES = [
  { id: "classic", label: "Classic", note: "Story card with subtitle" },
  { id: "picture", label: "Big Picture", note: "Headline over a large image" },
  { id: "lead", label: "Lead", note: "Full image, caption bar below" },
  { id: "bleed", label: "Full Bleed", note: "Image runs off the edges" },
] as const;

export type PostStyle = (typeof POST_STYLES)[number]["id"];

export const DEFAULT_POST_STYLE: PostStyle = "classic";

export function isPostStyle(value: unknown): value is PostStyle {
  return POST_STYLES.some((s) => s.id === value);
}
