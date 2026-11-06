import type { Metadata } from "next";
import { RadioPlayer } from "@/components/RadioPlayer";
import { getEpisodes } from "@/lib/content";

export const metadata: Metadata = { title: "HTH Radio" };

export default async function RadioPage() {
  const episodes = await getEpisodes();

  return (
    <main style={{ paddingBottom: 40 }}>
      <div className="container" style={{ paddingBottom: 8 }}>
        <div className="kicker" style={{ color: "var(--gold)", letterSpacing: ".14em", marginBottom: 4 }}>Audio</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(20px,3vw,30px)",
            lineHeight: 1,
            margin: 0,
          }}
        >
          HTH Radio
        </h1>
      </div>
      {episodes.length > 0 ? (
        <RadioPlayer episodes={episodes} />
      ) : (
        <p className="container dek">No episodes yet.</p>
      )}
    </main>
  );
}
