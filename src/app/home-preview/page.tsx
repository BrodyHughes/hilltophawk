// SCRATCH — not committed. Homepage layout with 30 made-up stories.
import { DragRow } from "@/components/DragRow";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { GridCard, LeadCard, RailCard, SecondaryCard, TallCard } from "@/components/StoryCards";
import { WhipCountHome } from "@/components/WhipCountHome";
import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, type Article, type RadioEpisode } from "@/lib/content";
import styles from "../(site)/home.module.css";

const IMGS = ["/images/usa2k28/cover-wide.jpg", "/images/fill-biplane.jpg", "/images/fill-rain.jpg", "/images/hero-ae-crop.jpg", "/images/fill-guerrilla.jpg", "/images/fill-profits2.jpg", "/images/fill-out-comic.jpg", "/images/card-ftb.png", "/images/fill-ae-quote.jpg", "/images/fill-profits3.jpg", "/images/card-fiction-mad.png", "/images/card-fiction-profits.png"];
const STORIES: [string, string, string][] = [
  ["USA 2K28", "politics", "The NBA2Kfication of the 2028 Presidential election! Ten likely candidates, ranked."],
  ["14 Hours In Des Moines With Uncle Tooth", "mafs", "14 hours in a previously unexplored portion of the Middle American Freakshow."],
  ["Let Us Eat Cake", "politics", "A generational change election must be followed by... change."],
  ["The Last Good Diner on Highway 412", "culture", "Biscuits, gravy and a waitress who has seen it all."],
  ["Razorbacks, Reconsidered", "sports", "What a rebuilding year looks like from Section 112."],
  ["A Walmart Distribution Center Love Story", "mafs", "Forklifts, fluorescent light and one very long night shift."],
  ["Who Runs the County Fair?", "politics", "Following the money behind the funnel cakes."],
  ["Gravel Grinders of the Ozarks", "sports", "Two hundred miles, one flat, zero regrets."],
  ["The Mall Walkers of Rogers, Arkansas", "culture", "Dawn patrol at a dying shopping center."],
  ["Fiction Friday: The Hollow Water Tower", "special", "A short story about a town that forgot to leave."],
  ["Notes From a School Board Meeting", "politics", "Democracy happens in a folding chair under fluorescent light."],
  ["The Gospel of Gas Station Pizza", "mafs", "Ranking every slice between here and Tulsa."],
  ["Bass Pro Shops Is a Cathedral", "culture", "A pilgrimage to the pyramid in Memphis."],
  ["Mets Fan in Exile", "sports", "Rooting for New York from the bottom of the Bible Belt."],
  ["The Radio Hour, Transcribed", "special", "An evening of call-ins, confessions and one broken mic."],
  ["What the Farm Bill Means for Your Groceries", "politics", "Plain-English notes on a thousand-page law."],
  ["Kayak Season", "culture", "Floating the Buffalo River with strangers."],
  ["Freakshow Files: The Possum Festival", "mafs", "Yes, there is a pageant. Yes, we went."],
  ["Youth Sports Parents Need a Timeout", "sports", "Notes from the bleachers of a U-10 tournament."],
  ["The Longform Experiment", "special", "Six thousand words on one gravel road."],
  ["Inside a Statehouse Lobby Day", "politics", "Name tags, Chick-fil-A and a lot of handshakes."],
  ["Thrift Store Taxonomy", "culture", "A field guide to the Goodwill bins."],
  ["Truck Stop Philosophers", "mafs", "Late-night wisdom from the Flying J."],
  ["Free Agency Is Fake Christmas", "sports", "Every summer we get socks and call it a bike."],
  ["The Leftovers: Odds and Ends From October", "special", "Bits that didn't make it into full stories."],
  ["Precinct Captains Never Sleep", "politics", "A day knocking doors with the people who actually do it."],
  ["The Lost Art of the Church Potluck", "culture", "Casseroles, ranked by a former Methodist."],
  ["Eclipse Chasers of the Mid-South", "mafs", "Two minutes of darkness, eight hours of traffic."],
  ["Minor League Mascots, Ranked", "sports", "Every costume between Springdale and Amarillo."],
  ["Mailbag: You Asked, We Overthought", "special", "Answering reader questions at unreasonable length."],
];
const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

// ~3 years of output: the 30 hand-written titles, then generated ones, one written piece
// a week plus a video roughly every other week.
const PLACES = ["Fayetteville", "Tulsa", "Joplin", "Springfield", "Little Rock", "Wichita", "Branson", "Fort Smith", "Bentonville", "Eureka Springs", "Siloam Springs", "Hot Springs", "Memphis", "Omaha", "Des Moines", "Lawrence", "Stillwater", "Russellville"];
const WRITTEN: [string, string, string][] = [
  ["The Ballad of %", "mafs", "Another dispatch from the Middle American Freakshow."],
  ["Who Really Runs %?", "politics", "Following the money through city hall."],
  ["%'s Best Kept Secret", "culture", "A local favorite nobody outside town has heard of."],
  ["Friday Night Lights in %", "sports", "High school football, the way it's actually lived."],
  ["Fiction Friday: Last Bus Out of %", "special", "A short story."],
  ["Notes From the % City Council", "politics", "Three hours of public comment, distilled."],
  ["The Diners of %, Ranked", "culture", "Coffee refills counted, pie judged harshly."],
  ["A Long Weekend in %", "mafs", "Nothing went to plan. Everything was fine."],
];
const VIDEO: [string, string][] = [
  ["Video: 24 Hours in %", "A day on the ground, unedited-ish."],
  ["Video: Ask a Stranger in %", "Street interviews about whatever's on our minds."],
  ["Video: The Drive to %", "Dashcam diaries and gas station reviews."],
  ["Video: % After Dark", "What happens in town after 10 p.m."],
];
const generated: [string, string, string][] = [];
for (let i = 0; generated.length < 200; i++) {
  const place = PLACES[(i * 7) % PLACES.length];
  if (i % 3 === 2) {
    const [t, d] = VIDEO[i % VIDEO.length];
    generated.push([t.replace("%", place), "video", d]);
  } else {
    const [t, c, d] = WRITTEN[i % WRITTEN.length];
    generated.push([t.replace("%", place), c, d]);
  }
}
const ALL = [...STORIES, ...generated];
const ARTICLES = ALL.map(([title, collection, dek], i) => {
  const img = IMGS[i % IMGS.length];
  return {
    slug: `fake-${i}`, title, dek, collection, date: day(i < 2 ? 1 : i * 5 + 2),
    author: "Ethan Butler-Hawkins", tags: [], image: img, imageAlt: "", wide: { src: img }, square: { src: img },
    layout: "standard", wholeImage: false,
  } as unknown as Article;
});
const EPISODE_TITLES = ["Mailbag", "Live From the Porch", "The Midterms, Again", "Hoops-ish Hour", "Uncle Tooth Calls In", "Gas Station Food Draft", "Ozark Ghost Stories", "The Sports Desk", "Year in Review", "Callers Only"];
const EPISODES: RadioEpisode[] = Array.from({ length: 120 }, (_, k) => {
  const n = 120 - k;
  return { number: n, title: `${EPISODE_TITLES[n % EPISODE_TITLES.length]}${n % 3 === 0 ? " (Part 2)" : ""}`, length: `${38 + ((n * 7) % 45)} min`, image: IMGS[(n + 3) % IMGS.length] };
});

export default function HomePreview() {
  const [lead, secondary, ...rest] = ARTICLES;
  const rail = rest.slice(0, 3);
  const latest = rest.slice(3, 6);
  const more = rest.slice(6);
  return (
    <>
      <SiteHeader collections={COLLECTIONS.filter((c) => ["politics", "mafs", "special", "sports", "culture", "video", "radio"].includes(c.slug))} tags={[{ slug: "2028", name: "2028" }, { slug: "hoops-ish", name: "Hoops-ish" }, { slug: "longform", name: "Longform" }]} searchIndex={[]} />
      <main>
        <div className={`container ${styles.top}`}>
          <div>
            <LeadCard article={lead} />
            <section style={{ marginTop: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Latest From The Hill</div>
              <div className={styles.latestGrid} style={{ gridTemplateColumns: `repeat(${latest.length}, 1fr)` }}>
                {latest.map((a) => <GridCard key={a.slug} article={a} />)}
              </div>
            </section>
          </div>
          <aside className={styles.rail}>
            <SecondaryCard article={secondary} />
            {rail.map((a) => <RailCard key={a.slug} article={a} />)}
          </aside>
        </div>
        <WhipCountHome />
        <section className="container" style={{ marginTop: 52 }}>
          <div className="section-head">
            <div className="eyebrow">Also Atop The Hill</div>
            <div className="mono-note">drag to scroll →</div>
          </div>
          <DragRow style={{ gap: 18, paddingBottom: 6 }}>
            {more.map((a) => <TallCard key={a.slug} article={a} />)}
          </DragRow>
        </section>
        <section className="container" style={{ marginTop: 52 }}>
          <div className="section-head">
            <Link href="/radio" className="eyebrow">HTH Radio</Link>
            <div className="mono-note">drag to scroll →</div>
          </div>
          <DragRow style={{ gap: 16, padding: "10px 2px" }}>
            {EPISODES.map((ep) => (
              <Link key={ep.number} href="/radio" className={styles.episode} draggable={false}>
                <div className={styles.episodeImage}>
                  <Image src={ep.image} alt="" fill sizes="280px" draggable={false} />
                </div>
                <div style={{ padding: 18 }}>
                  <div className={styles.episodeControls}>
                    <div className={styles.playCircle}>
                      <div className={styles.playTriangle} />
                    </div>
                    <div className={styles.waveform}>
                      {[10, 22, 14, 26, 8, 18].map((h, i) => (
                        <div key={i} style={{ height: h }} />
                      ))}
                    </div>
                  </div>
                  <div className="kicker" style={{ color: "var(--gold)" }}>Ep. {String(ep.number).padStart(2, "0")}</div>
                  <h3 className={styles.episodeTitle}>{ep.title}</h3>
                  <div className={styles.episodeLength}>{ep.length}</div>
                </div>
              </Link>
            ))}
          </DragRow>
        </section>
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
