"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

// Real Google reviews, copied verbatim from the live site's review widget on
// 2026-08-08 - Wealth clients only. (The old widget mixed in LINK Advisors'
// accounting reviews, which belong to a different Google listing; those are
// deliberately not carried over.)
const REVIEWS: { name: string; text: string }[] = [
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
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-wealth-dark" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ heading = "Hear from our happy clients." }: { heading?: string }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? REVIEWS : REVIEWS.slice(0, 6);
  return (
    <section className="bg-cloud py-16 sm:py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
          <p className="text-sm font-semibold text-ink/70">
            Google rating {SITE.reviews.rating.toFixed(1)} · based on {SITE.reviews.count} reviews
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <figure key={r.name} className="flex flex-col gap-3 rounded-xl2 border border-line bg-white p-6">
              <Stars />
              <blockquote className="text-[0.95rem] leading-relaxed text-ink/75">
                {r.text}
              </blockquote>
              <figcaption className="mt-auto pt-2 text-sm font-bold text-ink">{r.name}</figcaption>
            </figure>
          ))}
        </div>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="btn btn-ghost mx-auto mt-8 block"
          >
            Show more reviews
          </button>
        )}
      </div>
    </section>
  );
}
