// Senate Democratic leader race: Schumer vs. Van Hollen. Public whip count.
//
// TO UPDATE THE COUNT: change a senator's `camp` (and `date` / `note`) in
// SENATORS below and bump UPDATED. The scores, bar, dot map, home page module
// and share images all recalculate from this list.
//
// The home page module disappears on its own at EXPIRES_AT. The /whip-count
// page stays up and switches to "the vote has been held" wording.
//
// This file imports nothing from React or Next, so the browser can use it too.

export const UPDATED = "Nov. 14, 2026";
export const VOTE_DATE_LABEL = "Dec. 1";
/** End of vote day, Central time (midnight Dec. 2 CT). */
export const EXPIRES_AT = Date.parse("2026-12-02T06:00:00Z");
export const NEEDED = 28;

export const WHIP_TITLE = "Schumer vs. Van Hollen: The Whip Count";
export const WHIP_DEK =
  "Democrats just received a mandate to enact a bold, progressive legislative agenda that improves material conditions for the working class. Here's where senators publicly stand in the first contested leader race of Chuck Schumer's tenure.";
export const WHIP_SHARE_TEXT =
  "Schumer vs. Van Hollen: The Whip Count. Where every Senate Democrat stands, and how to call them.\n\nOn Hill Top Hawk";
export const WHIP_CTA = "Call your senators and let them know you're tired of Chuck!";

/** S = backs Schumer, V = Van Hollen camp, U = undecided, N = no public statement */
export type Camp = "S" | "V" | "U" | "N";

export type Senator = {
  name: string;
  state: string;
  party: "D" | "I";
  camp: Camp;
  /** Van Hollen camp only: endorsed him by name, or only refuses to back Schumer. */
  sub?: "endorse" | "anti";
  /** Date of the statement or report, YYYY-MM-DD. */
  date?: string;
  /** Senator-elect (no Senate office until sworn in Jan. 3). */
  elect?: boolean;
  note?: string;
  /** Shown when outlets disagree about where this senator stands. */
  flag?: string;
  /** DC office phone and contact form, from senate.gov. */
  phone?: string;
  contact?: string;
};

export const SENATORS: Senator[] = [
  // --- Backs Schumer ---
  { name: "Chuck Schumer", state: "NY", party: "D", camp: "S", date: "2026-11-04", note: "Incumbent leader since 2017. Says he's “confident” he'll be reelected.", phone: "(202) 224-6542", contact: "https://www.schumer.senate.gov/contact/email-chuck" },
  { name: "Tim Kaine", state: "VA", party: "D", camp: "S", date: "2026-06-28", note: "Committed early, back in June.", phone: "(202) 224-4024", contact: "https://www.kaine.senate.gov/contact" },
  { name: "Sheldon Whitehouse", state: "RI", party: "D", camp: "S", date: "2026-11-06", phone: "(202) 224-2921", contact: "https://www.whitehouse.senate.gov/contact/email-sheldon" },
  { name: "Brian Schatz", state: "HI", party: "D", camp: "S", date: "2026-11-09", note: "Running unopposed for whip. Once floated as a Schumer successor himself.", phone: "(202) 224-3934", contact: "https://www.schatz.senate.gov/contact" },
  { name: "John Fetterman", state: "PA", party: "D", camp: "S", date: "2026-11-09", phone: "(202) 224-4254", contact: "https://www.fetterman.senate.gov/contact/" },
  { name: "Richard Blumenthal", state: "CT", party: "D", camp: "S", date: "2026-11-09", phone: "(202) 224-2823", contact: "https://www.blumenthal.senate.gov/contact/" },
  { name: "Sherrod Brown", state: "OH", party: "D", camp: "S", date: "2026-11-09", elect: true, note: "Returning after beating Jon Husted. Backs Schumer but hasn't said much about why." },
  { name: "Kirsten Gillibrand", state: "NY", party: "D", camp: "S", date: "2026-11-10", note: "Home-state colleague.", phone: "(202) 224-4451", contact: "https://www.gillibrand.senate.gov/contact/email-me" },
  { name: "Ruben Gallego", state: "AZ", party: "D", camp: "S", date: "2026-11-11", phone: "(202) 224-4521", contact: "https://www.gallego.senate.gov/" },
  { name: "Angela Alsobrooks", state: "MD", party: "D", camp: "S", date: "2026-11-12", note: "Van Hollen's own Maryland colleague is with Schumer.", phone: "(202) 224-4524", contact: "https://alsobrooks.senate.gov/" },
  { name: "Angus King", state: "ME", party: "I", camp: "S", date: "2026-11-12", note: "Independent. Endorsed Schumer in a statement.", phone: "(202) 224-5344", contact: "https://www.king.senate.gov/contact" },
  { name: "Catherine Cortez Masto", state: "NV", party: "D", camp: "S", date: "2026-11-12", phone: "(202) 224-3542", contact: "https://www.cortezmasto.senate.gov/contact" },
  { name: "Jacky Rosen", state: "NV", party: "D", camp: "S", date: "2026-11-12", phone: "(202) 224-6244", contact: "https://www.rosen.senate.gov/contact_jacky" },
  { name: "Jack Reed", state: "RI", party: "D", camp: "S", date: "2026-11-12", phone: "(202) 224-4642", contact: "https://www.reed.senate.gov/contact/" },
  { name: "Tammy Baldwin", state: "WI", party: "D", camp: "S", date: "2026-11-12", phone: "(202) 224-5653", contact: "https://www.baldwin.senate.gov/feedback" },
  { name: "Mark Kelly", state: "AZ", party: "D", camp: "S", date: "2026-11-13", note: "Backs Schumer but says Democrats need to do things differently.", phone: "(202) 224-2235", contact: "https://www.kelly.senate.gov/contact/contact-form/" },

  // --- Van Hollen camp ---
  { name: "Chris Van Hollen", state: "MD", party: "D", camp: "V", sub: "endorse", date: "2026-11-12", note: "The challenger. Announced Nov. 12 that “we need new leadership.”", phone: "(202) 224-4654", contact: "https://www.vanhollen.senate.gov/contact/email" },
  { name: "Bernie Sanders", state: "VT", party: "I", camp: "V", sub: "endorse", date: "2026-11-12", note: "Firmly against Schumer; backs Van Hollen.", phone: "(202) 224-5141", contact: "https://www.sanders.senate.gov/contact/" },
  { name: "Abdul El-Sayed", state: "MI", party: "D", camp: "V", sub: "endorse", date: "2026-11-12", elect: true, note: "Campaigned on making Van Hollen majority leader." },
  { name: "Peggy Flanagan", state: "MN", party: "D", camp: "V", sub: "endorse", date: "2026-11-13", elect: true, note: "Said Democrats need a progressive champion and Schumer isn't it.", flag: "Earlier AP report (Nov. 10) called her uncommitted" },
  { name: "Jeff Merkley", state: "OR", party: "D", camp: "V", sub: "endorse", date: "2026-11-13", note: "Posted his support on Nov. 13.", flag: "Not on The New Republic's Nov. 13 list", phone: "(202) 224-3753", contact: "https://www.merkley.senate.gov/contact/" },
  { name: "Adam Hamilton", state: "KS", party: "D", camp: "V", sub: "anti", date: "2026-11-04", elect: true, note: "Says Schumer is seen as divisive. Met with Schumer post-election." },
  { name: "Juliana Stratton", state: "IL", party: "D", camp: "V", sub: "anti", date: "2026-11-04", elect: true, note: "Pledged during the campaign not to back Schumer." },
  { name: "Annie Andrews", state: "SC", party: "D", camp: "V", sub: "anti", date: "2026-11-06", elect: true },
  { name: "Troy Jackson", state: "ME", party: "D", camp: "V", sub: "anti", date: "2026-11-09", elect: true, note: "Pledged during the campaign not to back Schumer." },
  { name: "Elissa Slotkin", state: "MI", party: "D", camp: "V", sub: "anti", date: "2026-11-13", note: "A no until she sees a plan that's “definitely different.” Says she isn't running herself.", phone: "(202) 224-4822", contact: "https://www.slotkin.senate.gov/" },

  // --- Undecided ---
  { name: "Chris Murphy", state: "CT", party: "D", camp: "U", date: "2026-03-22", phone: "(202) 224-4041", contact: "https://www.murphy.senate.gov/contact" },
  { name: "Roy Cooper", state: "NC", party: "D", camp: "U", date: "2026-03-28", elect: true, note: "One of the freshmen Schumer is courting." },
  { name: "Ben Ray Luján", state: "NM", party: "D", camp: "U", date: "2026-10-12", phone: "(202) 224-6621", contact: "https://www.lujan.senate.gov/contact/" },
  { name: "Elizabeth Warren", state: "MA", party: "D", camp: "U", date: "2026-10-12", phone: "(202) 224-4543", contact: "https://www.warren.senate.gov/contact/" },
  { name: "Ron Wyden", state: "OR", party: "D", camp: "U", date: "2026-10-12", phone: "(202) 224-5244", contact: "https://www.wyden.senate.gov/contact/" },
  { name: "Chris Pappas", state: "NH", party: "D", camp: "U", date: "2026-11-04", elect: true, note: "Schumer has met with him one-on-one.", flag: "New Republic lists him as not backing Schumer" },
  { name: "Cory Booker", state: "NJ", party: "D", camp: "U", date: "2026-11-04", phone: "(202) 224-3224", contact: "https://www.booker.senate.gov/?p=contact" },
  { name: "James Talarico", state: "TX", party: "D", camp: "U", date: "2026-11-04", elect: true, flag: "New Republic lists him as not backing Schumer" },
  { name: "Maria Cantwell", state: "WA", party: "D", camp: "U", date: "2026-11-04", phone: "(202) 224-3441", contact: "https://www.cantwell.senate.gov/public/index.cfm/email-maria" },
  { name: "Ed Markey", state: "MA", party: "D", camp: "U", date: "2026-11-05", phone: "(202) 224-2742", contact: "https://www.markey.senate.gov/contact" },
  { name: "Jon Ossoff", state: "GA", party: "D", camp: "U", date: "2026-11-05", phone: "(202) 224-3521", contact: "https://www.ossoff.senate.gov/contact-us/" },
  { name: "Andy Kim", state: "NJ", party: "D", camp: "U", date: "2026-11-09", phone: "(202) 224-4744", contact: "https://www.kim.senate.gov/" },
  { name: "Chris Coons", state: "DE", party: "D", camp: "U", date: "2026-11-09", phone: "(202) 224-5042", contact: "https://www.coons.senate.gov/contact" },
  { name: "Josh Turek", state: "IA", party: "D", camp: "U", date: "2026-11-09", elect: true, note: "One of the freshmen Schumer is courting." },
  { name: "Martin Heinrich", state: "NM", party: "D", camp: "U", date: "2026-11-09", phone: "(202) 224-5521", contact: "https://www.heinrich.senate.gov/contact" },
  { name: "Alex Padilla", state: "CA", party: "D", camp: "U", date: "2026-11-10", phone: "(202) 224-3553", contact: "https://www.padilla.senate.gov/contact/" },
  { name: "Mark Warner", state: "VA", party: "D", camp: "U", date: "2026-11-10", phone: "(202) 224-2023", contact: "https://www.warner.senate.gov/public/index.cfm?p=Contact" },
  { name: "Raphael Warnock", state: "GA", party: "D", camp: "U", date: "2026-11-10", phone: "(202) 224-3643", contact: "https://www.warnock.senate.gov/contact/" },
  { name: "Peter Welch", state: "VT", party: "D", camp: "U", date: "2026-11-11", note: "Called the leadership debate a distraction back in 2025.", phone: "(202) 224-4242", contact: "https://www.welch.senate.gov/email-peter/" },
  { name: "Patty Murray", state: "WA", party: "D", camp: "U", date: "2026-11-12", phone: "(202) 224-2621", contact: "https://www.murray.senate.gov/write-to-patty/" },
  { name: "Scott Colom", state: "MS", party: "D", camp: "U", date: "2026-11-12", elect: true, note: "Hasn't committed to Schumer." },

  // --- No public statement ---
  { name: "Adam Schiff", state: "CA", party: "D", camp: "N", phone: "(202) 224-3841", contact: "https://www.schiff.senate.gov" },
  { name: "Amy Klobuchar", state: "MN", party: "D", camp: "N", note: "Governor-elect; her seat goes to an appointee, who would cast this vote.", phone: "(202) 224-3244", contact: "https://www.klobuchar.senate.gov/public/index.cfm/contact" },
  { name: "John Hickenlooper", state: "CO", party: "D", camp: "N", phone: "(202) 224-5941", contact: "https://www.hickenlooper.senate.gov/contact/" },
  { name: "Michael Bennet", state: "CO", party: "D", camp: "N", phone: "(202) 224-5852", contact: "https://www.bennet.senate.gov/public/index.cfm/contact" },
  { name: "Lisa Blunt Rochester", state: "DE", party: "D", camp: "N", phone: "(202) 224-2441", contact: "https://www.bluntrochester.senate.gov/" },
  { name: "Maggie Hassan", state: "NH", party: "D", camp: "N", phone: "(202) 224-3324", contact: "https://www.hassan.senate.gov/content/contact-senator" },
  { name: "Mazie Hirono", state: "HI", party: "D", camp: "N", phone: "(202) 224-6361", contact: "https://www.hirono.senate.gov/contact" },
  { name: "Tammy Duckworth", state: "IL", party: "D", camp: "N", phone: "(202) 224-2854", contact: "https://www.duckworth.senate.gov/content/contact-senator" },
];

export const SOURCES = [
  { label: "Drop Site News — Leadership whip count", href: "https://whipcount.dropsitenews.com/" },
  { label: "Punchbowl News — Van Hollen takes on Schumer (Nov. 13)", href: "https://punchbowl.news/article/washington/van-hollen-vs-schumer/" },
  { label: "Axios — The senators who could join Van Hollen's insurgency (Nov. 13)", href: "https://www.axios.com/2026/11/13/democrats-schumer-van-hollen-senate-leader" },
  { label: "The New Republic — Full list of senators who back Van Hollen (Nov. 13)", href: "https://newrepublic.com/post/217991/full-list-senators-back-chris-van-hollen-leader" },
  { label: "The Hill — Inside Schumer's push to squash a rebellion", href: "https://thehill.com/homenews/senate/6214626-schumer-democratic-senate-leadership-rebellion" },
  { label: "AP via Scripps — Van Hollen considers challenge (Nov. 10)", href: "https://www.scrippsnews.com/politics/congress/van-hollen-considers-challenge-to-schumer-for-senate-democratic-leader" },
  { label: "Newsweek — Schumer faces potential challenge (Nov. 9)", href: "https://newsweek.com/chuck-schumer-chris-van-hollen-senate-majority-leader-challenge-12687780" },
  { label: "States Newsroom — Schumer “confident” he'll lead (Nov. 10)", href: "https://floridaphoenix.com/2026/11/11/repub/schumer-confident-hell-lead-us-senate-dems-despite-criticism/" },
  { label: "U.S. Senate — Senator contact information", href: "https://www.senate.gov/senators/senators-contact.htm" },
];

export const CAMP_LABEL: Record<Camp, string> = { S: "Schumer", V: "Van Hollen", U: "Undecided", N: "No statement" };
/** Display order: Schumer, undecided, no statement, Van Hollen (so the bar reads left vs. right). */
export const CAMP_ORDER: Record<Camp, number> = { S: 0, U: 1, N: 2, V: 3 };

export function tally() {
  const count = (c: Camp) => SENATORS.filter((s) => s.camp === c).length;
  return {
    S: count("S"),
    V: count("V"),
    U: count("U"),
    N: count("N"),
    endorse: SENATORS.filter((s) => s.sub === "endorse").length,
    total: SENATORS.length,
  };
}

/** Is the vote still ahead? Pure check; callers decide how fresh `now` is. */
export function beforeVote(now: number) {
  return now < EXPIRES_AT;
}
