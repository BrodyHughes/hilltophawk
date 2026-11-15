import Image from "next/image";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { XPost } from "@/components/XPost";
import { parseEmbed } from "@/lib/embeds";
import { urlFor } from "@/sanity/lib/image";
import styles from "./ArticleBody.module.css";

type InlineImage = {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
};

type PullQuote = { text: string; attribution?: string };

type Embed = { url?: string; caption?: string };

function EmbedBlock({ value }: { value: Embed }) {
  if (!value.url) return null;
  const e = parseEmbed(value.url);
  let inner;
  if (e.kind === "x") inner = <XPost url={e.url} />;
  else if (e.kind === "tiktok")
    inner = (
      <div className={styles.tiktok}>
        <iframe src={e.src} title="TikTok video" loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  else if (e.kind === "video")
    inner = (
      <div className={styles.video}>
        <iframe src={e.src} title={value.caption ?? "Video"} loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  else
    inner = (
      <a href={e.url} className={styles.link} target="_blank" rel="noopener noreferrer">
        {e.url}
      </a>
    );
  return (
    <figure className={styles.embed}>
      {inner}
      {value.caption && <figcaption className={styles.caption}>{value.caption}</figcaption>}
    </figure>
  );
}

const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => <blockquote className={styles.quote}>{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:/.test(href);
      return (
        <a href={href} className={styles.link} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    inlineImage: ({ value }: { value: InlineImage }) => {
      if (!value.asset) return null;
      // Asset refs encode the original size: image-<id>-<width>x<height>-<ext>
      const [, w = "1800", h = "1200"] = /-(\d+)x(\d+)-/.exec(value.asset._ref) ?? [];
      return (
        <figure className={styles.figure}>
          <Image
            src={urlFor(value).width(1800).fit("max").auto("format").url()}
            alt={value.alt ?? ""}
            width={Number(w)}
            height={Number(h)}
            sizes="(max-width: 760px) 100vw, 720px"
            style={{ width: "100%", height: "auto" }}
          />
          {value.caption && <figcaption className={styles.caption}>{value.caption}</figcaption>}
        </figure>
      );
    },
    embed: EmbedBlock,
    pullQuote: ({ value }: { value: PullQuote }) => (
      <figure className={styles.pullQuote}>
        <blockquote>“{value.text}”</blockquote>
        {value.attribution && <figcaption>— {value.attribution}</figcaption>}
      </figure>
    ),
  },
};

/** Renders an article's rich-text body from Sanity. */
export function ArticleBody({ value, className }: { value: PortableTextBlock[]; className?: string }) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
