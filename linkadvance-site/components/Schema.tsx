import { SITE } from "@/lib/site";

// JSON-LD structured data. FinancialService (a LocalBusiness subtype) +
// AggregateRating is the core win the old site never had: the Yoast defaults
// carried no business entity, no rating, no FAQPage anywhere.

export function firmSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE.url}/#firm`,
    name: "LINK Advance",
    alternateName: "LINK Advance Finance Brokers",
    legalName: SITE.legal.entity,
    url: SITE.url,
    telephone: "+61 7 2101 4374",
    logo: `${SITE.url}/link-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.suburb,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postcode,
      addressCountry: "AU",
    },
    // 57 Berwick St - the same OpenStreetMap-verified point every LINK site
    // carries (a listing and a website that disagree are two weak signals
    // rather than one strong one).
    geo: { "@type": "GeoCoordinates", latitude: -27.458844, longitude: 153.037471 },
    areaServed: [
      { "@type": "City", name: "Brisbane" },
      { "@type": "Country", name: "Australia" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.reviews.rating,
      reviewCount: SITE.reviews.count,
      bestRating: 5,
    },
    parentOrganization: { "@type": "Organization", name: "LINK", url: SITE.group.url },
    knowsAbout: [
      "Mortgage broking",
      "Home loans",
      "Refinancing",
      "First home buyer loans",
      "First Home Owners Grant Queensland",
      "Investment property loans",
      "Construction loans",
      "SMSF lending",
      "Business and equipment finance",
    ],
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE.url}${path}`,
    provider: { "@id": `${SITE.url}/#firm` },
    areaServed: [
      { "@type": "City", name: "Brisbane" },
      { "@type": "Country", name: "Australia" },
    ],
  };
}

// The paid strategy workshops are products with a real price - Event/Offer
// markup makes the $660 and the Value Guarantee machine-readable.
export function workshopSchema(w: {
  name: string;
  description: string;
  path: string;
  price?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Finance broking service",
    name: w.name,
    description: w.description,
    url: `${SITE.url}${w.path}`,
    provider: { "@id": `${SITE.url}/#firm` },
    ...(w.price
      ? {
          offers: {
            "@type": "Offer",
            price: w.price,
            priceCurrency: "AUD",
            url: `${SITE.url}${w.path}`,
          },
        }
      : {}),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: `${SITE.url}${a.path}`,
    mainEntityOfPage: `${SITE.url}${a.path}`,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: a.author
      ? { "@type": "Person", name: a.author, worksFor: { "@id": `${SITE.url}/#firm` } }
      : { "@type": "Organization", name: "LINK Advance", "@id": `${SITE.url}/#firm` },
    publisher: { "@id": `${SITE.url}/#firm` },
  };
}

export function calculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LINK Advance Loan Calculators",
    url: `${SITE.url}/home-loan-repayment-calculator`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
    provider: { "@id": `${SITE.url}/#firm` },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
