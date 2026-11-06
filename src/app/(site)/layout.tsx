import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { articleHref, getActiveCollections, getActiveTags, getArticles, kickerFor } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
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
    <>
      <SiteHeader collections={collections} tags={tags} searchIndex={searchIndex} />
      {children}
      <SiteFooter />
    </>
  );
}
