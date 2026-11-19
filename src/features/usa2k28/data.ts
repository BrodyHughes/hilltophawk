// Content for the USA 2K28 rankings article (layout "usa2k28").
// Ratings mirror the player cards from the design canvas. The OVR is the
// author's overall call, not a formula of the six attributes.

export type AttrKey = "swagger" | "unity" | "integrity" | "fundraising" | "cake" | "clout";

export const ATTRS: { key: AttrKey; label: string; short: string }[] = [
  { key: "swagger", label: "Swagger", short: "SWG" },
  { key: "unity", label: "Party Unity", short: "UNI" },
  { key: "integrity", label: "Political Integrity", short: "INT" },
  { key: "fundraising", label: "Fundraising", short: "FUN" },
  { key: "cake", label: "Cake Index", short: "CAKE" },
  { key: "clout", label: "Internet Clout", short: "NET" },
];

export type Link = { label: string; href: string };

export type IntegrityReceipt =
  | {
      graded: true;
      grade: string;
      score: string;
      rank: string;
      facts: { label: string; value: string }[];
      href: string;
    }
  | { graded: false; note: string; href?: string };

export type Candidate = {
  id: string;
  rank: number;
  first: string;
  last: string;
  party: "DEM" | "GOP" | "IND";
  partyName: string;
  state: string;
  age: number;
  office: string;
  ovr: number;
  ratings: Record<AttrKey, number>;
  archetype: string;
  badges: string[];
  endorsed?: boolean;
  photo: string;
  /** Ethan's write-up, one string per paragraph. */
  take: string[];
  comp: { player: string; text: string };
  integrity: IntegrityReceipt;
  links: Link[];
};

export const ELECTION_DAY = "2028-11-07T00:00:00-05:00";
/** Numbers shown before the live countdown hydrates (publish day). */
export const PUBLISH_DAYS = 719;

export const AUTHORS = "Ethan Butler-Hawkins and Isaiah Newburn";

/** Intro paragraphs. "{countdown}" is replaced with the live countdown. */
export const INTRO: string[] = [
  "Here we are, with {countdown} until the 2028 presidential election and one of the greatest reckonings of our time. This election will provide more than just an indictment of the current Trump administration. It’ll be the fork in the road that determines whether we’re finally able to untangle ourselves from the political backdrop the Reaganites painted nearly half a century ago. Americans will get to decide whether they really want a new way of governing (no, not a Third Way), or if they’d prefer to opt for the comfort of the pre-Trump neoliberalism that made the politics of today an inevitability. The 2028 election will be no joking matter. That doesn’t mean I can’t have a little fun with it, right?",
  "We’re probably less than two weeks away from seeing the first round of 2028 hopefuls throw their hats into the ring. These first announcements will unleash a two-year grudge match full of party infighting, confounding political calculations, and an ever-sneaky corporate donor class trying to manufacture consent around milquetoast candidates.",
  "In what I would consider true HTH fashion (or at least what I want true HTH fashion to be), I’ve sports-gamified ten of the likeliest suitors of the presidency, assigning each of them NBA 2K–style attribute ratings. I’m without a doubt missing some politicians who will end up being main characters this cycle, but if I dig this format enough (I reckon I will), I’ll update the rankings and add new candidates as they come.",
  "I’ve also tapped acclaimed ball-knower and dear friend of mine, Isaiah Newburn, for some player comps to really nail the vibe of this whole ordeal. I intentionally had him choose his picks without seeing any of my commentary, so there are moments of misalignment, but a guy like me loves to be challenged in the marketplace of ideas.",
];

/** The rating guide. Paragraph text may contain [[Let Us Eat Cake]] / [[Integrity Index]] link markers. */
export const GUIDE: { key: AttrKey | "ovr"; label: string; text: string[] }[] = [
  {
    key: "ovr",
    label: "Overall",
    text: [
      "These are very likely to change after the time of writing, but I doled these numbers out based on how favorable or unfavorable I think the electorate will be to each candidate in the general, not the primary. This is why, as you’ll see, higher ratings trend capital-D Democrat. If you read [[Let Us Eat Cake]], the sprawling plea to newly elected Democrats that I penned last week (you don’t have to), then you know I have a theory that history is rhyming between this month’s midterms and the 2006 election. While it always puts a pit in my stomach to expect a win out of the Democratic Party, I ultimately think they should coast to a win in ’28 (after that, they’ll have a long road ahead to keep history from rhyming with 2016, if you know what I’m saying). All of that aside, the higher the number, the clearer the path I see toward a candidate’s victory.",
    ],
  },
  {
    key: "swagger",
    label: "Swagger",
    text: [
      "This doesn’t need too much explanation, right? All of these folks (yes, even JD) have some amount of it: the presence to stay on message, not crack under pressure, and come out of a sit-down interview looking good. For better or worse, a non-negligible number of Americans vote only on vibes. I’m glad they don’t do the “would you have a beer with them” thing anymore, though. *Knocks on wood*.",
    ],
  },
  {
    key: "unity",
    label: "Party Unity",
    text: [
      "Can they bring their party together in the general? This election will have a unique amount of infighting on both sides. In the Republican Party, I can see a reality where the MAGA wing has its pride wounded by the candidates who are going to have to separate themselves from President Trump. For Dems, it’s already happening, and it’s ugly. I had plenty to say about that in my last piece, but this primary will be full of shit-throwing by moderates who assume Americans actually don’t like the thought of healthcare reform and do like finding room in the budget for human atrocities.",
    ],
  },
  {
    key: "integrity",
    label: "Integrity",
    text: [
      "I used the [[Integrity Index]] to inform these ratings, and the state of these politicians made me feel grotesque. One more shameless plug: in [[Let Us Eat Cake]], I outlined how much of an anchor I think it will be to be in cahoots with corporate PACs. Corruption is one of the most salient issues of our time. Candidates who have practiced radical transparency in the post–Citizens United hellscape we exist in will be rewarded (hopefully).",
    ],
  },
  {
    key: "fundraising",
    label: "Fundraising",
    text: [
      "This is a tough one to rate, because any candidate who signals a willingness to protect corporate interests will receive a cash windfall no matter what. In this last midterm cycle, we witnessed several races break spending records on behalf of candidates fending off populist insurgents (go figure). For this reason, I’m going to go ahead and give everyone other than AOC, Ossoff, and Tucker a 99 in this category. Each of the three seems highly capable of ratcheting up small-dollar donations, and they also seem to be posturing (smartly) against this corporate cabal.",
    ],
  },
  {
    key: "clout",
    label: "Internet Clout",
    text: [
      "Something about me? I’m a guy who’s on the internet. Admittedly, my algorithms tend to show me what I want to see, so my advice would be to take this one with a grain of salt. My estimate of how much motion some of these folks have (or will have) is undoubtedly flawed.",
    ],
  },
  {
    key: "cake",
    label: "Cake Index",
    text: [
      "This one’s my favorite! As much as the Neera Tandens of the world will try to feign ignorance of the messaging strategy that won these midterms for Democrats, politicians and their internal polls know the truth. Across the board, whether it was Talarico, Hamilton, Andrews, El-Sayed, Colom, etc., this campaign was the same up and down the ballot. I watched candidates whom Neera would claim as “Normie Democrats” trot around their states and districts parroting the rhetoric Bernie Sanders popularized in 2016. There is a populist rage infecting the hearts and souls of the American people. The Cake Index captures the ability of a candidate to promise a populist agenda that addresses material concerns in a way voters will believe. Most of these hopefuls will come around to this form of messaging, but whether because of their record or their general sliminess, they won’t be believed. Let us eat cake!",
    ],
  },
];

const ii = (slug: string) => `https://integrityindex.us/candidate/${slug}`;
const bp = (slug: string) => `https://ballotpedia.org/${slug}`;
const cg = (slug: string, id: string) => `https://www.congress.gov/member/${slug}/${id}`;

const NOT_IN_CONGRESS = "Not graded by the Integrity Index, which only grades sitting members of Congress. This rating is our estimate using the index’s criteria.";

// Countdown order: index 0 is #10.
export const CANDIDATES: Candidate[] = [
  {
    id: "desantis",
    rank: 10,
    first: "Ron",
    last: "DeSantis",
    party: "GOP",
    partyName: "Republican",
    state: "FL",
    age: 48,
    office: "Governor",
    ovr: 63,
    ratings: { swagger: 68, unity: 55, integrity: 25, fundraising: 99, cake: 45, clout: 64 },
    archetype: "The Cynic",
    badges: ["War Chest", "Executive Record"],
    photo: "/images/usa2k28/desantis.jpg",
    take: [
      "Just two short years ago, Ron DeSantis seemed as if he would glide toward an anointing as the next prince of the MAGA movement. But a Chrysler 300 looks like a Phantom until a Phantom pulls up, and Donald Trump thoroughly undressed him during the 2024 primary. I suspect DeSantis will either run this cycle to no avail or sit back and rebuild his image over the next few years. Otherwise, this feller would fail spectacularly in a general election. He is MAGA to the core, but the primary built up enough distaste for him among the MAGA base… not a good combo.",
    ],
    comp: {
      player: "Paolo Banchero",
      text: "Are point forwards who only drive and shoot long twos out of style, or have they looped back around into being the most efficient players possible? Was being anti-MAGA during Trump’s peak a death wish, or was he ahead of his time?",
    },
    integrity: { graded: false, note: NOT_IN_CONGRESS },
    links: [
      { label: "Ballotpedia", href: bp("Ron_DeSantis") },
      { label: "Congress.gov (House record)", href: cg("ron-desantis", "D000621") },
    ],
  },
  {
    id: "cruz",
    rank: 9,
    first: "Ted",
    last: "Cruz",
    party: "GOP",
    partyName: "Republican",
    state: "TX",
    age: 55,
    office: "U.S. Senator",
    ovr: 73,
    ratings: { swagger: 80, unity: 50, integrity: 36, fundraising: 99, cake: 30, clout: 86 },
    archetype: "A Ben Shapiro Republican",
    badges: ["Podcast Circuit", "Debate Closer"],
    photo: "/images/usa2k28/cruz.jpg",
    take: [
      "The senator from Texas has been a stalwart in right-leaning media for several years at this point, and he has a popular podcast of his own that caters to the “normal” wing of the GOP (those quotes are doing some heavy lifting). He has the political chops to run away from the Trump regime in a believable enough way, but his neocon tendencies will not be popular with today’s electorate, even if the packaging feels less extreme to some. Additionally, I don’t think he’ll run now. If he believes he has any chance of winning (I can’t speak to what the man thinks), it would mean abandoning the only Senate seat Republicans hold in Texas.",
    ],
    comp: {
      player: "James Harden",
      text: "Losers lose. Maybe at one point an iso legend in their respective field (step-back threes, stripping people of rights), but time has not been favorable to them. The losses pile up to where the individual accomplishments don’t really mean much when the main traits that come to mind are being an unlikable loser, no matter how many beard strands get added per year.",
    },
    integrity: {
      graded: true,
      grade: "F",
      score: "36.31",
      rank: "#75 of 97 senators",
      facts: [
        { label: "Raised 2021–26", value: "$105.9M" },
        { label: "Corporate PAC money", value: "$367,300" },
        { label: "Stocks held (2024)", value: "$3.56M" },
        { label: "Top holding", value: "Goldman Sachs, $3M+" },
      ],
      href: ii("ted-cruz"),
    },
    links: [
      { label: "Ballotpedia", href: bp("Ted_Cruz") },
      { label: "Congress.gov (bills & votes)", href: cg("ted-cruz", "C001098") },
    ],
  },
  {
    id: "harris",
    rank: 8,
    first: "Kamala",
    last: "Harris",
    party: "DEM",
    partyName: "Democrat",
    state: "CA",
    age: 62,
    office: "Former VP",
    ovr: 73,
    ratings: { swagger: 80, unity: 70, integrity: 50, fundraising: 99, cake: 50, clout: 78 },
    archetype: "The Brandonite",
    badges: ["Political Celebrity", "War Chest"],
    photo: "/images/usa2k28/harris.jpg",
    take: [
      "The former vice president is going to be tied to the Brandon administration forever. I don’t think Democrats should (or will) get into the habit of nominating a candidate who lost to Donald Trump. While she’s gone to great lengths in the last couple of years to make sure people know she only had 107 days to campaign for the general election, the stench of her admitting she couldn’t think of anything she’d do differently than her boss still lingers. Kamala has performed well in many preliminary polls, but Republicans will look to turn the election into a sequel of ’24.",
    ],
    comp: {
      player: "Trae Young",
      text: "Got further than most of their peers because of insane circumstances in a one-off Mickey Mouse year, which led to an inflated sense of self, but both inevitably ran into real pros during their one-year runs and were immediately shown levels.",
    },
    integrity: { graded: false, note: NOT_IN_CONGRESS, href: ii("kamala-harris") },
    links: [
      { label: "Ballotpedia", href: bp("Kamala_Harris") },
      { label: "Congress.gov (Senate record)", href: cg("kamala-harris", "H001075") },
    ],
  },
  {
    id: "vance",
    rank: 7,
    first: "JD",
    last: "Vance",
    party: "GOP",
    partyName: "Republican",
    state: "OH",
    age: 42,
    office: "Vice President",
    ovr: 74,
    ratings: { swagger: 80, unity: 58, integrity: 30, fundraising: 99, cake: 45, clout: 84 },
    archetype: "Swaggerless Ideologue",
    badges: ["Party Machine", "War Chest", "Podcast Circuit"],
    photo: "/images/usa2k28/vance.jpg",
    take: [
      "Vice President Vance has deservedly become a victim of his own bloodthirsty careerist instincts. JD Vance, once a relatively inoffensive Never Trumper with a book deal, has morphed into a chronically online isolationist before our eyes. Vance has been forced to go on television and defend many of the most odious actions of this White House. He likely could’ve had a future in a post-Donald GOP had he just held onto his seat in the Senate and written a few more Hillbilly Elegies or something. I have no doubt he’ll announce a run to replace his boss soon, but the MAGA sycophant vote won’t be enough to carry him past how unfavorable this administration’s policies have been.",
    ],
    comp: {
      player: "Jaylen Brown",
      text: "Spent the most important part of their careers in the shadow of an all-timer, and it’s impossible to overstate how much their career is based on being a part of the program. Despite press conference statements, you can tell they think they’ll do better as the No. 1 option, and they have no idea it’s over.",
    },
    integrity: { graded: false, note: NOT_IN_CONGRESS, href: ii("jd-vance") },
    links: [
      { label: "Ballotpedia", href: bp("J.D._Vance") },
      { label: "Congress.gov (Senate record)", href: cg("jd-vance", "V000137") },
    ],
  },
  {
    id: "buttigieg",
    rank: 6,
    first: "Pete",
    last: "Buttigieg",
    party: "DEM",
    partyName: "Democrat",
    state: "MI",
    age: 44,
    office: "Fmr. Cabinet Sec.",
    ovr: 74,
    ratings: { swagger: 75, unity: 75, integrity: 50, fundraising: 99, cake: 58, clout: 85 },
    archetype: "Libbed Out JD Vance",
    badges: ["Podcast Circuit", "Crossover Appeal"],
    photo: "/images/usa2k28/buttigieg.jpg",
    take: [
      "I imagine “Mayor Pete” started running for the presidency the very moment he emerged from his mother’s womb. When other kids imagined themselves playing concerts in packed venues or hitting game-winning home runs, young Peter almost certainly imagined himself delivering finely manicured talking points to Fox News hosts. Pete would have an easier time running away from the debacle that was the latter half of the Biden administration than Kamala, but his outwardly corporatist disposition won’t do him any favors with an electorate that is clearly experiencing palpable populist rage.",
    ],
    comp: {
      player: "Donovan Mitchell",
      text: "It looks right on paper, and it’s aesthetically pleasing, but they obviously do not have championship DNA. Whether through a lack of perimeter defense or otherwise, they just don’t have the X factor or the grit that Midwestern farmers can relate to.",
    },
    integrity: { graded: false, note: NOT_IN_CONGRESS },
    links: [{ label: "Ballotpedia", href: bp("Pete_Buttigieg") }],
  },
  {
    id: "newsom",
    rank: 5,
    first: "Gavin",
    last: "Newsom",
    party: "DEM",
    partyName: "Democrat",
    state: "CA",
    age: 59,
    office: "Governor",
    ovr: 75,
    ratings: { swagger: 86, unity: 78, integrity: 40, fundraising: 99, cake: 55, clout: 88 },
    archetype: "Shape Shifter",
    badges: ["Political Celebrity", "War Chest", "Podcast Circuit"],
    photo: "/images/usa2k28/newsom.jpg",
    take: [
      "Gavin Newsom is the quintessential machine politician. He knows how to play the game. He embraced “dark woke” rather early, openly mocking the absurdity of President Trump’s social media strategy through his press office’s official Twitter account. Before Jon Ossoff felt like an inevitability, Newsom appeared to be the token sex-appeal candidate in this election, a position that was doing a lot of heavy lifting for his prospects.",
      "Gavin’s problem is that… he has pretty shitty politics. He’s been downright cruel to the state’s homeless population, he campaigned heavily against California’s ballot measure for a one-time wealth tax on billionaires (I’m sure he’ll be “thanked” for this $$$), and he has championed a style of unity politics in the media that voters clearly don’t want. He’ll be a factor because of his ability to display flashes of raw talent when it comes to political theater, but he’ll be dragged down by his actual record of governing.",
    ],
    comp: {
      player: "Kyrie Irving",
      text: "A career of flashy plays with very little substance. Everyone on the outside believes they’re the GOAT, but the people who had to watch night to night always have conflicting opinions.",
    },
    integrity: { graded: false, note: NOT_IN_CONGRESS },
    links: [{ label: "Ballotpedia", href: bp("Gavin_Newsom") }],
  },
  {
    id: "rubio",
    rank: 4,
    first: "Marco",
    last: "Rubio",
    party: "GOP",
    partyName: "Republican",
    state: "FL",
    age: 55,
    office: "Sec. of State",
    ovr: 77,
    ratings: { swagger: 78, unity: 85, integrity: 30, fundraising: 99, cake: 52, clout: 66 },
    archetype: "Return to Form Candidate",
    badges: ["Crossover Appeal", "Party Machine"],
    photo: "/images/usa2k28/rubio.jpg",
    take: [
      "If anyone who actually serves in the Trump administration can separate themselves from Trump in a way that doesn’t alienate the MAGA base, it’s Marco Rubio. His weaponization of the State Department to extract resources from South America is something out of a pre-Trump neocon wet dream. Rubio was once seen as the future of the Republican Party. I honestly think he’d probably have been president by now had the Don never descended that escalator eleven years ago. His bona fides give him credibility with MAGA diehards and the old guard alike.",
    ],
    comp: {
      player: "Zion Williamson",
      text: "Stop trying to make this work. It’s never going to work.",
    },
    integrity: { graded: false, note: NOT_IN_CONGRESS, href: ii("marco-rubio") },
    links: [
      { label: "Ballotpedia", href: bp("Marco_Rubio") },
      { label: "Congress.gov (Senate record)", href: cg("marco-rubio", "R000595") },
    ],
  },
  {
    id: "carlson",
    rank: 3,
    first: "Tucker",
    last: "Carlson",
    party: "IND",
    partyName: "Independent",
    state: "ME",
    age: 57,
    office: "Media Host",
    ovr: 81,
    ratings: { swagger: 90, unity: 30, integrity: 50, fundraising: 70, cake: 72, clout: 97 },
    archetype: "Reactionary Populist",
    badges: ["Political Celebrity", "Podcast Circuit", "Outsider"],
    photo: "/images/usa2k28/carlson.jpg",
    take: [
      "If I were convinced Tucker would be running as a Republican, he would have a much higher overall. The prospect of a Carlson candidacy with party backing is horrifying to me. He holds the popular position on Israel and has been outspoken about the corruption in the Trump administration. Tucker is the truest ideological successor to MAGA, despite his ongoing, very public beef with the administration.",
      "If Tucker runs as a spoiler, he has the capacity to destroy the modern GOP and rebuild it in his own image. His “outsider” status allows him to feign the same sort of populist messaging that won Trump the White House twice. Should he become the post-Trump figurehead of MAGA, the movement would be given a more highly skilled orator than it has ever had.",
    ],
    comp: {
      player: "Alperen Şengün",
      text: "The narrative is always “if they ever piece it all together…” but they will never piece it all together. They have all of the tools to be similar to their legendary pro comps (Jokić/Trump), but some people just have that undeniable factor and some don’t, no matter how much shady Eastern European media bias tries to convince you they do.",
    },
    integrity: {
      graded: false,
      note: "Never held office or raised campaign money, so there’s nothing for the Integrity Index to grade. This rating is a placeholder.",
    },
    links: [],
  },
  {
    id: "ossoff",
    rank: 2,
    first: "Jon",
    last: "Ossoff",
    party: "DEM",
    partyName: "Democrat",
    state: "GA",
    age: 39,
    office: "U.S. Senator",
    ovr: 93,
    ratings: { swagger: 82, unity: 85, integrity: 89, fundraising: 95, cake: 80, clout: 76 },
    archetype: "Sex Symbol",
    badges: ["Swing State Proven", "Grassroots", "War Chest"],
    photo: "/images/usa2k28/ossoff.jpg",
    take: [
      "Jon Ossoff has been having a year. He’s absolutely dominated the liberal slop circuit. It feels like almost every week he goes viral for delivering cutting one-liners attacking the regime, even if those attacks stop short of policy prescriptions or any substance at large. His voting record falls far short of what I would expect of my electeds, but I believe his raw charisma would easily buoy him to an electoral landslide against anything the GOP can offer up in two years.",
      "He’s also shown the ability to be highly responsive in his governance, championing robust constituent services that have turned ultra-conservative small-town Georgians into certified libs. Do I think Ossoff would govern in a way that pleases me? Absolutely not. Do I think he might be a generational political talent? Yeah.",
    ],
    comp: {
      player: "Jalen Johnson",
      text: "Industry plant hoops. Comes out of nowhere, stat-pads during an inflated era, and I’m supposed to consider them elite? Yeah, right. Please join the other flamed-out “all-around, jack of all trades” star section with French disaster Killian Hayes and New Jersey Senator Cory Booker.",
    },
    integrity: {
      graded: true,
      grade: "B+",
      score: "88.57",
      rank: "#5 of 97 senators",
      facts: [
        { label: "Raised 2021–26", value: "$136.6M" },
        { label: "From small donors", value: "73%" },
        { label: "Corporate PAC money", value: "$0" },
        { label: "Stocks held", value: "$0" },
      ],
      href: ii("jon-ossoff"),
    },
    links: [
      { label: "Ballotpedia", href: bp("Jon_Ossoff") },
      { label: "Congress.gov (bills & votes)", href: cg("jon-ossoff", "O000174") },
    ],
  },
  {
    id: "ocasio-cortez",
    rank: 1,
    first: "Alexandria",
    last: "Ocasio-Cortez",
    party: "DEM",
    partyName: "Democrat",
    state: "NY-14",
    age: 37,
    office: "U.S. Rep.",
    ovr: 93,
    ratings: { swagger: 92, unity: 70, integrity: 99, fundraising: 90, cake: 99, clout: 96 },
    archetype: "The FDR Candidate",
    badges: ["Grassroots", "Principled", "Political Celebrity"],
    endorsed: true,
    photo: "/images/usa2k28/ocasio-cortez.jpg",
    take: [
      "AOC would have a much harder time in the primary than she would in the general. The Democratic establishment and all of the consultants who uphold it have vested capital interests in seeing her fail. Ocasio-Cortez has proven that she cares about governing in a way that delivers on the “kitchen-table issues” the Ellison TV stations love to muse on. After being demagogued by Republicans and Democratic Party brass alike for eight years, she’s still one of the most popular politicians in the country.",
      "She is rightfully seen as the spiritual successor to the movement Bernie Sanders popularized in the 2016 primary, and she can run on a progressive agenda that her legislative record and advocacy will support. Even if she’s initially seen as divisive, should she stay steadfast in her convictions, she has the opportunity to rebuild the party of FDR and secure a progressive mandate for a generation.",
    ],
    comp: {
      player: "Anthony Edwards",
      text: "How long can you be a rising star before it’s time to prove it? How many conference finals and “gotcha” press conferences can we have before proof that you can compete on the main stage?",
    },
    integrity: {
      graded: true,
      grade: "A+",
      score: "99.64",
      rank: "#1 of 413 House members",
      facts: [
        { label: "Raised 2024–26", value: "$53.3M" },
        { label: "Corporate PAC money", value: "$0" },
        { label: "Stocks held", value: "$0" },
        { label: "Net assets", value: "$49,002" },
      ],
      href: ii("alexandria-ocasio-cortez"),
    },
    links: [
      { label: "Ballotpedia", href: bp("Alexandria_Ocasio-Cortez") },
      { label: "Congress.gov (bills & votes)", href: cg("alexandria-ocasio-cortez", "O000172") },
    ],
  },
];

export const BADGE_INFO: Record<string, string> = {
  Grassroots: "Powered by small-dollar donors and volunteers",
  Principled: "Votes the way they campaign",
  "Political Celebrity": "Famous beyond politics",
  "War Chest": "Can raise serious money fast",
  "Swing State Proven": "Has won where it’s hard to win",
  "Podcast Circuit": "Lives in the long-form interview world",
  "Crossover Appeal": "Draws voters outside the base",
  "Party Machine": "Backed by the party apparatus",
  "Debate Closer": "Dangerous on a debate stage",
  "Executive Record": "Has run a government",
  Outsider: "Never held office, runs against all of it",
};
