"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

// All 24 reviews the old homepage widget served, verbatim (Google, 5.0 avg
// across 262). Names and text untouched.
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

export function Testimonials({ heading = "Hear from our happy clients." }: { heading?: string }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? REVIEWS : REVIEWS.slice(0, 6);
  return (
    <section className="bg-ink py-20 text-white">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight sm:text-[50px]">
            {heading}
          </h2>
          <p className="mt-5 text-lg text-white/70">
            {SITE.reviews.count} Google reviews at {SITE.reviews.rating.toFixed(1)} stars. A few
            recent ones:
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <figure key={r.name} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p aria-hidden className="text-advance-bright">
                ★★★★★
              </p>
              <blockquote className="mt-3 text-sm leading-relaxed text-white/75">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-white/90">
                {r.name}
                <span className="ml-2 font-normal text-white/40">Google review</span>
              </figcaption>
            </figure>
          ))}
        </div>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="btn mt-8 border border-white/25 text-white hover:border-white"
          >
            Show more reviews
          </button>
        )}
      </div>
    </section>
  );
}
