import Image, { type ImageProps } from "next/image";
import type { Picture } from "@/lib/content";

/**
 * A cover image that can swap to a separate light-mode version.
 * Both images are in the page; CSS in globals.css hides the one that doesn't
 * match the current theme, so there's no flash when the theme script runs.
 * Covers shown whole (letterboxed) get a paper background in light mode.
 */
export function ThemedImage({ light, style, alt, ...props }: ImageProps & { light?: Picture }) {
  if (!light) return <Image alt={alt} style={style} {...props} />;
  const lightStyle = {
    ...style,
    objectPosition: light.position ?? "center",
    ...(style?.objectFit === "contain" ? { background: "var(--paper)" } : {}),
  };
  return (
    <>
      <Image alt={alt} {...props} style={style} className="theme-dark-img" />
      <Image alt={alt} {...props} src={light.src} style={lightStyle} className="theme-light-img" />
    </>
  );
}
