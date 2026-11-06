import type { Metadata } from "next";
import { Inter, Libre_Franklin, Source_Code_Pro, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getActiveCollections, getActiveTags, getArticles, kickerFor, articleHref } from "@/lib/content";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Hill Top Hawk",
    template: "%s · Hill Top Hawk",
  },
  description: "Welcome to the Middle American Freakshow.",
};

// Runs before first paint so dark mode doesn't flash light on load.
const themeScript = `try{if(localStorage.getItem('hth-dark-mode')==='1')document.documentElement.dataset.theme='dark'}catch(e){}`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [collections, tags, articles] = await Promise.all([
    getActiveCollections(),
    getActiveTags(),
    getArticles(),
  ]);

  const searchIndex = articles.map((a) => ({
    title: a.title,
    kicker: kickerFor(a),
    href: articleHref(a.slug),
  }));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${libreFranklin.variable} ${sourceSerif.variable} ${inter.variable} ${sourceCodePro.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader collections={collections} tags={tags} searchIndex={searchIndex} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
