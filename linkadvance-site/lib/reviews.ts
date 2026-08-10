// Every Google review LINK Advance publishes, verbatim. Names and text are
// untouched: reviews are only ever labelled here, never edited or paraphrased,
// so every count on /reviews can be checked against the words above it.
//
// Two tag families, both read from what the review itself says:
//   service - what the client came in for
//   praise  - what they singled out about the work
// A review can carry several of each, and a few name no transaction at all,
// which is why the praise family exists: without it those reviews would sit on
// the page unreachable by any filter.
//
// NOTE on schema: these are not marked up with Review/AggregateRating. Google's
// review snippet policy makes a page ineligible for review rich results when
// "the entity that's being reviewed controls the reviews about itself", which
// covers a business publishing its own Google reviews on its own site. The
// reviews earn their keep here as crawlable text and as the answer to
// "is LINK Advance any good", not as stars we are not entitled to.

export type Service =
  | "First home"
  | "Refinance"
  | "Investing"
  | "Bought & sold"
  | "Home purchase";

export type Praise = "Communication" | "Made it simple" | "Better rate" | "Knew their stuff";

export type Review = {
  name: string;
  text: string;
  service?: Service;
  praise: Praise[];
};

export const REVIEWS: { name: string; text: string }[] = [
  { name: "Alys Taylor", text: "Hugh and the team have been great, guiding us through the daunting process of buying a home as first home buyers. We’ve really appreciated how communicative and responsive they have been." },
  { name: "Micky Parker", text: "The BEST experience with LINK Advance! I came to Jacob at LINK with a fairly stressful property purchase, and from the very beginning his prompt, professional approach put me completely at ease. He was able to secure me a great loan outcome, and his communication throughout the entire process was clear, proactive, and exceptional. Thank you, thank you! I've bought and sold three properties and worked with multiple brokers over the years, and LINK Advance is easily the best. I highly recommend Jacob and the entire team!" },
  { name: "James Roberts", text: "We had a lovely experience with Jacob, well mannered young man. Very professional and knew what he was doing." },
  { name: "Janae Paton", text: "We recently refinanced our home loan and couldn't be happier with the service from Jacob. Communication was outstanding from start to finish. We were kept informed every step of the way and nothing was ever too much trouble. He made the whole process easy, stress-free, and helped us get a great outcome. An absolute legend to deal with, incredibly knowledgeable, professional, and genuinely the coolest guy ever. If you're looking for a mortgage broker who goes above and beyond, we couldn't recommend him highly enough!" },
  { name: "Brooke McHattie", text: "Thank you Jacob and the LINK Advance team for all your help purchasing our first home. Greatly appreciate your timely responses and wealth of knowledge that made this an easy process." },
  { name: "Sarah Wilson", text: "Callum and Richard take the time to explain what can be a very challenging and complex market - talking you through different options and scenarios to help you make informed decisions. I have appreciated the level of communication and service from the team - thank you!" },
  { name: "Kate Tinta", text: "Seamless experience dealing with Hugh and the Link Advance team to refinance our home. Thank you!" },
  { name: "Michelle Dehlen", text: "The Team at Link Advance at fantastic!!! Just renegotiated my home loan and extremely happy with the result!!! Thank you!" },
  { name: "Ye Lin", text: "Callum was fantastic to work with throughout our home purchase journey. Very responsive, passionate about what he does, and constantly following up with updates so we always knew where things were at. Definitely recommend Callum and the team to anyone looking for a reliable mortgage broker." },
  { name: "Nicola Todhunter", text: "Hugh and the team have been fantastic to deal with! Open and consistent communication, and helped answer the many questions we had! The process from start to finish was easy, and the team made it smooth and as stress free as home loans can possibly be. Would absolutely recommend!" },
  { name: "Zane Ratcliff", text: "Jacob was an efficient mortgage broker. The process was made simple and constant updates were communicated. Any questions asked were responded to timely. Highly recommend Jacob." },
  { name: "Tom Howden", text: "My partner and I bought our first home with the help of Callum at LINK. He helped us from the start of the process right up until settlement. Callum was extremely insightful and spent a lot of time aiding us in facilitating the process and being a great source of information. We would highly recommend LINK and Callum for anyone purchasing a home - especially first home buyers; as we were." },
  { name: "Genevieve Scanlan", text: "Jacob provided informative and friendly service every step of the way. He was a great comfort to us as first home buyers as we knew we were in good hands. Thanks for all of your help Jacob!" },
  { name: "Jack Purtill", text: "Callum and the team were fantastic to deal with every step of the way. As first home buyers we really appreciated Callum's simple explanations of each part of the process and we couldn't be happier with the result." },
  { name: "Madison Else", text: "Thank you to Jacob for his exceptional service in helping us secure our first investment property. He was fast and efficient and made sure we understood everything along the way. 10/10 would recommend Jacob and the Link Advance team. Awesome work guys!!" },
  { name: "Connor Mahoney", text: "Jacob and the team at LINK Advance made buying our investment property quick and painless. Would recommend" },
  { name: "Timothy Warren", text: "We had a great experience working with our mortgage brokers, Hugh, Callum and Jacob. They were easy to communicate with, super proactive and made the financing side of buying and selling our home feel straightforward and manageable. Their guidance gave us real peace of mind and we are so thankful for their support." },
  { name: "Jodie Warren", text: "We had a fantastic experience with LINK Advance from start to finish! Hugh, Jacob & Callum helped me sell my home and purchase a new one. They were knowledgeable, responsive, and had our back the entire process. We always felt informed and supported. Highly recommend to anyone needing an amazing mortgage broking team." },
  { name: "Britta Webb", text: "I just wanted to say a huge thank you to the team at LINK for all your help with our investment property. We honestly could not have done it without you. Your communication, support and knowledge throughout the entire process were outstanding and you made what could have been a very stressful experience feel smooth and manageable. We are so grateful for all of your hard work and would highly recommend LINK to anyone looking for guidance and support." },
  { name: "Vicki Burton", text: "As first home buyers with lots of questions and uncertainty, we couldn't have asked for a better experience with Hugh and the team. They were consistently patient and supportive throughout the entire process, making what could have been a stressful time feel smooth and easy to navigate. Hugh took the time to explain everything in detail, always made us feel as ease, and genuinely cared about helping us achieve our goal. We felt supported from start to finish, and were so grateful for the team's guidance and professionalism. Highly recommend to anyone looking for a trustworthy and dedicated mortgage broker!" },
  { name: "Naguib Hardie", text: "Jacob has been instrumental from search to settlement for my first home purchase. I would recommend him to anyone who needs a mortgage broker that is efficient, professional, and easy to work with, while also looking out for your best interests." },
  { name: "Anthony Arthur", text: "We just used Link Advance do the second time to refinance our home. It was as quick, easy and painless as the first time we used them. Hugh and Jacob made sure we knew everything and answered all our questions promptly. We will be using them next time we refinance the home I would recommend everyone I know to use Hugh an his amazing team of people to help them achieve their goals owning a home or getting a better rate." },
  { name: "Philip Kelly", text: "I can't thank Callum, Hugh and Jacob enough for their help and guidance on the sale of our existing home and the purchase of our new home. Nothing was to much trouble, you were all efficient, reliable and a pleasure to deal with. I have no hesitation in recommending your company to my friends, family and business associates. Kind Regards Phil Kelly" },
  { name: "Jessica Dale", text: "Caring, kind and very clever ! We have felt supported throughout this whole experience of getting our first home loan. Hugh and the team even renegotiated our interest rate proactively which has brought welcome savings for our family. Without hesitation I recommend Hugh and his team!!" }
];

// Assigned by reading each review. Where a review names no transaction, the
// service tag is deliberately absent rather than guessed.
const SERVICE: Record<string, Service> = {
  "Alys Taylor": "First home",
  "Brooke McHattie": "First home",
  "Tom Howden": "First home",
  "Genevieve Scanlan": "First home",
  "Jack Purtill": "First home",
  "Vicki Burton": "First home",
  "Naguib Hardie": "First home",
  "Jessica Dale": "First home",
  "Janae Paton": "Refinance",
  "Kate Tinta": "Refinance",
  "Michelle Dehlen": "Refinance",
  "Anthony Arthur": "Refinance",
  "Madison Else": "Investing",
  "Connor Mahoney": "Investing",
  "Britta Webb": "Investing",
  "Timothy Warren": "Bought & sold",
  "Jodie Warren": "Bought & sold",
  "Philip Kelly": "Bought & sold",
  "Micky Parker": "Home purchase",
  "Ye Lin": "Home purchase",
  "Nicola Todhunter": "Home purchase",
};

const PRAISE: Record<string, Praise[]> = {
  "Alys Taylor": ["Communication"],
  "Micky Parker": ["Communication"],
  "James Roberts": ["Knew their stuff"],
  "Janae Paton": ["Communication", "Made it simple"],
  "Brooke McHattie": ["Communication", "Made it simple"],
  "Sarah Wilson": ["Communication", "Knew their stuff"],
  "Kate Tinta": ["Made it simple"],
  "Michelle Dehlen": ["Better rate"],
  "Ye Lin": ["Communication"],
  "Nicola Todhunter": ["Communication", "Made it simple"],
  "Zane Ratcliff": ["Communication", "Made it simple"],
  "Tom Howden": ["Knew their stuff"],
  "Genevieve Scanlan": ["Communication"],
  "Jack Purtill": ["Made it simple"],
  "Madison Else": ["Made it simple"],
  "Connor Mahoney": ["Made it simple"],
  "Timothy Warren": ["Communication"],
  "Jodie Warren": ["Communication", "Knew their stuff"],
  "Britta Webb": ["Communication"],
  "Vicki Burton": ["Communication"],
  "Naguib Hardie": ["Made it simple"],
  "Anthony Arthur": ["Made it simple", "Better rate"],
  "Philip Kelly": ["Made it simple"],
  "Jessica Dale": ["Better rate"],
};

// The brokers by first name, matched against the review text. Only names that
// actually appear are tagged, so a broker chip's count is a fact about the
// words, not an attribution we made up.
export const BROKERS = ["Hugh", "Callum", "Jacob"] as const;
export type Broker = (typeof BROKERS)[number];

export const brokersIn = (text: string): Broker[] =>
  BROKERS.filter((b) => new RegExp(`\\b${b}\\b`, "i").test(text));

export const ALL_REVIEWS: Review[] = REVIEWS.map((r) => ({
  ...r,
  service: SERVICE[r.name],
  praise: PRAISE[r.name] ?? [],
}));

// Build-time guard: a review that carries no tag at all is unreachable by
// every filter on the page, which is the bug this file exists to prevent.
const ORPHANS = ALL_REVIEWS.filter((r) => !r.service && r.praise.length === 0);
if (ORPHANS.length > 0) {
  throw new Error(
    `Reviews with no service and no praise tag (unreachable by any filter): ${ORPHANS.map((r) => r.name).join(", ")}`
  );
}

export const SERVICES: Service[] = [
  "First home",
  "Home purchase",
  "Refinance",
  "Investing",
  "Bought & sold",
];

export const PRAISES: Praise[] = ["Communication", "Made it simple", "Knew their stuff", "Better rate"];

export const countService = (s: Service) => ALL_REVIEWS.filter((r) => r.service === s).length;
export const countPraise = (p: Praise) => ALL_REVIEWS.filter((r) => r.praise.includes(p)).length;

// Topic-matched reviews for the loan pages: the proof sits next to the claim
// rather than only on /reviews.
export const reviewsFor = (service: Service, limit = 3): Review[] =>
  ALL_REVIEWS.filter((r) => r.service === service).slice(0, limit);

// The page's default view is every review, grouped under the thing the client
// came in for, so you can read the lot section by section without clicking a
// filter and hiding the rest. The last group catches the reviews that name no
// transaction: they are about the people rather than the job, and they are
// still someone's words, so they get a heading of their own instead of being
// quietly dropped.
export type Group = {
  key: string;
  heading: string;
  blurb: string;
  service?: Service;
  reviews: Review[];
};

const BLURBS: Record<Service, string> = {
  "First home": "First home buyers, who ask the most questions and deserve the most patience.",
  "Home purchase": "Buying a home, not their first, where the pressure is usually the settlement date.",
  Refinance: "Refinances and repricings, including the ones where we never changed lenders.",
  Investing: "Investors adding a property, where the structure matters as much as the rate.",
  "Bought & sold": "Selling one and buying another, both ends running at once.",
};

export const GROUPS: Group[] = [
  ...SERVICES.map((s) => ({
    key: s,
    heading: s,
    blurb: BLURBS[s],
    service: s,
    reviews: ALL_REVIEWS.filter((r) => r.service === s),
  })),
  {
    key: "team",
    heading: "Working with the team",
    blurb: "Reviews that talk about the people rather than the transaction.",
    reviews: ALL_REVIEWS.filter((r) => !r.service),
  },
].filter((g) => g.reviews.length > 0);

// Grouping must be a partition: every review in exactly one group, none lost.
const GROUPED = GROUPS.reduce((n, g) => n + g.reviews.length, 0);
if (GROUPED !== ALL_REVIEWS.length) {
  throw new Error(
    `Review groups cover ${GROUPED} of ${ALL_REVIEWS.length} reviews. Every review must sit in exactly one group.`
  );
}
