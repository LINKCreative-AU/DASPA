import type { LoanPageData } from "@/components/LoanPage";

// The eight loan service pages - one head term each, copy rewritten
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
    bullets: [
      "One broker from first coffee to settlement and beyond, never a call centre",
      "35+ lenders compared, not just the big four",
      "Ongoing repricing: we go back to your lender when the market moves, so you don't quietly drift onto a lazy rate",
    ],
    heroImage: "/wp-content/uploads/2020/11/LINK-Heroshot-2025-1.jpg",
    heroImageAlt: "The LINK Advance brokers in Fortitude Valley",
    sections: [
      {
        heading: "What a broker actually does for you.",
        paragraphs: [
          "Banks approve applications that fit their credit policy, and every lender's policy is different. The same income, deposit and property can be a decline at one lender and a sharp approval at another. We know those policies inside out, so your application goes to lenders picked for your situation, prepared the way their credit teams want to see it.",
          "Before anything is submitted, we run our own checks and clear the issues a lender would query. That's why broker applications move faster: the surprises are dealt with before the bank sees them.",
        ],
      },
      {
        heading: "What it costs: usually nothing.",
        paragraphs: [
          "For home loans, brokers are paid commission by the lender you settle with, not by you, and we tell you exactly what that commission is. You get the comparison, the negotiation and the ongoing repricing without a fee, and the rate you get is the same or better than going direct.",
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
    ],
    related: [
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
      { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
    ],
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
        heading: "When refinancing isn't worth it.",
        paragraphs: [
          "Honest answer: sometimes it isn't. Fixed-rate break costs, small balances, short remaining terms or LMI re-triggering (if your equity is under 20%) can eat the gain. Part of the review is telling you when to stay put, and then squeezing your current lender for a better deal instead. That repricing call is free and takes us minutes.",
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
    ],
    related: [
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
    ],
    ctaHeading: "One free review. Two ways to win.",
    ctaIntro: "Either we find a sharper loan across 35+ lenders, or we make your current lender price-match. Both start with the same free review.",
    subject: "Refinancing",
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
        heading: "The path, start to finish.",
        paragraphs: [
          "First a free chat about where you are: deposit, income, timeframe. Then the numbers: what you can borrow, what it costs monthly, which grants you qualify for. Then pre-approval with a lender chosen for your situation, so you can make offers with confidence. When a contract is signed we run the approval, liaise with your solicitor and the agent, and get you to settlement. After that, we reprice your loan every year, so you'll never pay the loyalty tax.",
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
    ],
    related: [
      { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
      { label: "First Home Guarantee", href: "/first-home-guarantee" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
    ],
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
    ],
    related: [
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "SMSF loans", href: "/smsf-mortgage-broker" },
      { label: "Refinancing for equity", href: "/refinancing-brisbane" },
    ],
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
        heading: "New build? Don't leave the grant behind.",
        paragraphs: [
          "New builds in Queensland can qualify for the $30,000 First Home Owner Grant and, for eligible buyers, the First Home Guarantee's 5% deposit path. If it's your first home, the grants and the construction loan need to be sequenced properly; the grant can even form part of your deposit at some lenders.",
        ],
      },
    ],
    faqs: [
      { q: "How much deposit do I need for a construction loan?", a: "Generally the same as a standard loan: 20% of the total (land + build) to avoid LMI, less with LMI or the First Home Guarantee for eligible first-home builders. Land you already own counts toward equity." },
      { q: "Do I pay full repayments during the build?", a: "No. You pay interest only on the amount drawn so far. Repayments step up with each progress payment and convert to normal principal-and-interest at completion." },
      { q: "What if the build goes over budget?", a: "Variations outside the fixed-price contract are yours to fund, which is why lenders (and we) want contingency in your numbers from day one. Significant overruns mid-build can require a loan variation, which is manageable, but far easier if the buffer was planned." },
      { q: "Can I get a construction loan as an owner-builder?", a: "Some lenders will, with lower maximum LVRs and more scrutiny. The panel matters a lot here. It's exactly the kind of niche where a broker earns their keep." },
    ],
    related: [
      { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
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
    ],
    related: [
      { label: "SMSF strategy at LINK Wealth", href: "https://wealth.link.com.au/smsf" },
      { label: "Business loans", href: "/business-loans" },
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
    ],
    faqs: [
      { q: "What do business loan rates look like?", a: "Wider than home loans: secured lending against property prices lowest, unsecured cash-flow lending prices highest, and asset finance sits in between. The honest answer is a range spanning several percentage points depending on security, trading history and industry, which is exactly why comparing lenders matters more for business debt than any other kind." },
      { q: "What will lenders want to see?", a: "For established businesses: financials (usually two years), ATO position, existing commitments and the purpose of funds. Newer businesses and startups have fewer doors but not zero: low-doc and asset-backed options exist. We tell you upfront which lane you're in." },
      { q: "Can I get funding fast?", a: "Asset finance and some cash-flow products can approve within days. Property-secured lending takes weeks. If timing is critical, say so first. It changes which lenders we go to." },
      { q: "Do you handle commercial property purchases?", a: "Yes: owner-occupied premises, commercial investment and SMSF commercial purchases (the buy-your-premises-through-super strategy business owners love, run jointly with LINK Wealth)." },
    ],
    related: [
      { label: "Car & equipment finance", href: "/business-car-and-equipment-loans" },
      { label: "SMSF loans", href: "/smsf-mortgage-broker" },
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
        heading: "Personal car loans too.",
        paragraphs: [
          "Not everything is business. Personal car finance across our panel regularly beats dealership rates once the fees are counted, and because we're not paid to move a particular car, the comparison is honest. Send us the car you want and we'll come back with what it really costs.",
        ],
      },
    ],
    faqs: [
      { q: "How fast can equipment finance be approved?", a: "Straightforward deals (established business, clear credit, standard asset) are often approved within one to three business days. Complex assets or newer ABNs take longer. If you're bidding at auction or the machine is about to be sold, tell us the deadline first." },
      { q: "Chattel mortgage or lease?", a: "A chattel mortgage means you own the asset and claim depreciation and interest; a lease means the financier owns it and you claim the payments. Which wins depends on your GST registration, cash flow and tax position. It's a five-minute question for your accountant, and we structure to the answer." },
      { q: "What's a balloon payment?", a: "A lump sum left owing at the end of the term: it lowers monthly repayments but you still owe it (refinance it, pay it out, or trade the asset). Useful for cash flow, dangerous if it surprises you. We model it both ways so you choose with eyes open." },
      { q: "Can I finance a private-sale vehicle?", a: "Yes. Most of our lenders finance private sales, with a couple of extra checks (inspection, clear title, payout of any existing encumbrance). It usually adds a day or two." },
    ],
    related: [
      { label: "Business loans", href: "/business-loans" },
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
    ],
    faqs: [
      { q: "What deposit do I need for a commercial property?", a: "Typically 20-35% depending on the property type, your trading history and whether it's owner-occupied. Standard commercial sits around 65-80% LVR. Specialised properties (childcare, medical, industrial with single use) price and gear differently." },
      { q: "Are commercial rates higher than home loan rates?", a: "Yes, generally 1-3% above residential depending on security and the deal's strength, which is exactly why the lender comparison matters more here. The spread between lenders on the same commercial deal is far wider than on home loans." },
      { q: "Can my SMSF buy my business premises?", a: "Yes. Business real property is the exception to the related-party rules. Your fund buys the premises, your business pays market rent to your own super. The lending is specialist (LRBA, 20-30% deposits); the strategy and compliance sit with LINK Wealth's advisers." },
      { q: "How long does commercial approval take?", a: "Longer than residential: typically two to six weeks depending on the lender, valuation and the file's complexity. Deals prepared with financials, leases and ATO position up front move materially faster." },
    ],
    related: [
      { label: "SMSF loans", href: "/smsf-mortgage-broker" },
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Business loans", href: "/business-loans" },
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
        heading: "The honest pricing conversation.",
        paragraphs: [
          "Unsecured cash-flow lending is the most expensive mainstream debt a business can carry: fast money priced for risk. Sometimes it's still right (a contract worth far more than the interest). But often a secured facility, a restructure of existing debt, or fixing the actual cash-flow driver (terms, collections, stock) beats borrowing. We tell you which one you're looking at before anything is signed.",
        ],
      },
    ],
    faqs: [
      { q: "How fast can working capital be approved?", a: "Invoice finance and unsecured facilities can approve in days; secured overdrafts and bank facilities take one to three weeks. If there's a hard deadline, say so first. It changes the lender list." },
      { q: "What does invoice finance cost?", a: "Typically a service fee plus interest on drawn funds. All-in costs commonly land in the high single digits to low teens annually depending on volume and debtor quality. It scales with use, which is the point: it grows with your receivables." },
      { q: "Will I need property security?", a: "Not necessarily: invoice finance is secured by the receivables themselves, and unsecured products exist. But property-backed facilities price dramatically better; if you have security and expect to use the facility often, using it usually wins." },
      { q: "Can this consolidate expensive short-term debts?", a: "Often, yes: rolling multiple high-rate cash-flow loans into one properly structured facility is one of the most valuable things a commercial broker does. Bring the loan statements; the comparison takes a day." },
    ],
    related: [
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Car & equipment finance", href: "/business-car-and-equipment-loans" },
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
    ],
    faqs: [
      { q: "How much deposit do I need to buy a business?", a: "Commonly 30-50% of the purchase price in equity, less where property secures the deal or a strong franchise program applies. Vendor finance can bridge part of the gap, and its presence reassures lenders." },
      { q: "What are add-backs and why do they matter?", a: "Add-backs adjust the target's profit to show its true earning power for a new owner: directors' wages above market rate, one-off costs, personal expenses through the business. Lenders scrutinise them hard; realistic add-backs supported by evidence are the difference between a fundable file and a rejected one." },
      { q: "Can I borrow against the business I'm buying?", a: "Partly: lenders lend against its maintainable earnings and any hard assets, but goodwill-heavy businesses gear lower. That's why acquisition funding usually blends lender debt, your equity, and sometimes property security or vendor finance." },
      { q: "Do you handle the whole deal?", a: "The finance, yes. And the group covers the rest: LINK Advisors on due diligence and structure, LINK Wealth on what the acquisition means for your personal position. One roof, whole deal." },
    ],
    related: [
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "Working capital finance", href: "/working-capital-finance" },
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
    ],
    faqs: [
      { q: "Do I need presales?", a: "For bank funding, usually yes, often debt cover of 60-100% in presales. Non-bank and private lenders frequently require none, at higher rates. Whether paying more for no presales beats waiting for presales is a feasibility question we model both ways." },
      { q: "What experience do lenders want?", a: "First projects are fundable: at lower gearing, with a strong builder and often a development manager. Track record unlocks better terms with each completed project; the file should present whatever experience exists (trades, renovations, related industries)." },
      { q: "What does development finance cost?", a: "Banks price lowest but gear conservatively with presales; non-banks run roughly 2-5% higher with more flexibility; private funding higher again for speed and edge cases. On most projects the right lender choice moves the feasibility more than any other line item." },
      { q: "What's a residual stock loan?", a: "Finance against completed unsold stock at the end of a project, clearing the construction facility so you can sell in an orderly market instead of a fire sale, or hold and rent. Often the difference between a stressful exit and a profitable one." },
    ],
    related: [
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "Construction loans", href: "/construction-loans-brisbane" },
      { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
    ],
    subject: "Development finance",
  },
};
