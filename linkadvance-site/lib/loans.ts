import type { LoanPageData } from "@/components/LoanPage";

// The thirteen loan service pages: one head term each, copy rewritten
// answer-first from the old site's facts. Slugs carried 1:1.

export const LOAN_PAGES: Record<string, LoanPageData> = {
  "home-loans-brisbane": {
    path: "/home-loans-brisbane",
    serviceName: "Home loans",
    serviceDescription:
      "Home loan broking across 35+ lenders: owner-occupier loans found, negotiated and managed by one Brisbane broker end to end.",
    crumbName: "Home Loans Brisbane",
    eyebrow: "Home loans",
    h1: "Home loans in Brisbane, done properly.",
    h1Mark: "done properly.",
    intro:
      "A home loan is the biggest financial decision most people ever make, and the lender's job is to sell you theirs. Ours is to compare 35+ of them, negotiate the one that fits, and stay on it for the life of the loan.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-2025-Web-scaled.jpg",
    heroImageAlt: "The LINK Advance mortgage broking team in Fortitude Valley, Brisbane",
    bullets: [
      "One broker from first coffee to settlement and beyond, never a call centre",
      "35+ lenders compared, not just the big four",
      "Ongoing repricing: we go back to your lender when the market moves, so you don't quietly drift onto a lazy rate",
    ],
    sections: [
      {
        heading: "What a broker actually does for you.",
        paragraphs: [
          "Banks approve applications that fit their credit policy, and every lender's policy is different. The same income, deposit and property can be a decline at one lender and a sharp approval at another. We know those policies inside out, so your application goes to lenders picked for your situation, prepared the way their credit teams want to see it.",
          "Before anything is submitted, we run our own checks and clear the issues a lender would query. That's why broker applications move faster: the surprises are dealt with before the bank sees them.",
        ],
      },
      {
        heading: "The process, from first chat to settlement.",
        paragraphs: [
          "It starts with a conversation about what you're trying to do: buy, upgrade, invest, or just find out where you stand. For plenty of clients that conversation happens a year or more before they buy, and that's fine; the plan is free. From there the path is predictable, and we drive every step of it:",
        ],
        bullets: [
          "First meeting: your situation, your goals and a plan, in our Fortitude Valley office, by video or by phone",
          "Lender shortlist: your income, deposit and property type matched against real credit policies, not a comparison-site table",
          "Pre-approval: typically a few days to two weeks depending on the lender, so your offers carry weight",
          "Contract signed: we run formal approval, usually one to three weeks, and keep the agent and your solicitor in the loop",
          "Settlement and beyond: we check the loan is set up properly, then reprice it with your lender every year after",
        ],
      },
      {
        heading: "What it costs: usually nothing.",
        paragraphs: [
          "For home loans, brokers are paid commission by the lender you settle with, not by you, and we tell you exactly what that commission is. You get the comparison, the negotiation and the ongoing repricing without a fee, and the rate you get is the same or better than going direct.",
          "The costs that do exist sit with the lender and the government, and we put them in front of you before you apply: application or settlement fees (many lenders charge none), valuation (often covered by the lender), government registration fees, and lenders mortgage insurance if you borrow more than 80% of the property's value. LMI is the big one, and it's avoidable in more ways than most people realise: a bigger deposit, a guarantor, the First Home Guarantee, or a professional waiver if your occupation qualifies.",
        ],
      },
      {
        heading: "How lenders actually assess you.",
        paragraphs: [
          "Every lender runs your application through the same broad machine: income, commitments, living expenses and deposit, stress-tested with repayments assessed about 3 percentage points above the actual rate under APRA's serviceability buffer. But the settings inside that machine differ enormously. One lender counts 80% of your bonus income, another counts none. One is comfortable with casual employment after a few months, another wants a year. One takes your most recent year of self-employed income, another averages two.",
          "That spread is the broker's raw material. Your borrowing power isn't one number; it's a range across 35+ lenders, and the difference between the bottom and the top of that range is often six figures. We aim your application at the lender whose policy reads your situation most favourably.",
        ],
      },
      {
        heading: "A worked example: what a deposit really buys.",
        paragraphs: [
          "Take a $750,000 house (an example, not a quote). A 20% deposit is $150,000: you borrow $600,000 and avoid lenders mortgage insurance entirely. A 10% deposit is $75,000: you borrow $675,000 plus LMI, which on a loan that size typically runs to five figures; our LMI calculator gives the exact number for your scenario. A 5% deposit is $37,500, realistic without LMI only through the First Home Guarantee or a guarantor.",
          "On top of the deposit come the costs people forget: transfer (stamp) duty, legal and conveyancing fees, building and pest inspections, and lender fees. The stamp duty calculator gives Queensland figures for your price and situation in seconds, and we build the full cash-to-complete picture with you before you make an offer.",
        ],
      },
      {
        heading: "Common mistakes we see Brisbane buyers make.",
        paragraphs: [
          "Most expensive home loan problems are avoidable, and almost all of them happen before the application:",
        ],
        bullets: [
          "Applying with several lenders directly, scattering credit enquiries that drag the score down",
          "Taking the pre-approval from the first bank that says yes, then discovering the formal terms are worse",
          "Going unconditional on a contract before finance is properly approved",
          "Ignoring the structure: no offset, the wrong split, or a fixed rate that blocks plans you already have",
          "Setting and forgetting: staying on the same rate for years while the lender prices new customers sharper",
        ],
      },
      {
        heading: "Start with your own numbers.",
        paragraphs: [
          "Two minutes with the borrowing power estimator and the repayments calculator will frame the whole conversation: what a lender is likely to let you borrow, and what it costs per month at today's rates. Bring those numbers to a free chat and we'll tell you which lenders see your situation most favourably.",
        ],
      },
    ],
    features: [
      { title: "Know what the banks want.", body: "Credit policies, assessment buffers and the way applications are read, matched to your situation before anything is submitted." },
      { title: "One broker, the whole way.", body: "The person who meets you is the person who settles your loan and reprices it every year after." },
      { title: "Cost front of mind.", body: "Rate matters, but so do offsets, fees and structure. We compare the whole loan, not the headline number." },
    ],
    faqs: [
      { q: "How much does a mortgage broker cost in Brisbane?", a: "For standard home loans, nothing. The lender pays the broker a commission on settlement, which we disclose to you in full. Some complex commercial or private lending work carries a fee, and it's agreed in writing before any work starts." },
      { q: "Do brokers get better rates than the banks offer directly?", a: "Often, yes. Lenders offer brokers discretionary pricing to win business, and because we compare 35+ of them, the lender knows your application walks if the rate isn't sharp. We also reprice existing loans, going back to your lender when the market moves." },
      { q: "How much deposit do I need for a home loan?", a: "Most lenders want 20% to avoid lenders mortgage insurance (LMI), but you can buy with 10% or even 5%: paying LMI, using a guarantor, or through the federal First Home Guarantee if you're eligible. Our LMI calculator shows what the trade-off costs." },
      { q: "How long does home loan approval take?", a: "Pre-approval typically takes a few days to two weeks depending on the lender; formal approval after you've signed a contract usually runs one to three weeks. Lender turnaround times vary a lot. Part of our job is knowing who's fast right now." },
      { q: "Fixed or variable?", a: "It depends on what you need certainty on. Fixed gives you repayment certainty but less flexibility (limited extra repayments, no offset with most lenders, break costs). Variable moves with the market but keeps offsets and unlimited extra repayments. Many clients split the loan and take both." },
      { q: "Can I get a home loan if I'm self-employed?", a: "Yes, and it's a broker specialty. Most lenders want two years of ABN income, some will lend on one, and low-doc options exist where the financials are still catching up to the business. The lender matters far more here than for salaried applicants, because policies on self-employed income differ wildly. We match the lender to how your business actually pays you." },
      { q: "What is the 3% serviceability buffer?", a: "Australian lenders must assess whether you could still afford the repayments if rates rose about 3 percentage points above the rate you're actually offered. It's an APRA requirement, and it's the main reason your borrowing power is lower than the raw repayment maths suggests. Some lenders apply a reduced buffer to like-for-like refinances; policies vary, and we know which is which." },
      { q: "Should I get pre-approval before making an offer?", a: "In almost every case, yes. Pre-approval tells you your real budget, makes your offer credible to agents, and surfaces problems while there's still time to fix them. It typically lasts around three months and can be refreshed. At auction you're bidding unconditionally, so there pre-approval isn't just useful, it's essential." },
      { q: "What documents do I need to apply?", a: "Identification, payslips or business financials, bank statements showing your deposit and spending, and details of any debts. We give you a short checklist upfront, sanity-check everything before a lender sees it, and chase whatever's missing so the application goes in complete. Incomplete files are the single biggest cause of slow approvals." },
    ],
    related: [
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
      { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
      { label: "Mortgage broker vs bank", href: "/blog/home-loans/mortgage-broker-vs-bank" },
    ],
    reviewService: "Home purchase",
    reviewHeading: "What people buying a home say about it.",
    reviewIntro:
      "Reviews from clients who came to us to buy, unedited and all on Google.",
    subject: "Home loans",
  },

  "refinancing-brisbane": {
    path: "/refinancing-brisbane",
    serviceName: "Refinancing",
    serviceDescription:
      "Home loan refinancing: rate reviews, debt consolidation and equity access across 35+ lenders, with ongoing repricing after you switch.",
    crumbName: "Refinancing",
    eyebrow: "Refinancing",
    h1: "Refinance your home loan, or make your lender earn it.",
    h1Mark: "make your lender earn it.",
    intro:
      "Most people's loans quietly drift onto a worse rate than their lender offers new customers. A refinance review compares your loan against 35+ lenders, and sometimes the best move is making your current lender match, which costs you nothing at all.",
    heroImage: "/wp-content/uploads/2023/01/hugh.jpg",
    heroImageAlt: "Hugh, co-founder of LINK Advance, Brisbane mortgage brokers",
    bullets: [
      "Free loan review against 35+ lenders, including your own",
      "Lower repayments, debt consolidation, or equity out for the next move",
      "Ongoing repricing after you switch, so the drift never restarts",
    ],
    sections: [
      {
        heading: "Three reasons people refinance.",
        paragraphs: ["Almost every refinance is one of these:"],
        bullets: [
          "Rate and repayments: the loyalty tax is real; long-standing customers routinely pay more than new ones for the same loan",
          "Consolidation: rolling cards and personal loans into the mortgage to cut the total interest bill (with a plan so the debt doesn't creep back)",
          "Equity: funding renovations, an investment property or the next stage, using the value your home has built",
        ],
      },
      {
        heading: "What switching actually costs.",
        paragraphs: [
          "Refinancing has real costs, and the honest way to decide is to put them against the saving. The typical bill: a discharge fee from your old lender (usually $150-$400), government fees to release and register the mortgage (a few hundred dollars), and sometimes an application or settlement fee with the new lender, though many charge nothing and some pay cashbacks that more than cover the switch.",
          "Two costs deserve special care. Break costs on a fixed rate can run to thousands and depend on wholesale rates at the moment you break, so we get the exact payout figure before recommending anything. And if your equity is under 20% of the property's value, a new lender will charge lenders mortgage insurance again, even if you paid it once already. LMI re-triggering kills more refinances than any other single number, and we check it first.",
        ],
      },
      {
        heading: "The refinance process, step by step.",
        paragraphs: [
          "Refinancing is far less work than the original purchase. The realistic timeline:",
        ],
        bullets: [
          "Review (days): we compare your loan against 35+ lenders, including a repricing request to your own",
          "Application (about a week): one application to the chosen lender, prepared and submitted by us",
          "Approval and valuation (one to two weeks): many refinance valuations are desktop, which speeds things up",
          "Discharge and settlement (two to four weeks): your old lender is often the slow party, and we chase them so you don't have to",
        ],
      },
      {
        heading: "A worked example: the loyalty tax in dollars.",
        paragraphs: [
          "Suppose you owe $600,000 and your rate has drifted 0.5 percentage points above what the same lender offers a new customer for the same loan. That gap alone costs about $3,000 a year in extra interest ($600,000 x 0.5%). Against typical switching costs of well under $1,000, often with a cashback on top, the payback period is measured in months. This is an example, not a quote: your gap might be larger or smaller, and the review measures it precisely.",
          "The same arithmetic shows when switching isn't worth it: a 0.1 point gap on a $300,000 balance is $300 a year ($300,000 x 0.1%), which a repricing call can usually close with no paperwork at all.",
        ],
      },
      {
        heading: "When refinancing isn't worth it.",
        paragraphs: [
          "Honest answer: sometimes it isn't. Fixed-rate break costs, small balances, short remaining terms or LMI re-triggering (if your equity is under 20%) can eat the gain. Part of the review is telling you when to stay put, and then squeezing your current lender for a better deal instead. That repricing call is free and takes us minutes.",
        ],
      },
      {
        heading: "Mistakes that eat the savings.",
        paragraphs: [
          "The refinances that disappoint usually made one of these calls:",
        ],
        bullets: [
          "Chasing a cashback onto a loan with a worse rate: the bonus is gone in a year, the rate lasts decades",
          "Resetting a loan you've paid down for years to a fresh 30-year term without keeping repayments up: lower monthly cost, more total interest",
          "Consolidating short-term debts into the mortgage, then rebuilding the card balances",
          "Comparing headline rates while ignoring offsets, fees and how you actually bank",
          "Breaking a fixed rate without getting the exact break cost first",
        ],
      },
      {
        heading: "Start with the health check.",
        paragraphs: [
          "The home loan health check takes two minutes and tells you whether your loan is worth reviewing: rate drift, structure, offset use and fit. If it flags a gap, the free broker review does the real comparison.",
        ],
      },
    ],
    features: [
      { title: "The whole market, incl. your lender.", body: "Sometimes the win is a switch; sometimes it's your own bank matching. We play both." },
      { title: "Numbers before names.", body: "You see the savings math (rate, fees, break costs, cashbacks) before any application." },
      { title: "Repricing forever.", body: "After you settle, we keep going back to the lender when the market moves. Most clients never need to refinance twice." },
    ],
    faqs: [
      { q: "How much does it cost to refinance?", a: "Typical costs are a discharge fee from your old lender (usually $150-$400), government registration fees (a few hundred dollars), and possibly a new application fee, often offset by lender cashbacks. If you're on a fixed rate, break costs can be significant; we calculate them before recommending anything." },
      { q: "Will refinancing hurt my credit score?", a: "A single refinance application has a small, short-lived effect. What hurts scores is scattering applications across multiple lenders, which is exactly what going direct tends to do, and what a broker avoids by applying once, to the right lender." },
      { q: "How often should I review my home loan?", a: "Annually, or whenever rates move meaningfully. That doesn't mean refinancing annually. Most reviews end with a repricing call to your existing lender, which costs nothing and takes days." },
      { q: "Can I refinance to consolidate debts?", a: "Usually, if you have the equity and the income to service the consolidated loan. It can cut your total interest dramatically, but stretching a car loan over 30 years costs more in the end unless you keep repayments up. We structure it so the win is real." },
      { q: "Can I get cash out for renovations or investing?", a: "If your equity supports it, yes. Lenders will typically lend up to 80% of your property's value without LMI. The refinancing review shows your usable equity and what accessing it does to repayments." },
      { q: "How long does refinancing take?", a: "Four to eight weeks end to end is typical: days for the comparison, about a week for the application, one to two weeks for approval, and the rest waiting on your old lender's discharge team. A repricing outcome with your existing lender takes days. If you're working to a deadline (a fixed rate expiring, a purchase settling), tell us and we pick lenders that are fast right now." },
      { q: "Do I have to refinance to get a better rate?", a: "No, and often you shouldn't. Lenders hold their sharpest pricing for customers who ask, and a repricing request (which we make for you, free) frequently closes most of the gap without switching. Refinancing wins when your lender won't move, when the structure is wrong, or when you need equity out or debts consolidated." },
      { q: "Can I refinance if my property has gone up in value?", a: "Rising value helps twice: it can push your equity past 20%, removing LMI from the equation and unlocking sharper pricing tiers, and it increases the equity you can access for renovations or investing. The new lender's valuation sets the number, and valuations vary between lenders; when a result looks light we test it elsewhere." },
      { q: "What documents do I need to refinance?", a: "Less than you'd think: identification, recent payslips or financials, statements for the loan you're refinancing and any other debts, and a council rates notice for the property. Most of it is digital now. We hand you a short checklist and do the assembly." },
    ],
    related: [
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
      { label: "Refinancing after separation or divorce", href: "/blog/home-loans/refinancing-your-home-loan-after-separation-or-divorce" },
      { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
    ],
    ctaHeading: "One free review. Two ways to win.",
    ctaIntro: "Either we find a sharper loan across 35+ lenders, or we make your current lender price-match. Both start with the same free review.",
    reviewService: "Refinance",
    reviewHeading: "What people who refinanced say about it.",
    reviewIntro:
      "Reviews from clients who came in to refinance, including the ones we repriced without switching lenders.",
    subject: "Refinancing",
  },

  // NEW page (10 Aug 2026): "bridging loan" 4,409/mo at KD 53 and no
  // Brisbane broker owns the term. The content play is the mechanics
  // nobody explains properly: peak debt, end debt, the worked example.
  "bridging-loans": {
    path: "/bridging-loans",
    serviceName: "Bridging loans",
    serviceDescription:
      "Bridging finance for buying your next home before the current one sells: peak debt, end debt and capitalised interest explained, compared across the lenders that do bridging well.",
    crumbName: "Bridging Loans",
    eyebrow: "Bridging finance",
    h1: "Buy the next home before this one sells.",
    h1Mark: "before this one sells.",
    intro:
      "A bridging loan covers the gap between buying your next home and settling the sale of your current one, so you never have to win both settlements on the same day, or let the right house go because yours hasn't sold yet. It's specialist lending: only some lenders do it, fewer do it well, and the structure matters more than the rate.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-the-boys-2025-web-scaled.jpg",
    heroImageAlt: "Jacob, Callum and Hugh, the LINK Advance brokers in Brisbane",
    bullets: [
      "Buy first, sell second, move once: no rentals, no double moves, no rushed sale",
      "Interest usually capitalised during the bridge, so you're not paying two mortgages from cash flow",
      "Compared across the lenders that actually do bridging well, with the exit numbers stress-tested first",
    ],
    sections: [
      {
        heading: "How a bridging loan works: peak debt and end debt.",
        paragraphs: [
          "During the bridge you briefly owe two amounts at once. Peak debt is everything combined: your existing home loan, plus the purchase price of the new home, plus costs like stamp duty, usually with the bridging interest added on top rather than paid monthly. End debt is what's left after your old home sells and the proceeds come off the pile: it becomes your ordinary home loan and has to be serviceable on your income like any other loan.",
          "A worked example: you owe $400,000 on a home that should sell for $900,000, and you're buying at $1,100,000 with about $50,000 of costs. Peak debt is roughly $1,550,000 plus capitalised interest. Your sale clears about $880,000 after agent fees, leaving an end debt around $670,000. The lender's real question is whether you can service that $670,000, and whether the sale assumptions behind it are honest. That's the assessment we build before anything is submitted.",
        ],
      },
      {
        heading: "The terms that actually matter.",
        paragraphs: [
          "Bridging terms usually run up to 6 months when you're buying an established home, and up to 12 months when you're building. Most lenders cap total lending around 80% of the combined value of both properties, which is why bridging works best when there's solid equity in the current home. Interest is charged at variable rates and is usually capitalised into peak debt, though you can service it monthly to keep the balance down if cash flow allows.",
          "The honest risks: if the old home sells slower or lower than assumed, the capitalised interest keeps compounding and the end debt lands higher than planned. We stress the numbers with a longer sale window and a softer price before recommending the bridge, and if they don't hold, we'll tell you to sell first instead.",
        ],
      },
      {
        heading: "The process and timeframes.",
        paragraphs: [
          "Bridging approvals run on the same machinery as normal home loans, plus two extras: a valuation on each property and a serviceability case for the end debt. Realistically: the numbers and the stress-test with your broker first (a day or two), the application with valuations on both properties (one to two weeks), then approval and settlement on your purchase timeline. If you've already signed a contract, say so immediately: bridging is one of the products where lender turnaround differences matter most, and the shortlist changes when the clock is running.",
          "After you move, the clock runs on the bridge term. We stay on the sale side too: the earlier the old home lists, the less interest capitalises, and if the sale completes early the bridge simply ends early. There's no penalty for beating the deadline.",
        ],
      },
      {
        heading: "When bridging is the wrong tool.",
        paragraphs: [
          "Bridging isn't for everyone. If your equity is thin, if the end debt only works at a best-case sale price, or if your market is slow, alternatives usually win: selling first with a longer settlement or a rent-back agreement, negotiating the purchase subject to sale, or using a deposit bond to secure the new place while your sale catches up. Part of the job is telling you which of these your numbers actually support: the answer is bridging often enough that the product exists, and not so often that it should be anyone's default.",
        ],
      },
    ],
    features: [
      { title: "The exit is the loan.", body: "Bridging approval lives or dies on the end debt. We build that case first: sale evidence, serviceability, buffer." },
      { title: "Only lenders who bridge well.", body: "Policies differ wildly: capitalised interest caps, term limits, valuation appetite. We know who's genuinely good at this." },
      { title: "One broker, both loans.", body: "The bridge and the end-debt loan are structured together, so you're not refinancing again the month after you move." },
    ],
    faqs: [
      { q: "How does a bridging loan work?", a: "The lender temporarily finances both properties at once: your existing loan, the new purchase and costs combine into a peak debt, usually with interest capitalised so there are no extra repayments during the bridge. When your old home sells, the proceeds reduce the pile and the remainder becomes your ordinary home loan (the end debt). Terms typically run up to 6 months for established homes and 12 months when building." },
      { q: "How much equity do I need for a bridging loan?", a: "Most lenders want total lending (peak debt, including capitalised interest) to stay around 80% of the combined value of both properties. In practice that means meaningful equity in your current home. The stronger the equity, the more comfortable the numbers, and the better the pricing." },
      { q: "Do I make repayments during the bridging period?", a: "Usually you keep paying your existing loan as normal, and the bridging interest is capitalised (added to the balance) rather than paid monthly. Some borrowers choose to service the bridging interest to stop the balance growing. We model both so you can see the difference in dollars." },
      { q: "What happens if my house doesn't sell in time?", a: "This is the real risk, and the reason bridging needs honest numbers up front. If the term expires unsold, lenders can extend, reprice or ultimately require the property be sold. We stress-test the plan with a slower sale and a softer price before recommending a bridge, and set the term with margin rather than optimism." },
      { q: "Is a bridging loan expensive?", a: "Rates are typically variable and a little above standard owner-occupier rates, and because interest capitalises, the cost grows with time. A three-month bridge on honest numbers is usually cheap compared with a double move, storage and rent. A twelve-month bridge on hopeful numbers is not. The worked numbers decide it." },
      { q: "Can I buy subject to sale instead?", a: "Sometimes, and when the market's in your favour it can beat bridging: no extra interest at all. But subject-to-sale offers are weaker offers, and in a competitive market they lose. Bridging exists so you can make a clean, unconditional offer. Which tool fits depends on your equity, your suburb's pace and your appetite; we'll give you a straight recommendation." },
      { q: "Which lenders offer bridging loans?", a: "Fewer than you'd expect. Several major banks and a handful of non-bank lenders write bridging, and their policies differ on the things that matter: whether interest can capitalise, maximum terms, how they treat the end debt and how conservative their valuations run. That's why bridging is broker territory: the sharpest bridge for your numbers is rarely at the bank you already use." },
      { q: "Is bridging finance the same as a deposit bond?", a: "No. A deposit bond only covers the deposit at exchange (a guarantee, not cash), and you still need to fund the full purchase at settlement. A bridging loan funds the whole purchase before your sale completes. They solve different problems, and sometimes the cheaper deposit bond is all you actually need; we'll tell you which applies." },
    ],
    related: [
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Stamp duty calculator QLD", href: "/stamp-duty-calculator-qld" },
      { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
    ],
    ctaHeading: "Thinking of buying before you sell?",
    ctaIntro: "Bring the addresses and the loan balance. A broker will run the peak-debt and end-debt numbers with you, stress-tested, free.",
    reviewService: "Bought & sold",
    reviewHeading: "What people who bought and sold say about it.",
    reviewIntro:
      "Reviews from clients doing both ends at once, which is the situation bridging exists for.",
    subject: "Bridging loans",
  },

  "first-home-buyers-loan": {
    path: "/first-home-buyers-loan",
    serviceName: "First home buyer loans",
    serviceDescription:
      "First home buyer broking in Brisbane: deposit strategy, FHOG QLD, the First Home Guarantee, pre-approval and settlement with one broker.",
    crumbName: "First Home Buyers",
    eyebrow: "First home buyers",
    h1: "Your first home loan, without the second-guessing.",
    h1Mark: "without the second-guessing.",
    intro:
      "You've never done this before. We do it every week. One broker walks you from \"can we even buy?\" through deposit strategy, grants, pre-approval, the contract and settlement, answering the questions you didn't know to ask.",
    heroImage: "/wp-content/uploads/2026/05/Callum-Advance-1024x1024-LinkedIn-Grey-Square.png",
    heroImageAlt: "Callum, first home and investment broker at LINK Advance in Brisbane",
    bullets: [
      "Deposit strategy: 5% with the First Home Guarantee, guarantor options, or LMI, with the trade-offs in real dollars",
      "Every grant and concession claimed: FHOG QLD, stamp duty concessions, the Guarantee",
      "Pre-approval before you fall in love with a place, so your offer means something",
    ],
    sections: [
      {
        heading: "What you can get as a first home buyer in QLD.",
        paragraphs: ["Stack these before you look at a single listing:"],
        bullets: [
          "First Home Owner Grant: $30,000 toward a new build or substantially renovated home in Queensland (eligibility applies)",
          "Stamp duty relief: first home concessions that can save tens of thousands on established homes",
          "First Home Guarantee: buy with 5% deposit and no LMI under the federal scheme, now with no income caps and unlimited places",
          "First home super saver: releasing voluntary super contributions for the deposit",
        ],
      },
      {
        heading: "What buying costs beyond the deposit.",
        paragraphs: [
          "The deposit is the headline number, but settlement day has a supporting cast of costs. Budget for them early and nothing ambushes you:",
        ],
        bullets: [
          "Transfer (stamp) duty: since May 2025, Queensland first home buyers pay none on new builds, and the concession on established homes now extends to $800,000",
          "Legal and conveyancing: the solicitor who checks the contract and runs settlement",
          "Building and pest inspections: a few hundred dollars that can save you tens of thousands",
          "Lenders mortgage insurance: only if you borrow above 80% without the First Home Guarantee or a guarantor",
          "The move itself: connections, removalists, and the first repairs every home needs",
        ],
      },
      {
        heading: "The path, start to finish.",
        paragraphs: [
          "First a free chat about where you are: deposit, income, timeframe. Then the numbers: what you can borrow, what it costs monthly, which grants you qualify for. Then pre-approval with a lender chosen for your situation, so you can make offers with confidence. When a contract is signed we run the approval, liaise with your solicitor and the agent, and get you to settlement. After that, we reprice your loan every year, so you'll never pay the loyalty tax.",
        ],
      },
      {
        heading: "A worked example: buying at $650,000 with 5% down.",
        paragraphs: [
          "An example with checkable arithmetic, not a quote. You buy an established Brisbane home for $650,000 under the First Home Guarantee: your deposit is 5%, which is $32,500, and the loan is $617,500 with no LMI because the federal government guarantees the gap. Stamp duty falls under the Queensland first home concession, which now applies to established homes up to $800,000. Your remaining cash covers conveyancing, inspections and the move.",
          "The same purchase without the Guarantee would need either a 20% deposit ($130,000) to avoid LMI, or LMI running to five figures on a 5-10% deposit. That difference is why we check your Guarantee eligibility before anything else.",
        ],
      },
      {
        heading: "Tips for first home buyers.",
        paragraphs: [
          "Do your homework before the property search: start with your finances: the repayments you can afford without overextending, the budget trade-offs, and the loan size you'd qualify for. That homework lays the foundation for the entire process, and the grants above can shift the numbers substantially.",
          "Research the home itself: write the list before you look (must-haves, nice-to-haves, must-not-haves), because no house is perfect and knowing your compromises in advance beats discovering them under offer.",
          "And you're not on this journey alone: a broker finds your maximum borrowing capacity, figures out repayments, identifies the unexpected costs, checks your grant eligibility and does the lender legwork, the same path hundreds of first home buyers have taken with us.",
        ],
      },
      {
        heading: "Different circumstances? There's a loan for that.",
        paragraphs: ["If the standard path doesn't fit, specialist lending usually does:"],
        bullets: [
          "Professionals: doctors and other eligible professions can access loans with LMI completely waived (see our home loans for doctors page)",
          "Guarantor loans: when the deposit isn't there yet, family security can bridge it",
          "Unusual employment: self-employed and contractors have more doors than the banks suggest; matching the lender to the income type is the job",
        ],
      },
      {
        heading: "Meet Callum, the first home specialist.",
        paragraphs: [
          "First home buyers work with Callum: five years on both sides of the desk (loan processing and broking), a Bachelor of Business in Economics and Finance, and a habit of answering the questions you didn't know you had. He cuts the process down to what actually matters this week.",
        ],
      },
    ],
    faqs: [
      { q: "How much deposit do I need to buy my first home?", a: "As little as 5% under the First Home Guarantee (no LMI, subject to property price caps), or 10-15% paying LMI, or 20% avoiding it entirely. A guarantor can take the cash deposit needed to near zero. The right answer depends on how the numbers trade off. That's the first thing we model with you." },
      { q: "Am I eligible for the $30,000 First Home Owner Grant?", a: "In Queensland the grant applies to new builds and substantially renovated homes (not established homes), with eligibility rules on prior property ownership, residency and value caps. Our First Home Buyers Grant QLD page walks through every test, and the eligibility checker gives you an answer in two minutes." },
      { q: "What's the difference between pre-approval and approval?", a: "Pre-approval is a lender's conditional yes to your borrowing amount before you've found a property. It makes your offers credible. Formal approval happens after you've signed a contract, when the lender values the actual property. We line both up so there are no surprises between them." },
      { q: "How much can I actually borrow?", a: "Lenders assess your income, commitments and living expenses, then stress-test the repayments about 3 percentage points above the actual rate. Our borrowing power estimator gives you the indicative range in two minutes; a broker conversation firms it up per lender." },
      { q: "What does the broker cost?", a: "Nothing for standard home loans. The lender pays us on settlement, and we disclose the commission. First-home help, grant paperwork and the guidance through to settlement are all part of it." },
      { q: "Can I combine the First Home Owner Grant with the First Home Guarantee?", a: "Yes. They're separate schemes: the $30,000 FHOG is a Queensland grant for new builds, and the First Home Guarantee is a federal scheme letting you buy with a 5% deposit and no LMI. If you're building your first home you may be eligible for both, plus zero stamp duty on the new build. Stacked properly, the schemes can shrink the cash you need by tens of thousands." },
      { q: "Do first home buyers pay stamp duty in Queensland?", a: "Often not. Since May 2025, Queensland first home buyers pay no transfer duty on new builds, and the first home concession on established properties extends to $800,000. Above the thresholds, duty phases in. The stamp duty calculator gives your exact figure; the rules turn on the property, the price and your ownership history, so check before you set a budget." },
      { q: "Can my parents help me buy without giving me money?", a: "Yes, as guarantors: they offer part of their own home's equity as additional security, which can remove the need for a cash deposit and for LMI. The guarantee is usually limited to a set amount and released once your equity grows. It puts real obligations on them, so lenders require independent advice, and we walk both generations through exactly what's being signed." },
      { q: "How long does buying a first home take?", a: "From first chat to keys, commonly two to four months, but the finance milestones are quick: pre-approval in days to two weeks, formal approval one to three weeks after you sign a contract, then settlement on whatever timeframe the contract sets (often 30 to 90 days in Queensland). The slow part is finding the home; get pre-approved before you start looking and the rest keeps pace." },
    ],
    related: [
      { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
      { label: "First Home Guarantee", href: "/first-home-guarantee" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Stamp duty calculator QLD", href: "/stamp-duty-calculator-qld" },
    ],
    reviewService: "First home",
    reviewHeading: "What first home buyers say about it.",
    reviewIntro:
      "Eight of the reviews below came from people buying their first home. They are unedited, and every one of them is on Google.",
    subject: "First home buyers",
  },

  "investment-home-loans": {
    path: "/investment-home-loans",
    serviceName: "Investment property loans",
    serviceDescription:
      "Investment property loan broking: structure, interest-only options, equity release and portfolio lending across 35+ lenders.",
    crumbName: "Investment Loans",
    eyebrow: "Investment loans",
    h1: "Investment loans built for the portfolio, not just the purchase.",
    h1Mark: "not just the purchase.",
    intro:
      "The wrong loan structure costs investors more than the wrong rate. We set up investment lending so this purchase works, and the next one is still possible: equity release, offsets in the right places, and lenders chosen for how they treat rental income.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-the-boys-2025-web-scaled.jpg",
    heroImageAlt: "Jacob, Callum and Hugh, the LINK Advance brokers in Brisbane",
    bullets: [
      "Structure first: interest-only vs P&I, offsets, splits, and keeping deductible debt clean",
      "Lenders picked for investor policy: rental income shading, portfolio limits and trust lending differ wildly",
      "Equity release from your home or existing properties to fund the deposit",
    ],
    sections: [
      {
        heading: "Why structure beats rate for investors.",
        paragraphs: [
          "Two loans with the same rate can behave completely differently at tax time and at the next purchase. Keeping investment debt separate from personal debt protects deductibility; putting the offset against the right loan saves non-deductible interest first; and choosing a lender that shades rental income at 80% versus 70% can be the difference between approval and decline on property two.",
          "We set the structure with your accountant's tax advice in view, and if you don't have one, LINK Advisors is down the hall.",
        ],
      },
      {
        heading: "Using the equity you already have.",
        paragraphs: [
          "Most investors fund their deposit from equity rather than savings: lenders will typically lend against your home up to 80% of its value without LMI, releasing the deposit and costs for the investment purchase. Structured properly, the released equity is investment debt (clean for tax), and your home stays un-cross-collateralised with the new property.",
        ],
      },
      {
        heading: "A worked example: equity into deposit.",
        paragraphs: [
          "An example with checkable arithmetic. Your home is worth $900,000 and you owe $450,000. Most lenders will lend against it up to 80% of value without LMI: 80% of $900,000 is $720,000, so your usable equity is $720,000 minus the $450,000 you owe, which is $270,000.",
          "That's enough to fund a 20% deposit plus purchase costs on an investment property around $650,000 (a $130,000 deposit, plus stamp duty and costs), set up as a separate investment split rather than a top-up tangled into your home loan, with the new property financed on its own. Whether the servicing supports it is the second half of the assessment, and the borrowing power estimator gives you the first read.",
        ],
      },
      {
        heading: "How lenders read an investment application.",
        paragraphs: [
          "Investment serviceability has more moving parts than owner-occupier lending, and every lender sets the dials differently. Rental income is counted but shaded, typically 70-90% of the lease, to allow for vacancy and costs. Your existing debts are assessed with APRA's roughly 3 percentage point buffer on top of actual rates, which bites hard once you hold several loans. Some lenders add back negative gearing benefits; others don't. Some cap their total exposure to one borrower or postcode; others welcome portfolios.",
          "The practical consequence: the same investor with the same properties can be at their ceiling with one lender and have room for two more purchases with another. Sequencing lenders across a portfolio (using the strict ones early, saving the generous ones for later) is one of the most valuable things an investment broker does.",
        ],
      },
      {
        heading: "Who investment lending suits, and who it doesn't.",
        paragraphs: [
          "Property investment works when the holding costs are boring: rent arrives, the gap between rent and repayments fits your budget with margin, and a vacancy or a rate rise is an annoyance rather than a crisis. Investor loans generally price a little above owner-occupier loans, rental income gets shaded, and properties cost money in years they don't grow.",
          "It suits investors with stable income, a cash buffer and a timeframe measured in years. It doesn't suit borrowing to the ceiling with no buffer, or buying for a tax deduction the numbers don't otherwise support. We show you the full holding cost before you commit, including the boring lines: insurance, rates, maintenance and management.",
        ],
      },
      {
        heading: "Common investor mistakes.",
        paragraphs: [
          "The expensive ones are structural, made at settlement and discovered years later:",
        ],
        bullets: [
          "Cross-collateralising: letting one lender secure everything, which hands them control of your equity and your exit",
          "Pointing the offset at the investment loan while non-deductible home debt still exists",
          "Mixing private and investment borrowing in one loan, muddying deductibility forever",
          "Maxing out at a single lender instead of spreading across policies",
          "Buying property two with no plan for how property three will service",
        ],
      },
    ],
    features: [
      { title: "Portfolio thinking.", body: "Every loan is set up with the next purchase in mind: serviceability, equity and lender spread." },
      { title: "Investor policy knowledge.", body: "Rental shading, interest-only appetite, trust and company lending. We know which lender wants your deal." },
      { title: "The group behind it.", body: "Accounting (Advisors), strategy (Wealth) and property management (Living) under the same roof when you want them." },
    ],
    faqs: [
      { q: "Interest-only or principal and interest for an investment loan?", a: "Interest-only maximises cash flow and keeps repayments deductible-heavy, but costs more over the loan's life and reverts to higher P&I repayments later. P&I builds equity and usually prices lower. The right answer depends on your cash flow, tax position and strategy. It's a numbers conversation, not a default." },
      { q: "How much deposit do I need for an investment property?", a: "Typically 20% plus costs to avoid LMI, or 10-12% paying it. Most investors fund this from equity in their home rather than cash. If your home has grown in value, you may need little or no cash savings at all." },
      { q: "Can I use my SMSF to buy an investment property?", a: "Yes, through a limited recourse borrowing arrangement, a different loan type with its own lenders and rules (and around 20-30% deposits). That's our SMSF lending specialty; see the SMSF loans page, and LINK Wealth handles the strategy side." },
      { q: "Will lenders count my rental income?", a: "Yes, but shaded: most count 70-90% of the rent to allow for vacancies and costs, and policies differ on short-term letting. Which lender you pick materially changes your borrowing power; that's a big part of the broker's value for investors." },
      { q: "Do investment loans have higher interest rates?", a: "Generally yes: investor loans price somewhat above equivalent owner-occupier loans, and interest-only adds a little more. The spread varies by lender and moves over time, which is one more reason the comparison matters. Structure can claw some back: pricing improves at lower LVRs, and packaging with your other lending sometimes helps." },
      { q: "How many investment properties can I finance?", a: "There's no fixed limit; the ceiling is serviceability under the assessment buffer, and it arrives sooner than most investors expect. Pushing past it is about lender selection (policies on rental shading and existing debt differ widely), structure, and sometimes lenders who assess portfolio investors more commercially. The order you use lenders in matters." },
      { q: "Should I buy in a trust, a company or my own name?", a: "That's a tax and asset-protection question for your accountant (LINK Advisors, if you don't have one), but it changes the lending too: fewer lenders finance trusts, some price them differently, and guarantees are required from directors or beneficiaries. Decide the structure before the pre-approval, not after; changing mid-purchase means starting the application again." },
      { q: "What is cross-collateralisation and why avoid it?", a: "It's when one lender takes multiple properties as security for the same lending. It feels convenient and usually costs you later: the lender controls valuations across the lot, selling one property can trigger a revaluation of the rest, and moving lenders becomes surgery. Stand-alone loans with deposits raised by equity release keep control with you. It's our default structure for investors." },
    ],
    related: [
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Second tier lenders and your cost of capital", href: "/second-tier-lenders" },
      { label: "SMSF loans", href: "/smsf-mortgage-broker" },
      { label: "Refinancing for equity", href: "/refinancing-brisbane" },
      { label: "So you want to be a property investor", href: "/blog/investor-loans/so-you-want-to-be-a-property-investor" },
    ],
    reviewService: "Investing",
    reviewHeading: "What investors say about it.",
    reviewIntro:
      "Reviews from clients who came in to buy an investment property.",
    subject: "Investment loans",
  },

  "construction-loans-brisbane": {
    path: "/construction-loans-brisbane",
    serviceName: "Construction loans",
    serviceDescription:
      "Construction loan broking in Brisbane: progress-payment lending for new builds, knock-down rebuilds and major renovations.",
    crumbName: "Construction Loans",
    eyebrow: "Construction loans",
    h1: "Construction loans for the build, staged like the build.",
    h1Mark: "staged like the build.",
    intro:
      "A construction loan isn't a home loan with a different name. It pays your builder in progress payments, charges interest only on what's drawn, and lives or dies on the paperwork: fixed-price contract, plans, and a lender who's comfortable with your builder.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-2025-Web-1-scaled.jpg",
    heroImageAlt: "The LINK Advance mortgage broking team in Fortitude Valley, Brisbane",
    bullets: [
      "Progress payments matched to the build stages: deposit, slab, frame, lockup, fixing, completion",
      "Interest-only on drawn funds during the build, converting to a standard loan at completion",
      "Lenders matched to your build type: house and land, knock-down rebuild, owner-builder appetite varies",
    ],
    sections: [
      {
        heading: "How a construction loan actually works.",
        paragraphs: [
          "The lender approves the total (land plus fixed-price build contract), then releases money to your builder in stages as work completes: typically five drawdowns from slab to completion, each after an inspection. You pay interest only on what's been drawn, so repayments start small and step up as the build progresses. At handover the loan converts to a normal home loan, and that conversion moment is when we make sure the rate is sharp.",
        ],
      },
      {
        heading: "What lenders want to see.",
        paragraphs: ["The approvals that go smoothly all have the same file:"],
        bullets: [
          "A fixed-price building contract from a licensed builder (owner-builder is possible but the lender pool shrinks)",
          "Council-approved plans and specifications",
          "Quotes for anything outside the contract: pools, landscaping, driveways",
          "A valuation that supports land plus build cost ('as if complete')",
        ],
      },
      {
        heading: "The progress payments, stage by stage.",
        paragraphs: [
          "Queensland builds run to a standard rhythm, and the loan drawdowns follow it: deposit to the builder, then base (slab down), frame, enclosed (roof on and lockable), fixing (kitchens, bathrooms, internals) and practical completion. At each stage the builder invoices, the lender inspects or values, and payment goes straight to the builder, usually within about a week of the claim.",
          "Two practical notes. First, the lender spends your own contribution on the build before touching the loan, so your deposit goes early; plan cash flow around that. Second, watch that claims match the contract schedule: paying ahead of work done is how builds go wrong, and the lender's inspections are a protection, not a formality.",
        ],
      },
      {
        heading: "Timeframes, honestly.",
        paragraphs: [
          "Expect the finance to take a little longer than a standard purchase: the valuer needs plans, specifications and the building contract to produce the 'as if complete' figure, so allow two to four weeks from complete file to approval. The build itself commonly runs six to twelve months for a standard home, longer for knock-down rebuilds with demolition and site works up front.",
          "During construction your repayments are interest-only on the drawn balance, stepping up as stages complete. Budget for the overlap if you're renting while you build: rent plus growing interest is the squeeze period, and it's the number we stress-test with you before you sign anything.",
        ],
      },
      {
        heading: "New build? Don't leave the grant behind.",
        paragraphs: [
          "New builds in Queensland can qualify for the $30,000 First Home Owner Grant and, for eligible buyers, the First Home Guarantee's 5% deposit path. If it's your first home, the grants and the construction loan need to be sequenced properly; the grant can even form part of your deposit at some lenders.",
        ],
      },
      {
        heading: "Common construction finance mistakes.",
        paragraphs: [
          "Nearly every construction headache we untangle started as one of these:",
        ],
        bullets: [
          "Signing the land contract before knowing the whole package (land plus build) stacks up with a lender",
          "A contract price with no contingency: variations happen on almost every build",
          "Leaving site costs, driveways, landscaping and pools out of the borrowing, then funding them on credit cards",
          "Upgrading finishes mid-build through variations the loan wasn't sized for",
          "Letting the loan roll to an uncompetitive rate at handover instead of repricing at conversion",
        ],
      },
    ],
    faqs: [
      { q: "How much deposit do I need for a construction loan?", a: "Generally the same as a standard loan: 20% of the total (land + build) to avoid LMI, less with LMI or the First Home Guarantee for eligible first-home builders. Land you already own counts toward equity." },
      { q: "Do I pay full repayments during the build?", a: "No. You pay interest only on the amount drawn so far. Repayments step up with each progress payment and convert to normal principal-and-interest at completion." },
      { q: "What if the build goes over budget?", a: "Variations outside the fixed-price contract are yours to fund, which is why lenders (and we) want contingency in your numbers from day one. Significant overruns mid-build can require a loan variation, which is manageable, but far easier if the buffer was planned." },
      { q: "Can I get a construction loan as an owner-builder?", a: "Some lenders will, with lower maximum LVRs and more scrutiny. The panel matters a lot here. It's exactly the kind of niche where a broker earns their keep." },
      { q: "Can I buy the land now and build later?", a: "Yes. A land loan settles the block first, and the construction loan follows when your plans and fixed-price contract are ready. Two cautions: land-only lending is often capped at lower LVRs than a house-and-land package, and some grant and duty concessions carry build-commencement time limits, so the sequence needs a plan rather than a vibe." },
      { q: "What is an 'as if complete' valuation?", a: "The lender values the finished product (land plus the completed build per your plans and contract) before a slab is poured, and lends against that figure. If the valuation comes in under land-plus-contract cost, the gap is yours to cover, which is why we sanity-check the numbers against comparable sales before the application goes in." },
      { q: "Do construction loans cost more than normal home loans?", a: "During the build you're usually on a variable rate paying interest only on drawn funds, so the dollar cost starts small and grows with the build. Some lenders price construction slightly differently until completion. The bigger cost lever is what happens at handover: we reprice or restructure at conversion so you land on a sharp ongoing loan rather than the default one." },
      { q: "What happens if my builder goes broke mid-build?", a: "The scenario everyone fears, and Queensland has real protections: residential work by licensed builders is covered by the QBCC's Home Warranty Scheme, which can cover non-completion up to scheme limits. The lender pauses drawdowns while a replacement contract is arranged, then reassesses. Disruptive but recoverable. Unlicensed building work, by contrast, is the thing never to touch." },
    ],
    related: [
      { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "First Home Guarantee", href: "/first-home-guarantee" },
      { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
    ],
    subject: "Construction loans",
  },

  "smsf-mortgage-broker": {
    path: "/smsf-mortgage-broker",
    serviceName: "SMSF loans",
    serviceDescription:
      "SMSF lending (limited recourse borrowing arrangements) for residential and commercial property, including business owners buying their premises.",
    crumbName: "SMSF Loans",
    eyebrow: "SMSF lending",
    h1: "SMSF loans: property inside super, financed properly.",
    h1Mark: "financed properly.",
    intro:
      "Buying property inside a self-managed super fund uses a special loan (a limited recourse borrowing arrangement) with its own lenders, deposits and compliance rules. It's Jacob's specialty, and the strategy side is handled with the advisers at LINK Wealth.",
    heroImage: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
    heroImageAlt: "Jacob, commercial and SMSF broker at LINK Advance in Brisbane",
    bullets: [
      "Residential and commercial SMSF lending across the specialist lender panel",
      "Business owners: buy your premises through your SMSF and pay rent to your own fund",
      "Strategy and compliance handled with LINK Wealth's licensed advisers",
    ],
    sections: [
      {
        heading: "How SMSF property loans differ.",
        paragraphs: [
          "SMSF loans are limited recourse: if the fund can't pay, the lender's recourse is limited to the property itself, not the rest of your super. That protection makes lenders conservative: expect deposits around 20-30%, a smaller lender panel (most majors have exited), and structural requirements including a bare trust to hold the property. Rates run above standard home loans, which is exactly why the lender comparison matters more here, not less.",
        ],
      },
      {
        heading: "The business-owner play: your premises, your fund.",
        paragraphs: [
          "Commercial property is the standout SMSF strategy for business owners: your fund buys the premises your business operates from, and the business pays market rent to your super instead of a landlord. It's one of the few ways your business and your retirement can fund each other within the rules. Business real property is exempt from the related-party restrictions that stop you doing this with residential property.",
          "The strategy, contribution planning and compliance sit with the licensed advisers at LINK Wealth; the lending sits here. One roof, both halves.",
        ],
      },
      {
        heading: "The structure: how an LRBA is put together.",
        paragraphs: [
          "A compliant SMSF purchase has more entities than a normal one, and the order matters. There's the fund itself (usually with a corporate trustee), a separate bare trust (sometimes called a holding trust) with its own trustee to hold the property while the loan exists, and the lender behind them. The bare trustee signs the purchase contract; the fund pays the deposit and services the loan from rent and contributions; the property transfers to the fund outright once the loan is repaid.",
          "Two rules shape everything. The loan can only fund a single acquirable asset, and borrowed money can't be used to improve the property while the loan exists: repairs are fine, improvements aren't. Get the entity names on the contract wrong and you're into rework and potentially extra duty, which is why the structure is set up before anyone signs anything.",
        ],
      },
      {
        heading: "What SMSF lenders look for.",
        paragraphs: [
          "The specialist lenders all read the same file, with different appetites:",
        ],
        bullets: [
          "LVR: typically 60-80% depending on lender and property type, with commercial at the conservative end",
          "Liquidity: a buffer of fund assets remaining after settlement, so one vacancy doesn't stress the fund",
          "Servicing: rent plus a track record of member contributions, assessed with buffers like any loan",
          "Paperwork: the fund deed, bare trust deed, fund financials and an investment strategy that contemplates the purchase",
        ],
      },
      {
        heading: "The process and timeframes.",
        paragraphs: [
          "If the fund and the advice are already in place, SMSF lending runs a few weeks longer than a standard loan: allow two to six weeks from complete file to approval, plus conveyancing. If the fund doesn't exist yet, the advice, establishment and rollovers come first, which adds weeks to months and belongs with the licensed advisers at LINK Wealth.",
          "The step people underestimate is coordination: the contract must be signed by the right trustee, the deposit must come from the fund's account, and the lender's documentation runs through both trusts. We've run the sequence enough times that it's a checklist, not an adventure.",
        ],
      },
      {
        heading: "A worked example: a fund buys a premises.",
        paragraphs: [
          "An example with checkable arithmetic. A fund holding $400,000 buys a $500,000 commercial property at 70% LVR: the loan is $350,000 and the fund contributes the $150,000 balance plus transaction costs. After settlement, well over $200,000 of the fund stays invested elsewhere, which is exactly the kind of remaining diversification and liquidity lenders and advisers want to see.",
          "The business then pays market rent to the fund under a documented lease, servicing the loan. Whether that beats the same $500,000 working elsewhere in super is the advice question, and it comes first.",
        ],
      },
    ],
    features: [
      { title: "Jacob's corner.", body: "Complex lending is Jacob's specialty: SMSF, commercial and the deals that need real structuring." },
      { title: "The specialist panel.", body: "Most big banks don't write SMSF loans anymore. We work the lenders who do, and know their appetites." },
      { title: "Wealth next door.", body: "SMSF strategy, setup and advice with LINK Wealth's licensed advisers. The lending and the strategy stay in sync." },
    ],
    faqs: [
      { q: "How much deposit does an SMSF loan need?", a: "Typically 20-30% depending on lender and property type. Commercial usually sits at the higher end. The fund also needs liquidity after settlement; lenders commonly want to see a buffer remaining in the SMSF." },
      { q: "Can my SMSF buy the building my business runs from?", a: "Yes. Business real property is the exception to the related-party rules, and it's the most common SMSF commercial strategy we finance. Your business then pays market-rate rent to your fund, with the lease properly documented." },
      { q: "Can I live in a property my SMSF owns?", a: "No. Residential property bought by your SMSF can't be lived in or rented by you or any related party. It's an investment for the fund only, until you retire and the rules change how benefits can be taken." },
      { q: "Is an SMSF loan right for me?", a: "That's a personal advice question, and it belongs with a licensed financial adviser. Ours sit at LINK Wealth. Broadly, the strategy suits funds with enough balance to keep diversification after the purchase (many advisers use around $200k+ as the working floor). We handle the lending once the advice stacks up." },
      { q: "How long does an SMSF loan take?", a: "With the fund established and the advice done, allow two to six weeks from complete application to approval, plus settlement. Starting from scratch (advice, fund establishment, rollovers, bare trust) adds weeks to months. The moral: if a property purchase is on the horizon, set the structure up before you find the property, not after." },
      { q: "Can my SMSF renovate the property?", a: "Repairs and maintenance, yes. Improvements are where the line sits: while the LRBA exists, borrowed money can't fund improvements and the asset can't be fundamentally changed. The fund can pay for some improvements from its own cash, within limits. It's a compliance question with real teeth, so it goes past the advisers before it goes to a builder." },
      { q: "What happens if the fund can't make repayments?", a: "The lender's recourse is limited to the property itself; that's the 'limited recourse' in LRBA, and it protects the rest of your super from the lender. In practice lenders also take personal guarantees from members, so the protection isn't absolute. It's why lenders insist on liquidity buffers, and why we stress-test the fund's cash flow with a vacancy before recommending the loan." },
      { q: "Are SMSF loan rates higher?", a: "Yes, SMSF loans price above standard home loans: the lending is specialist, the structures cost more to assess, and most major banks have left the space. The spread between the remaining lenders is wide, which makes comparison unusually valuable here. Pricing also improves at lower LVRs, so the deposit decision and the rate are linked." },
    ],
    related: [
      { label: "SMSF strategy at LINK Wealth", href: "https://wealth.link.com.au/smsf" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "How can I use my super to buy a house?", href: "/blog/home-loans/how-can-i-use-my-super-to-buy-a-house" },
    ],
    ctaHeading: "The lending half of a good SMSF strategy.",
    ctaIntro: "Tell us what you're weighing up. Jacob will map the lending side, and LINK Wealth's advisers cover the strategy. Free, no obligation.",
    subject: "SMSF loans",
  },

  "business-loans": {
    path: "/business-loans",
    serviceName: "Business loans",
    serviceDescription:
      "Business lending broking: growth funding, cash-flow finance, commercial property and franchise lending for Brisbane businesses.",
    crumbName: "Business Loans",
    eyebrow: "Business loans",
    h1: "Business loans that fit the business, not the bank.",
    h1Mark: "not the bank.",
    intro:
      "Business lending is where the right broker earns real money for you: the spread between lenders is wider, the structures matter more, and the bank's first offer is rarely its best. One broker, your numbers, and a panel that includes the lenders who actually want your industry.",
    heroImage: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
    heroImageAlt: "Jacob, commercial and SMSF broker at LINK Advance in Brisbane",
    bullets: [
      "Growth funding, cash-flow and working capital, commercial property, franchise and acquisition lending",
      "One broker who learns your business once, not a new banker every eighteen months",
      "Deals prepared the way credit teams read them, with the issues cleared first",
    ],
    sections: [
      {
        heading: "The lending, by what it's for.",
        paragraphs: ["Most business lending falls into one of these lanes:"],
        bullets: [
          "Growth capital: funding the opportunity that's bigger than your cash on hand",
          "Cash-flow and working capital: smoothing the gap between doing the work and being paid",
          "Commercial property: buying your premises (including through your SMSF) or investment property",
          "Equipment and vehicles: financed against the asset itself, often same-week",
          "Acquisition and franchise: buying a business or the next territory",
        ],
      },
      {
        heading: "Why business owners use us instead of their bank.",
        paragraphs: [
          "Your bank sees your application through its own policy. We shop it across a panel (banks, non-banks and specialist lenders), and because we prepare the file the way credit teams want it (clean financials, the story, the security position), it gets assessed faster and priced sharper. When the group connection helps, it's here: LINK Advisors can have your financials lender-ready, and the whole conversation happens under one roof.",
        ],
      },
      {
        heading: "How business lending is priced.",
        paragraphs: [
          "Business loan pricing follows security more than anything else. Property-secured lending prices lowest, sometimes near home loan territory for strong deals. Asset finance sits in the middle, secured by the equipment itself. Unsecured cash-flow lending prices highest, sometimes dramatically so, because the lender is relying on your trading alone. Across all of it, personal guarantees from directors are standard for small business debt, and many lenders take a general security agreement over the business's assets.",
          "The other levers are trading history, industry (lenders run appetite lists, and being on the right one changes everything) and how clean the file is. A well-prepared application with two years of financials and a clear purpose routinely prices better than the same business walking into a branch.",
        ],
      },
      {
        heading: "The process: from call to funds.",
        paragraphs: [
          "The sequence is consistent even when the products differ:",
        ],
        bullets: [
          "A conversation about what the money is for, how much and when: purpose drives everything",
          "Financials gathered: we work directly with your accountant, or LINK Advisors can bring them lender-ready",
          "Lender shortlist and indicative terms, so you see pricing before committing to an application",
          "Credit approval: days for asset finance and some cash-flow products, one to three weeks for secured lending",
          "Documentation and settlement, with the facility structured the way you'll actually use it",
        ],
      },
      {
        heading: "Who business broking suits, and who it doesn't.",
        paragraphs: [
          "If your bank knows your business, prices it keenly and moves at your speed, staying put can be the right answer, and we'll say so after the comparison. Broking earns its keep when the bank has gone slow or conservative, when your industry sits outside their appetite, when the structure needs thought (multiple entities, property plus trading debt), or when you don't have time to run a competitive process yourself.",
          "Where it doesn't help: lending to paper over a fundamental problem. Debt buys time and capacity; it doesn't fix a model. If we think the answer is your accountant before a lender, we'll tell you that instead.",
        ],
      },
      {
        heading: "Common mistakes in business borrowing.",
        paragraphs: [
          "Most expensive business debt got that way through one of these:",
        ],
        bullets: [
          "Funding long-term assets with short-term money, then refinancing under pressure",
          "Stacking quick unsecured loans on top of each other instead of restructuring once",
          "Ignoring the ATO position until the lender finds it: arrears are workable, surprises aren't",
          "Signing personal guarantees without reading what they actually secure",
          "Accepting the bank's renewal terms every year without ever testing the market",
        ],
      },
    ],
    faqs: [
      { q: "What do business loan rates look like?", a: "Wider than home loans: secured lending against property prices lowest, unsecured cash-flow lending prices highest, and asset finance sits in between. The honest answer is a range spanning several percentage points depending on security, trading history and industry, which is exactly why comparing lenders matters more for business debt than any other kind." },
      { q: "What will lenders want to see?", a: "For established businesses: financials (usually two years), ATO position, existing commitments and the purpose of funds. Newer businesses and startups have fewer doors but not zero: low-doc and asset-backed options exist. We tell you upfront which lane you're in." },
      { q: "Can I get funding fast?", a: "Asset finance and some cash-flow products can approve within days. Property-secured lending takes weeks. If timing is critical, say so first. It changes which lenders we go to." },
      { q: "Do you handle commercial property purchases?", a: "Yes: owner-occupied premises, commercial investment and SMSF commercial purchases (the buy-your-premises-through-super strategy business owners love, run jointly with LINK Wealth)." },
      { q: "Do I need a deposit or security for a business loan?", a: "Not always, but security changes the price dramatically. Unsecured lending exists and is fast; property-secured lending can cost a fraction as much. Asset purchases usually secure themselves. The real question is which mix of speed, cost and risk fits the purpose, and it's the first thing we map with you." },
      { q: "Will I have to give a personal guarantee?", a: "For small and medium business lending, almost always: directors' guarantees are standard across banks and non-banks. What varies is what else sits behind the loan (property security, a general security agreement over business assets) and whether the guarantee is capped. We make sure you know exactly what's pledged before you sign." },
      { q: "Can a startup or new business get finance?", a: "Fewer doors, not zero. Asset finance against equipment, lending secured by property or a strong contract, and franchise programs for proven systems all work for young businesses. Pure unsecured cash-flow lending usually wants trading history, commonly six to twelve months minimum. We'll tell you upfront which lane you're in and what unlocks the next one." },
      { q: "What does a commercial broker cost?", a: "Many business loans pay broker commission the same way home loans do, at no cost to you. Some complex or time-heavy commercial work carries a fee, agreed in writing before any work starts, never discovered afterwards. Either way you see the numbers before anything is lodged." },
    ],
    related: [
      { label: "Car & equipment finance", href: "/business-car-and-equipment-loans" },
      { label: "SMSF loans", href: "/smsf-mortgage-broker" },
      { label: "Working capital finance", href: "/working-capital-finance" },
      { label: "Commercial lending overview", href: "/commercial-lending" },
    ],
    ctaHeading: "Bring the plan. We'll bring the lenders.",
    ctaIntro: "Tell us what the business needs and when. A broker will map the realistic options and what they cost. Free, no obligation.",
    subject: "Business loans",
  },

  "business-car-and-equipment-loans": {
    path: "/business-car-and-equipment-loans",
    serviceName: "Car and equipment finance",
    serviceDescription:
      "Vehicle and equipment finance for business and personal use: chattel mortgages, leases and personal car loans across a wide lender panel.",
    crumbName: "Car & Equipment Finance",
    eyebrow: "Asset & vehicle finance",
    h1: "Car and equipment finance, sorted before the weekend.",
    h1Mark: "sorted before the weekend.",
    intro:
      "Asset finance moves fast when the file is right, often approved in days. Cars, utes, trucks, trailers, machinery and business equipment, financed against the asset itself, for business or personal use.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-the-boys-2025-web-scaled.jpg",
    heroImageAlt: "Jacob, Callum and Hugh, the LINK Advance brokers in Brisbane",
    bullets: [
      "Chattel mortgage, lease or personal loan: the structure changes the tax outcome, so we match it to advice",
      "New, used and private-sale vehicles financed",
      "Dealer finance compared honestly: sometimes their subsidised rate wins, and we'll tell you when",
    ],
    sections: [
      {
        heading: "Business asset finance, the quick version.",
        paragraphs: [
          "For business vehicles and equipment, a chattel mortgage is the workhorse: the asset secures the loan, you own it from day one, GST and depreciation treatment usually work in your favour, and terms typically run three to five years with an optional balloon. Whether the balloon, the term or a lease suits better is a cash-flow and tax question. We set the structure with your accountant's advice in view.",
        ],
      },
      {
        heading: "The structures, side by side.",
        paragraphs: [
          "Five ways to finance the same asset, with different tax and ownership outcomes:",
        ],
        bullets: [
          "Chattel mortgage: you own the asset from day one and the lender holds security over it; the default for business use",
          "Finance lease: the financier owns it, you lease it, with options to buy, return or refinance at the end",
          "Commercial hire purchase: the lender buys the asset and hires it to you, with ownership transferring at the final payment",
          "Novated lease: your employer leases the car and repayments come out of your salary; an employee arrangement",
          "Personal car loan: for private use, secured against the vehicle, regularly sharper than dealer finance",
        ],
      },
      {
        heading: "A worked example: the balloon decision.",
        paragraphs: [
          "An example with checkable arithmetic. You finance an $80,000 ute over five years with a 30% balloon: $24,000 of the price (30% of $80,000) is parked at the end of the term, so your repayments only amortise $56,000 of it, plus interest on the lot. At month sixty you still owe $24,000: pay it out, refinance it, or trade the ute and roll forward.",
          "Balloons suit businesses that upgrade vehicles on a cycle and want repayments matched to the asset's earning years. They hurt when the balloon arrives as a surprise, or when the asset is worth less than the balloon at trade-in time. We model both versions so the decision gets made once, on paper, not at month fifty-nine.",
        ],
      },
      {
        heading: "Personal car loans too.",
        paragraphs: [
          "Not everything is business. Personal car finance across our panel regularly beats dealership rates once the fees are counted, and because we're not paid to move a particular car, the comparison is honest. Send us the car you want and we'll come back with what it really costs.",
        ],
      },
      {
        heading: "Common asset finance mistakes.",
        paragraphs: [
          "Fast finance means fast mistakes. These are the usual ones:",
        ],
        bullets: [
          "Taking dealer finance on the spot without a comparison: sometimes the subsidised rate genuinely wins, and you only know by checking",
          "A balloon sized for the repayment you wanted, not the resale value the asset will have",
          "A term longer than the asset's working life",
          "Private-sale purchases without a check for money still owing on the asset",
          "Structuring against the accountant's advice, then discovering the GST treatment at BAS time",
        ],
      },
    ],
    faqs: [
      { q: "How fast can equipment finance be approved?", a: "Straightforward deals (established business, clear credit, standard asset) are often approved within one to three business days. Complex assets or newer ABNs take longer. If you're bidding at auction or the machine is about to be sold, tell us the deadline first." },
      { q: "Chattel mortgage or lease?", a: "A chattel mortgage means you own the asset and claim depreciation and interest; a lease means the financier owns it and you claim the payments. Which wins depends on your GST registration, cash flow and tax position. It's a five-minute question for your accountant, and we structure to the answer." },
      { q: "What's a balloon payment?", a: "A lump sum left owing at the end of the term: it lowers monthly repayments but you still owe it (refinance it, pay it out, or trade the asset). Useful for cash flow, dangerous if it surprises you. We model it both ways so you choose with eyes open." },
      { q: "Can I finance a private-sale vehicle?", a: "Yes. Most of our lenders finance private sales, with a couple of extra checks (inspection, clear title, payout of any existing encumbrance). It usually adds a day or two." },
      { q: "Do I need a deposit for equipment finance?", a: "Often no: most business asset finance funds the full purchase price, secured by the asset itself, with the balloon and term shaping the repayments. A deposit or trade-in lowers the amount financed and can improve pricing, but for most established businesses it's a choice rather than a requirement." },
      { q: "Do I need full financials to get approved?", a: "Not always. Many lenders run streamlined approvals for established ABNs financing standard assets: no full financials, just the basics and a clean credit file. Larger amounts, unusual assets or younger ABNs move to full assessment. We know where each lender draws those lines, and that knowledge is most of the speed." },
      { q: "Can I finance used or older equipment?", a: "Yes, with limits: lenders typically cap the asset's age at the end of the term, so older gear means shorter terms or a smaller lender pool. Auction and private-sale purchases are financeable too. Tell us the asset's age and your deadline first; both shape the lender list." },
      { q: "Is a novated lease better than buying the car?", a: "It's a different tool: a novated lease runs through your employer with repayments from salary, and its value depends on your income, the car and your employer's scheme. For business owners, a chattel mortgage usually does the heavy lifting instead. It's a ten-minute comparison with your accountant, and we arrange whichever wins." },
    ],
    related: [
      { label: "Business loans", href: "/business-loans" },
      { label: "Working capital finance", href: "/working-capital-finance" },
      { label: "The low-down on car finance", href: "/blog/asset-and-vehicle-finance/the-low-down-on-car-finance" },
      { label: "Commercial lending overview", href: "/commercial-lending" },
    ],
    subject: "Car & equipment finance",
  },
  "commercial-property-loans": {
    path: "/commercial-property-loans",
    serviceName: "Commercial property loans",
    serviceDescription:
      "Commercial property finance for owner-occupiers and investors: premises purchases, commercial investment and SMSF commercial lending.",
    crumbName: "Commercial Property Loans",
    eyebrow: "Commercial property",
    h1: "Commercial property loans: premises, investment, or through your super.",
    h1Mark: "premises, investment, or through your super.",
    intro:
      "Buying the building your business runs from is the classic owner's move: rent stops leaving, equity starts building. We finance premises purchases, commercial investment property and the SMSF version, with the deal structured the way commercial credit teams want to see it.",
    heroImage: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
    heroImageAlt: "Jacob, commercial and SMSF broker at LINK Advance in Brisbane",
    bullets: [
      "Owner-occupied premises, commercial investment and SMSF commercial (LRBA) lending",
      "Typical LVRs 65-80% depending on property type and lease profile",
      "Structure set with your accountant: entity, security and tax working together",
    ],
    sections: [
      {
        heading: "Owner-occupiers: stop paying someone else's mortgage.",
        paragraphs: [
          "If the business pays rent reliably, it can usually pay a loan instead. Lenders assess premises deals on the business's capacity (financials, rental history, industry) and the property itself. Deposits run higher than residential (typically 20-35%), but the maths compounds: rent becomes equity, occupancy costs stabilise, and the property can end up in your SMSF paying rent to your own retirement.",
          "That last version (business real property through a self-managed super fund) is the standout structure for established owners, run jointly with the licensed advisers at LINK Wealth.",
        ],
      },
      {
        heading: "What commercial credit teams look for.",
        paragraphs: ["The strong files share the same bones:"],
        bullets: [
          "Two years of financials (or a strong story and security where trading is shorter)",
          "A clear purpose and exit: what the property does for the business",
          "Serviceability with buffers, including realistic outgoings and rate stress",
          "Clean ATO position, or a plan for it: arrears aren't fatal, surprises are",
        ],
      },
      {
        heading: "How commercial loans differ from home loans.",
        paragraphs: [
          "Same idea, different machinery. Loan terms commonly run 15 to 25 years rather than 30. Valuations are commercial jobs: slower, costlier and usually paid by the borrower. Pricing is deal-by-deal rather than a carded rate, which is why two businesses can pay very different margins for the same building. Some facilities carry annual reviews; others are set for the term like a home loan, and that difference matters more than most borrowers realise.",
          "Documentation has lanes too: full-doc (your financials prove the servicing), lease-doc for investors (the tenant's rent covers the interest), and plenty in between. Which lane your deal fits determines both the lender list and the price.",
        ],
      },
      {
        heading: "A worked example: buying your premises.",
        paragraphs: [
          "An example with checkable arithmetic. Your business buys its $1,200,000 premises at 70% LVR: the loan is $840,000 and your equity contribution is $360,000 plus costs like duty, valuation and legals. If you currently pay rent, that money stops leaving the business and starts covering your own loan instead; whether the swap works is a cash-flow comparison we run with your accountant, not a slogan.",
          "The $360,000 doesn't have to be cash in the trading account. Many owners fund it through an equity release against their home, and established owners often buy through their SMSF instead. Structuring where the deposit comes from is half the deal.",
        ],
      },
      {
        heading: "The process and realistic timeframes.",
        paragraphs: ["Commercial purchases reward preparation. The honest sequence:"],
        bullets: [
          "Scoping and lender shortlist (days): entity, deposit source, lender appetite for the property type",
          "Indicative terms (about a week): pricing and conditions in writing before you commit",
          "Valuation and credit approval (two to four weeks): the valuation is usually the pacing item",
          "Documentation and settlement (one to three weeks): solicitors on both sides, plus leases if tenanted",
        ],
      },
      {
        heading: "Who it suits, and who it doesn't.",
        paragraphs: [
          "Buying premises suits established businesses with stable location needs and a deposit that doesn't starve working capital. It locks in occupancy costs, builds an asset, and opens the SMSF strategy later. It doesn't suit businesses likely to outgrow the space in two years, or where the deposit is the same money needed to fund growth: a great building with an underfunded business inside it is a bad trade.",
          "Commercial investment property has its own honest ledger: yields typically run higher than residential, but vacancies last longer, tenants are businesses, and the value tracks the lease. The lease profile is the asset, and we assess it that way.",
        ],
      },
    ],
    faqs: [
      { q: "What deposit do I need for a commercial property?", a: "Typically 20-35% depending on the property type, your trading history and whether it's owner-occupied. Standard commercial sits around 65-80% LVR. Specialised properties (childcare, medical, industrial with single use) price and gear differently." },
      { q: "Are commercial rates higher than home loan rates?", a: "Yes, generally 1-3% above residential depending on security and the deal's strength, which is exactly why the lender comparison matters more here. The spread between lenders on the same commercial deal is far wider than on home loans." },
      { q: "Can my SMSF buy my business premises?", a: "Yes. Business real property is the exception to the related-party rules. Your fund buys the premises, your business pays market rent to your own super. The lending is specialist (LRBA, 20-30% deposits); the strategy and compliance sit with LINK Wealth's advisers." },
      { q: "How long does commercial approval take?", a: "Longer than residential: typically two to six weeks depending on the lender, valuation and the file's complexity. Deals prepared with financials, leases and ATO position up front move materially faster." },
      { q: "What loan terms do commercial property loans run?", a: "Commonly 15 to 25 years, shorter than the residential 30, with interest-only periods available up front. Some facilities are fully set for the term; others carry annual reviews or shorter commitment periods, a real difference between lenders that headline pricing doesn't show. We flag it before you choose." },
      { q: "What is a lease-doc loan?", a: "A commercial investment loan assessed mainly on the property's lease: if the rent comfortably covers the interest, some lenders don't need your full business financials. It suits investors buying tenanted commercial property with strong leases. LVRs run a touch more conservative and pricing slightly higher than full-doc, in exchange for far less paperwork." },
      { q: "Can I use equity in my home for the deposit?", a: "Yes, and it's the most common deposit source we see: an equity release against your home funds the commercial deposit, and the commercial loan secures the property itself. It keeps the structures clean and often improves the overall pricing. The alternative for established owners is buying through the SMSF, which uses super instead of home equity." },
      { q: "Do commercial loans have ongoing reviews?", a: "Some do: annual reviews where the lender re-checks financials, and covenants like minimum interest cover on larger facilities. Plenty of commercial property loans, especially at lower LVRs, are set for the term with no reviews at all. If you'd rather never re-audition for your own loan, say so; it narrows the lender list, and we price both versions." },
    ],
    related: [
      { label: "SMSF loans", href: "/smsf-mortgage-broker" },
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Commercial lending overview", href: "/commercial-lending" },
    ],
    ctaHeading: "Bring the premises plan.",
    ctaIntro: "Jacob maps the lending: deposit, entity, lender shortlist. Free, no obligation.",
    subject: "Commercial property",
  },

  "working-capital-finance": {
    path: "/working-capital-finance",
    serviceName: "Working capital finance",
    serviceDescription:
      "Cash-flow lending for business: overdrafts, invoice finance, trade facilities and short-term working capital.",
    crumbName: "Working Capital",
    eyebrow: "Working capital",
    h1: "Working capital finance: smooth the gap between the work and the money.",
    h1Mark: "the work and the money.",
    intro:
      "Most growing businesses die of timing, not losses: the work is done, the invoice is out, the wages are due. Working capital facilities bridge that gap, and the right structure costs a fraction of the wrong one.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-2025-Web-1-scaled.jpg",
    heroImageAlt: "The LINK Advance mortgage broking team in Fortitude Valley, Brisbane",
    bullets: [
      "Overdrafts, invoice finance, trade and import facilities, short-term loans",
      "Facilities matched to the cash-flow shape: seasonal, project-based or growth",
      "Unsecured options exist; secured ones price far better, and we show both",
    ],
    sections: [
      {
        heading: "Match the facility to the gap.",
        paragraphs: ["Different gaps want different tools:"],
        bullets: [
          "Invoice finance: unlock 80-90% of invoices immediately; suits B2B businesses with 30-90 day terms",
          "Overdraft: the flexible buffer for lumpy months; cheapest when secured",
          "Trade finance: fund stock and imports between paying suppliers and selling through",
          "Short-term loans: fast, purpose-built capital for a defined bridge (priced accordingly)",
        ],
      },
      {
        heading: "How invoice finance works, mechanically.",
        paragraphs: [
          "You raise an invoice on your usual terms, and the financier advances most of it immediately, commonly 80-90% of face value. When your customer pays, the remainder comes to you minus the financier's fees. The facility is secured by the receivables themselves and grows with your ledger, which is the feature that matters: a business doubling its sales doesn't have to renegotiate a limit every quarter.",
          "Two flavours: disclosed, where your customer pays the financier directly and knows about the arrangement, and confidential, where you collect as normal and customers see nothing. Confidential facilities usually want stronger businesses with better systems, and price accordingly. Debtor quality drives everything: invoices to solid businesses on clean terms are the easiest money to unlock.",
        ],
      },
      {
        heading: "A worked example: the timing gap in dollars.",
        paragraphs: [
          "An example with checkable arithmetic. A labour-hire firm invoices $100,000 for a month's work on 60-day terms, but roughly $70,000 of wages for that same month is due now. An invoice finance facility advancing 85% releases $85,000 (85% of $100,000) as soon as the invoice is raised: wages covered, growth intact, no awkward call asking the client to pay early.",
          "The remaining $15,000 arrives, minus fees, when the customer pays at day 60. The facility's cost is real, so the question we always model is whether the funded work earns more than the fees. For businesses turning away contracts because of cash timing, it usually does, and we show you that arithmetic before you sign.",
        ],
      },
      {
        heading: "The process: usually days, not weeks.",
        paragraphs: ["Working capital moves faster than any other commercial lending:"],
        bullets: [
          "A conversation about the gap: seasonal, growth, one big contract, or structural",
          "Recent bank statements, aged receivables and basic financials (your accountant or LINK Advisors can pull these fast)",
          "Indicative offers within days for invoice finance and unsecured products; one to three weeks for secured overdrafts",
          "Facility live: invoice finance can be funding within a week of the paperwork",
        ],
      },
      {
        heading: "The honest pricing conversation.",
        paragraphs: [
          "Unsecured cash-flow lending is the most expensive mainstream debt a business can carry: fast money priced for risk. Sometimes it's still right (a contract worth far more than the interest). But often a secured facility, a restructure of existing debt, or fixing the actual cash-flow driver (terms, collections, stock) beats borrowing. We tell you which one you're looking at before anything is signed.",
        ],
      },
      {
        heading: "Common working capital mistakes.",
        paragraphs: ["The pattern behind most expensive facilities:"],
        bullets: [
          "Using short-term money for long-term purposes: equipment and fitouts belong on asset finance terms",
          "Stacking a second and third cash-flow loan on top of the first instead of restructuring once",
          "Treating the overdraft as permanent capital, so it's maxed the day it's actually needed",
          "Borrowing to cover a collections problem, when the fix is invoicing terms, not debt",
          "Renewing the same facility every year without re-testing the market",
        ],
      },
    ],
    faqs: [
      { q: "How fast can working capital be approved?", a: "Invoice finance and unsecured facilities can approve in days; secured overdrafts and bank facilities take one to three weeks. If there's a hard deadline, say so first. It changes the lender list." },
      { q: "What does invoice finance cost?", a: "Typically a service fee plus interest on drawn funds. All-in costs commonly land in the high single digits to low teens annually depending on volume and debtor quality. It scales with use, which is the point: it grows with your receivables." },
      { q: "Will I need property security?", a: "Not necessarily: invoice finance is secured by the receivables themselves, and unsecured products exist. But property-backed facilities price dramatically better; if you have security and expect to use the facility often, using it usually wins." },
      { q: "Can this consolidate expensive short-term debts?", a: "Often, yes: rolling multiple high-rate cash-flow loans into one properly structured facility is one of the most valuable things a commercial broker does. Bring the loan statements; the comparison takes a day." },
      { q: "What's the difference between invoice finance and factoring?", a: "Factoring is the traditional, disclosed version: the financier buys your invoices and collects from your customers directly. Modern invoice finance (discounting) can be confidential, with you collecting as normal. The economics are similar; the customer-facing experience isn't. Which fits depends on your systems, your margins and how you feel about customers seeing the arrangement." },
      { q: "Will my customers know I'm using invoice finance?", a: "Only if the facility is disclosed. Confidential invoice discounting keeps collections with you, and your customers see nothing different. Confidential facilities generally want established businesses with sound ledgers and reporting; if that's you, disclosure is a choice rather than a requirement." },
      { q: "Is an overdraft better than a loan?", a: "They do different jobs. An overdraft is a buffer you dip into and clear, priced for flexibility; a term loan is a lump sum with a schedule, priced for certainty. Using an overdraft as a permanent loan is expensive, and using a term loan for a fluctuating gap is clumsy. Match the shape of the money to the shape of the gap." },
      { q: "Can a new business get working capital finance?", a: "Harder, but not closed. Invoice finance works on your debtors' strength as much as yours, so a young business invoicing solid customers can qualify. Unsecured lenders usually want trading history, commonly six to twelve months. Security, a strong contract in hand, or a director's property can open doors earlier. We'll be straight about which lane you're in." },
    ],
    related: [
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Car & equipment finance", href: "/business-car-and-equipment-loans" },
      { label: "Commercial lending overview", href: "/commercial-lending" },
    ],
    subject: "Working capital",
  },

  "business-acquisition-loans": {
    path: "/business-acquisition-loans",
    serviceName: "Business acquisition finance",
    serviceDescription:
      "Finance for buying a business or franchise: acquisition lending against cash flow, security and the target's earnings.",
    crumbName: "Acquisition Finance",
    eyebrow: "Acquisition & franchise",
    h1: "Buying a business? Finance the acquisition properly.",
    h1Mark: "Finance the acquisition properly.",
    intro:
      "Acquisition lending is where preparation pays most: lenders are financing a business you don't run yet, so the file has to prove the earnings are real and you can hold them. Get the structure right and the target's own cash flow does the heavy lifting.",
    heroImage: "/wp-content/uploads/2026/05/ADVANCE-the-boys-2025-web-scaled.jpg",
    heroImageAlt: "Jacob, Callum and Hugh, the LINK Advance brokers in Brisbane",
    bullets: [
      "Acquisitions, buy-ins, partner buyouts and franchise purchases",
      "Funding typically blends lender debt, your equity and sometimes vendor finance",
      "Franchise systems with track records unlock dedicated lender programs",
    ],
    sections: [
      {
        heading: "What lenders fund, and how much.",
        paragraphs: [
          "Expect lenders to fund roughly 50-70% of a business purchase against the business itself, more where property or strong security is in the mix, less for goodwill-heavy deals. The gap comes from your equity, and sometimes vendor finance. A seller leaving money in the deal is also the strongest signal the earnings are real.",
          "Franchises of established systems often do better: majors run dedicated franchise programs with higher gearing for proven brands, because the system's numbers de-risk the purchase.",
        ],
      },
      {
        heading: "The file that gets funded.",
        paragraphs: ["Strong acquisition applications share the same skeleton:"],
        bullets: [
          "Three years of the target's financials, and the story behind any adjustments (add-backs: directors' wages, one-offs, personal expenses)",
          "Your experience in the industry, or the management staying on",
          "A sensible price against maintainable earnings (lenders sanity-check the multiple)",
          "Working capital planned from day one, not discovered in month two",
        ],
      },
      {
        heading: "How lenders size the loan.",
        paragraphs: [
          "Business valuations for lending start with maintainable earnings: the profit a new owner can rely on, after honest add-backs. Lenders then fund a portion of the price, typically 50-70% against the business itself, with the rest from your equity, property security or vendor finance. Goodwill-heavy businesses, where the value walks out the door each night, gear at the low end; businesses with property, equipment or contracted revenue gear higher.",
          "They also sanity-check the price: earnings multiples vary by industry, and a deal priced far above the going range gets questioned no matter how good the story. If the multiple only works with heroic growth assumptions, expect the lender to fund the business as it is, not as the pitch says it will be.",
        ],
      },
      {
        heading: "A worked example: funding a $1,000,000 purchase.",
        paragraphs: [
          "An example with checkable arithmetic. You buy a business for $1,000,000. A lender funds 60% against maintainable earnings: $600,000. You contribute $300,000 of equity (cash or a home-equity release), and the vendor leaves $100,000 in as vendor finance over two years. Together that covers the full $1,000,000, and the vendor's stake doubles as their vote of confidence in the numbers they sold you.",
          "On top of the price, you want working capital from day one: stock, wages and the quiet first quarter while customers meet the new owner. Sizing that buffer into the facility at the start is far cheaper than arranging emergency funding in month three.",
        ],
      },
      {
        heading: "The process and timeframes.",
        paragraphs: [
          "Acquisitions have more moving parts than any other loan, and the finance is rarely the slowest one:",
        ],
        bullets: [
          "Indicative funding capacity first, before you negotiate: it sets your realistic price range",
          "Due diligence with your accountant (LINK Advisors do this daily): financials, add-backs, contracts, the lease",
          "Formal application once terms are agreed: credit approval commonly takes two to four weeks",
          "The long poles: landlord consent to assign the lease, franchisor approval, licences transferring",
          "Settlement aligned with the business sale contract, with working capital live from day one",
        ],
      },
      {
        heading: "Who acquisition lending suits, and who it doesn't.",
        paragraphs: [
          "The deals that work share a pattern: a buyer with experience in the industry (or key management staying on), a business whose earnings survive scrutiny, and a price the multiple supports. Lenders fund those deals willingly, and the target's own cash flow carries the debt.",
          "Be honest about the other pattern: buying a job. If the business's earnings are really the owner's wage for working sixty-hour weeks, you're buying employment with debt attached, and the servicing rarely stacks up once a market wage is paid. We run that test early, before you've fallen for the deal, because the kindest thing a broker can say is sometimes 'don't'.",
        ],
      },
    ],
    faqs: [
      { q: "How much deposit do I need to buy a business?", a: "Commonly 30-50% of the purchase price in equity, less where property secures the deal or a strong franchise program applies. Vendor finance can bridge part of the gap, and its presence reassures lenders." },
      { q: "What are add-backs and why do they matter?", a: "Add-backs adjust the target's profit to show its true earning power for a new owner: directors' wages above market rate, one-off costs, personal expenses through the business. Lenders scrutinise them hard; realistic add-backs supported by evidence are the difference between a fundable file and a rejected one." },
      { q: "Can I borrow against the business I'm buying?", a: "Partly: lenders lend against its maintainable earnings and any hard assets, but goodwill-heavy businesses gear lower. That's why acquisition funding usually blends lender debt, your equity, and sometimes property security or vendor finance." },
      { q: "Do you handle the whole deal?", a: "The finance, yes. And the group covers the rest: LINK Advisors on due diligence and structure, LINK Wealth on what the acquisition means for your personal position. One roof, whole deal." },
      { q: "Can I use my home equity to buy a business?", a: "Yes, and it changes the deal: property security moves the lending from goodwill-secured (conservative, pricier) toward property-secured (higher gearing, sharper pricing). Many acquisitions blend both: an equity release funds your contribution, and the business loan funds the rest. The trade-off is your home standing behind the business, which deserves a clear-eyed conversation, and gets one." },
      { q: "What is vendor finance and should I want it?", a: "The seller leaves part of the price in the deal, paid to them over time from the business's earnings. Lenders like seeing it (a seller confident enough to wait is a good sign), and it shrinks the equity you need. Terms matter: how long, what security the vendor holds, and what happens if trading dips. Your accountant and solicitor paper it properly." },
      { q: "How do lenders check the business is worth the price?", a: "Through maintainable earnings and the multiple. They test the add-backs against evidence, compare the multiple to industry norms, and often lend against their own assessed value rather than the contract price. If those numbers land under your deal, the gap is yours to fund, which is why we pressure-test the valuation before you go unconditional." },
      { q: "How long does acquisition finance take?", a: "Credit approval commonly takes two to four weeks once the file is complete; the whole journey from agreed deal to settlement usually runs one to two months. Lease assignments, franchisor approvals and licence transfers are the usual delays, not the bank. Start the finance conversation before you sign anything and the timeline behaves." },
    ],
    related: [
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "Working capital finance", href: "/working-capital-finance" },
      { label: "Commercial lending overview", href: "/commercial-lending" },
    ],
    subject: "Acquisition finance",
  },

  "development-finance": {
    path: "/development-finance",
    serviceName: "Development finance",
    serviceDescription:
      "Property development funding: site acquisition, construction facilities and residual stock loans for small to mid-scale developers.",
    crumbName: "Development Finance",
    eyebrow: "Development finance",
    h1: "Development finance: from site to settlement, funded in stages.",
    h1Mark: "funded in stages.",
    intro:
      "Development funding is its own discipline: land, construction drawdowns and the exit all financed against a project that doesn't exist yet. Banks fund the conservative end; private and non-bank lenders fund the rest, at prices that make lender choice the biggest number in your feasibility.",
    heroImage: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
    heroImageAlt: "Jacob, commercial and SMSF broker at LINK Advance in Brisbane",
    bullets: [
      "Site acquisition, construction facilities, residual stock and bridging",
      "Bank, non-bank and private funding compared: the rate spread is enormous",
      "Small to mid-scale focus: duplexes, townhouses, small subdivisions and unit sites",
    ],
    sections: [
      {
        heading: "How development facilities work.",
        paragraphs: [
          "Lenders typically fund a percentage of total development cost (commonly 65-80% TDC) or of end value (55-65% GRV), drawn in stages against QS-certified progress. Interest usually capitalises into the facility (no repayments during the build), with the loan cleared by sales or refinance at completion. Presales requirements are the big fork: banks want them, many non-banks don't, and the pricing reflects it.",
        ],
      },
      {
        heading: "What makes a fundable project.",
        paragraphs: ["The feasibility gets funded when it shows:"],
        bullets: [
          "Realistic end values with comparable evidence (the valuer will check)",
          "A contingency that survives contact with a builder (10%+ of construction)",
          "A capable builder with capacity (lenders assess them as hard as you)",
          "A clear exit: presales, a hold-and-refinance plan, or residual stock strategy",
        ],
      },
      {
        heading: "The funding stack, from senior debt up.",
        paragraphs: [
          "Most projects are funded in layers. Senior debt does the heavy lifting: typically 65-80% of total development cost from a bank or non-bank, secured first against the site. Above it sits your equity, and sometimes mezzanine debt or preferred equity filling the gap between what the senior lender will advance and what you have, at materially higher pricing. Costs run beyond the interest rate: establishment fees, line fees on the facility limit, valuation and QS costs, all of which belong in the feasibility rather than arriving as surprises.",
          "The stack is a design decision. More mezzanine means less of your own cash but thinner margins and less room for error; more equity means the reverse. We price the versions side by side so the choice is deliberate.",
        ],
      },
      {
        heading: "A worked example: four townhouses in Brisbane.",
        paragraphs: [
          "An example with checkable arithmetic. Total development cost is $4,000,000: site $1,400,000, construction $2,200,000, and consultants, interest and costs $400,000. A facility at 70% of TDC funds $2,800,000, leaving $1,200,000 of equity to come from you: cash, equity in the site if you already own it, or a partner.",
          "If the four townhouses are worth $1,300,000 each on completion ($5,200,000 gross realisation), the facility also passes the end-value test at roughly 54% of GRV, comfortably inside typical limits. Change any assumption (build cost up, end values down) and both tests move; that sensitivity is exactly what we stress before a lender ever sees the deal.",
        ],
      },
      {
        heading: "The process: feasibility to first drawdown.",
        paragraphs: ["Development finance is a project inside your project. The sequence:"],
        bullets: [
          "Feasibility review and funding strategy: bank versus non-bank, presales or not, the shape of the stack",
          "Indicative terms from shortlisted lenders (days to a couple of weeks)",
          "Valuation (as-is and on-completion) and quantity surveyor report: the pacing items",
          "Credit approval and documentation: non-banks commonly land inside a month, banks run longer",
          "Settlement, then monthly drawdowns certified by the QS as construction progresses",
        ],
      },
      {
        heading: "Common development finance mistakes.",
        paragraphs: ["Margins die by a thousand small optimisms. The recurring ones:"],
        bullets: [
          "End values set by hope rather than comparable sales: the valuer finds the truth anyway",
          "Contingency under 10% of construction cost, then the first latent condition eats it",
          "A builder priced cheap but without the capacity or balance sheet lenders will accept",
          "No plan B on the exit: if sales stall, is there a residual stock refinance or a hold strategy?",
          "GST and margin scheme treatment left to the end instead of priced into the feasibility",
          "Running personal cash to zero before the facility's first drawdown",
        ],
      },
    ],
    faqs: [
      { q: "Do I need presales?", a: "For bank funding, usually yes, often debt cover of 60-100% in presales. Non-bank and private lenders frequently require none, at higher rates. Whether paying more for no presales beats waiting for presales is a feasibility question we model both ways." },
      { q: "What experience do lenders want?", a: "First projects are fundable: at lower gearing, with a strong builder and often a development manager. Track record unlocks better terms with each completed project; the file should present whatever experience exists (trades, renovations, related industries)." },
      { q: "What does development finance cost?", a: "Banks price lowest but gear conservatively with presales; non-banks run roughly 2-5% higher with more flexibility; private funding higher again for speed and edge cases. On most projects the right lender choice moves the feasibility more than any other line item." },
      { q: "What's a residual stock loan?", a: "Finance against completed unsold stock at the end of a project, clearing the construction facility so you can sell in an orderly market instead of a fire sale, or hold and rent. Often the difference between a stressful exit and a profitable one." },
      { q: "How much equity do I need for a development?", a: "With senior debt at 65-80% of total development cost, plan on funding 20-35% of TDC yourself. Equity doesn't have to be cash: a site you already own contributes at its current value, and uplift from an approval you've secured counts with many lenders. Mezzanine funding can shrink the cash further, at a price that has to earn its place in the feasibility." },
      { q: "Does land I already own count as equity?", a: "Yes, and it's the most common way developers gear up: the site goes in at valuation (including uplift from approvals you've won), and the facility funds construction on top. If the site carries debt, the new facility usually refinances it too. It's why buying the site well, and getting the DA, is half the funding battle." },
      { q: "What does the quantity surveyor do on my facility?", a: "The QS is the lender's independent eyes on cost: they verify the budget up front and certify each month's construction claim before funds are released. Drawdowns are paid against QS certificates, not builder invoices alone. A realistic budget that survives the initial QS review sets the whole facility up to run smoothly." },
      { q: "How long does development finance approval take?", a: "Non-bank lenders commonly move from complete file to approval within two to four weeks; banks often take longer, particularly with presale hurdles to evidence. The valuation and QS report are usually the pacing items, so we commission them early. From first conversation to first drawdown, one to three months is a realistic planning window." },
    ],
    related: [
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "Construction loans", href: "/construction-loans-brisbane" },
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Commercial lending overview", href: "/commercial-lending" },
    ],
    subject: "Development finance",
  },
};
