"use client";

import { SITE } from "@/lib/site";

// Real Google reviews, copied verbatim from the live site's review widget on
// 2026-08-08 - Wealth clients only. (The old widget mixed in LINK Advisors'
// accounting reviews, which belong to a different Google listing; those are
// deliberately not carried over.) V2 review tile treatment.
export const REVIEWS: { name: string; text: string }[] = [
  {
    name: "Sarah Wilson",
    text: "Richard has been amazing in helping me get into a position to purchase my first home. He took the time to go through my situation in detail and help set my finances up to enable me to be better prepared for the future.",
  },
  {
    name: "Ye Lin",
    text: "Richard was an absolute pleasure to deal with. He gave us great guidance during our insurance review and really took the time to understand what suited us best. Very knowledgeable, easy to talk to, and his team was always responsive and helpful. We also appreciated the advice around our wealth planning.",
  },
  {
    name: "Kate Tinta",
    text: "Had a great planning session with Richard recently. We gained a huge amount of insight into how we can best use the equity we have in our home and explored other methods to improve not only our immediate cashflow, but also our long term wealth. Can't wait to implement these strategies. Thanks Richard.",
  },
  {
    name: "Ardian Berisha",
    text: "Richard helped me sort out my super, life insurance, plan for my first home, and set up a solid retirement plan. He is very knowledgeable and takes the time to research and explain things clearly. I now feel confident and safe that my family's future is on the right track.",
  },
  {
    name: "Timothy Warren",
    text: "Richard has been outstanding to work with. He combines deep financial knowledge with a genuinely friendly and approachable manner, which makes discussing big decisions much easier. His guidance has helped us plan confidently for the future, and his support during our recent home sale and purchase was incredibly valuable.",
  },
  {
    name: "Deb",
    text: "An appointment with Richard was the most enlightening experience I have had to date and as an elderly woman seeking retirement knowledge I have spoken to many. Richard's communication style was flawless, I walked away with every question answered and armed with ideas no one had ever shared with me.",
  },
  {
    name: "Hamish Sinclair-Ross",
    text: "I have had a bad experience with Financial Planners in the past, but Richard was excellent to work with. He provided some really helpful options for us to consider, and guided us to make some important financial decisions based on facts rather than assumptions or emotions.",
  },
  {
    name: "Lachlan McKinnon",
    text: "Richard's understanding in investment property sets him apart from other financial planners I have ever encountered. From superannuation planning to education bonds, he explains everything thoroughly, making sure that we leave the meeting with a clear plan in hand.",
  },
  {
    name: "Hui Ru McKinnon",
    text: "We had recently met with Richard to discuss our retirement goals and the whole experience has been extremely fulfilling. Richard understood what is important to us, explaining everything in a way that we can both understand. He gives us the confidence to retire comfortably.",
  },
  {
    name: "Kelly Walker",
    text: "I recently worked with Richard & PJ to review all my insurance policies for both myself and my kids, and I couldn't be happier with the experience. Their professionalism, patience, and genuine care really stood out.",
  },
  {
    name: "Jodie Warren",
    text: "We've had an excellent experience with our financial planner, Richard. He is extremely professional, friendly, and consistently provides clear, thoughtful guidance to help us make confident financial decisions and secure our future.",
  },
  {
    name: "anuschka erasmus",
    text: "Richard and the LINK Wealth team have gone above and beyond helping my family get set up here, in Australia, after moving from South Africa. I would recommend to anyone looking for sound financial advice.",
  },
  {
    name: "Travis Spiteri",
    text: "Richard was great to talk too, he is extremely professional, friendly and provided me with great options.",
  },
  {
    name: "hadi irwan",
    text: "Thank you Richard for an amazing discussion and pointers towards estate planning, super management and financial strategy. It has given us a lot to think about and we'll certainly be recommending LINK Wealth to our friends and family.",
  },
  {
    name: "mjd 21",
    text: "Richard has been an absolute game changer for us. He's not only brilliant at what he does, but he genuinely cares about our family's goals and future. Every meeting leaves us feeling clearer, more empowered, and excited about the path ahead. And Britt deserves her own shout-out! She is always so welcoming, patient, and on top of everything - and her coffees are second to none. Couldn't recommend the LINK Wealth Advisors team more highly, they've been exceptional!!",
  },
  {
    name: "Rachel McMillan",
    text: "We've had another great experience with the team at LINK. My husband and I are looking at doing some strategic financial planning regarding super, insurance and investments. I contacted our accountant Chris to discuss and he put us in touch with Richard to get a second opinion. We were really happy with how efficient Richard was in responding to our queries and all the advice on our future plans.",
  },
  {
    name: "Emma Warren",
    text: "I recently had the pleasure of using Link Wealth's services for a full insurance review, and I couldn't be more impressed. Richard took the time to go through everything in detail - life insurance, income protection, and all the fine print - making sure everything was up to date and aligned with my current needs. I now feel incredibly secure and confident in my financial protection. That kind of peace of mind is priceless.",
  },
  {
    name: "Nathan P",
    text: "We recently sat down with Richard to review our personal insurance and couldn't be happier with the experience. He was professional, approachable, and explained everything in a way that made sense - even the more complex parts of our cover. We left feeling confident, informed, and very well looked after.",
  },
  {
    name: "Su Yee Nandar",
    text: "We recently had Richard and PJ review our existing insurance policies, and the experience was nothing short of excellent. Richard's depth of knowledge in risk and wealth planning, PJ's experience and sense of humour, and Joy's attention to detail and warm approach made for a truly well-rounded team.",
  },
  {
    name: "Jacob Keenan",
    text: "Decided it was time to review my insurances to make sure I was protected. Richard was professional and knowledgeable and would highly recommend you give him a call!",
  },
];

// The register light tint carries the initials on the review tiles.
export const REVIEW_TINT = "#daf2eb";

export const reviewInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function ReviewStars({ size = 16 }: { size?: number }) {
  return (
    <span aria-hidden className="flex gap-0.5 text-wealth">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

// The homepage treatment: a drifting row of grey review tiles, doubled so the
// track loops, paused on hover and static under reduced motion.
export function Testimonials({ heading = "Hear from our happy clients." }: { heading?: string }) {
  const track = [...REVIEWS, ...REVIEWS];
  return (
    <section aria-label="Reviews from LINK Wealth clients" className="py-16 sm:py-20">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-xl font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
          {heading}
        </h2>
        <span className="flex gap-5">
          <a
            href="/reviews"
            className="text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            The reviews page →
          </a>
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Verify on Google →
          </a>
        </span>
      </div>
      <p className="container-x mt-3 text-sm font-semibold text-ink/55">
        {SITE.reviews.count} Google reviews at {SITE.reviews.rating.toFixed(1)} stars.
      </p>

      <div className="marquee mt-10 overflow-hidden">
        <div className="marquee-track flex w-max gap-5">
          {track.map((r, i) => (
            <figure
              key={i}
              aria-hidden={i >= REVIEWS.length}
              className="flex w-[330px] shrink-0 flex-col rounded-[25px] bg-[#f1f1f1] p-7 sm:w-[373px]"
            >
              <ReviewStars />
              <blockquote className="mt-4 line-clamp-6 text-[15px] leading-[1.45] text-ink">
                {r.text}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-ink"
                  style={{ backgroundColor: REVIEW_TINT }}
                >
                  {reviewInitials(r.name)}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{r.name}</span>
                  <span className="block text-[13px] text-ink/55">Google review</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
