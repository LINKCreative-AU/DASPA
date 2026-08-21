# Build /brazil.
#
# WHY ENGLISH AND NOT PORTUGUESE. Ahrefs, 21 Aug 2026: Brazil is 250/mo on the
# English term "dasp" at KD 0, ahead of the UK. Every Portuguese phrasing tested
# returns zero ("aposentadoria australia" 0, and the high-volume "superannuation"
# terms are KD 72-77 and the wrong intent). Same pattern as Korea: they search in
# English. So this is a country page in the existing English set, not a language
# page, which also means no translation risk to carry.
#
# THE VISA FACT, CHECKED ON THE PRIMARY SOURCE RATHER THAN ASSUMED. I was about to
# write that Brazil has no Working Holiday arrangement with Australia. That is
# wrong. Home Affairs "Status of country caps", read 21 Aug 2026, lists Brazil as a
# Work and Holiday (462) partner with an annual grant cap of 500, application cap
# currently paused. Five hundred places a year is tiny next to the European
# programmes, which is exactly why this page leads with the STUDENT visa: most
# Brazilians who worked in Australia did so on a subclass 500, taxed at 35% on the
# taxed element rather than the 65% every European country page leads with.
#
# That inverts the usual angle. For a 35% reader the six-month transfer to the ATO
# is not a minor timing note, it is the difference between 35% and 65%, so the
# urgency section carries more weight here than on /uk or /ireland.
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "philippines.html")   # the other 35%-led country page

with open(SRC, encoding="utf-8", newline="") as fh:
    tpl = fh.read()

HEADER = re.search(r'<header class="site">.*?</header>', tpl, re.S).group(0)
FOOTER = re.search(r'<footer class="site">.*?</footer>', tpl, re.S).group(0)
TAIL = re.search(r'</footer>\s*(.*?)</body>', tpl, re.S).group(1).strip()
ICON = re.search(r'<link rel="icon"[^>]*>', tpl).group(0)
PRELOAD = re.search(r'<link rel="preload"[^>]*>', tpl).group(0)

ATO = ("https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/"
       "withdrawing-and-using-your-super/early-access-to-super/access-on-compassionate-grounds/"
       "departing-australia-superannuation-payment-dasp")
CAPS = "https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps"

SLUG = "brazil"
TITLE = "Claim Your Australian Super from Brazil | DASPA"
DESC = ("Most Brazilians worked in Australia on a student visa, which changes the rate. "
        "What that means for your claim, and how payment reaches a Brazilian account.")

FAQ = [
    ("Which visa was I probably on?",
     "Most Brazilians who work in Australia are there on a student visa (subclass 500), often "
     "while studying English or a VET course, and some on a skilled 482. Australia does run a "
     "Work and Holiday (subclass 462) programme with Brazil, but it is capped at 500 places a "
     "year, so far fewer people hold one. The distinction matters: student and skilled visas are "
     "taxed at 35% on the taxed element, while the Work and Holiday rate is 65%. Your subclass is "
     "on the grant email you were sent, and if you cannot find it we can establish it from your "
     "passport details."),
    ("I only worked part time while studying. Is it worth claiming?",
     "Usually yes. Super is paid on top of your wages at a legislated rate, currently 12%, and it "
     "accrues from the first dollar you earn. Two years of part-time hours while studying commonly "
     "leaves a balance worth several thousand dollars, spread across however many employers you "
     "had. There is no minimum balance for a DASP."),
    ("Can the money be paid into a Brazilian bank account?",
     "Yes. Your fund or the ATO sends the payment internationally using your bank's SWIFT/BIC "
     "details, so a Banco do Brasil, Itau, Bradesco, Caixa or Nubank account all work. It arrives "
     "in Australian dollars and your own bank converts it to reais at its own rate."),
    ("Do I need my documents notarised at a cartorio?",
     "Not through us. Identity is verified electronically with your passport and a selfie, so "
     "there is no cartorio, no consulate appointment and no certified copies. Some funds ask for "
     "notarised documents when you apply to them directly, particularly on larger balances, which "
     "is one of the things a registered tax agent removes."),
    ("I studied in Australia years ago. Is it too late?",
     "No. There is no deadline for claiming a DASP and the money is still yours. What the delay "
     "changes is where it sits: six months after your visa ended and you departed, funds must hand "
     "the balance to the ATO, and ATO-held super is taxed at 65% whatever visa you held. For a "
     "student visa that is the difference between 35% and 65%, so it is worth checking sooner "
     "rather than later."),
    ("Will Brazil tax the payment when it arrives?",
     "The payment has already been taxed in Australia at the legislated rate. How Receita Federal "
     "treats the receipt is a Brazilian question and we are not licensed to advise on it. We "
     "provide the payment summary you would need for that conversation with a Brazilian "
     "contador."),
]

BODY = """<div class="answer-first">
  <p><b>Yes. Brazilians who worked in Australia on a temporary visa can claim their full super balance as a DASP once home, provided the visa has expired or been cancelled.</b> The rate depends on which visa you held, and for Brazilians that usually works in your favour: student (subclass 500) and skilled (482) visas are taxed at 35% on the taxed element, rather than the 65% that applies to working holiday makers. Payment goes directly to your Brazilian bank account, normally within about 28 days of a complete application.</p>
  <div class="src"><span>Source: <a href="__ATO__" target="_blank" rel="noopener">Australian Taxation Office &middot; DASP</a></span><span>Last updated: 21 August 2026</span></div>
</div>

<h2>Why Brazilians usually pay the lower rate</h2>
<p>Almost every country page on this site leads with the 417 working holiday visa and its 65% rate. Brazil is the exception, and it is worth understanding why, because it is worth thousands of dollars.</p>
<p>Australia does have a Work and Holiday arrangement with Brazil, under subclass 462. It is capped at <b>500 grants a year</b>, and the application cap is currently paused (<a href="__CAPS__" target="_blank" rel="noopener">Department of Home Affairs</a>). Five hundred places is a small programme next to the European ones, which run into the thousands. So the large majority of Brazilians who have worked in Australia did it on a <b>student visa, subclass 500</b>, while studying English or a VET course, or on a sponsored <b>482</b>.</p>
<p>That is good news for your claim. Those visas are taxed at 35% on the taxed element. If you did hold one of the 462 places, the working holiday rate of 65% applies to you instead.</p>

<div class="table-scroll">
<table>
<thead><tr><th>Visa you held in Australia</th><th>DASP rate</th><th>You keep</th></tr></thead>
<tbody>
<tr><td>Student 500, or skilled 482 (taxed element)</td><td>35%</td><td>65%</td></tr>
<tr><td>Work and Holiday 462, the capped programme</td><td>65%</td><td>35%</td></tr>
<tr><td>Any visa, once the money has moved to the ATO</td><td>65%</td><td>35%</td></tr>
</tbody>
</table>
</div>

<h2>The six-month clock costs Brazilians more than most</h2>
<p>Six months after your visa ends and you have left, your fund must hand your balance to the ATO as unclaimed super. From that moment it is taxed at 65% <b>regardless of which visa you held</b>.</p>
<p>For a British or Irish backpacker on a 417 that transfer changes nothing, because they were paying 65% either way. For a Brazilian who studied here on a 500, it is the difference between keeping 65% of the balance and keeping 35% of it. On a balance of A$10,000 that is roughly A$3,000 that stops being yours. If you are inside the six months, that timing is the single most valuable thing you control.</p>
<p>Run your own numbers on the <a href="/dasp-calculator">DASP tax calculator</a>, which shows both rates side by side.</p>

<h2>Part-time study work still adds up</h2>
<p>Student visa holders can work limited hours, so the assumption is often that there cannot be much super sitting there. In practice there usually is. Employers must pay super on top of your wages at a legislated rate, currently 12%, from the first dollar you earn, and student work tends to mean several employers over a couple of years: a cafe, a cleaning contract, a bit of hospitality. Each one may have used a different fund.</p>
<p>That is the part people find hardest to unpick themselves, and it is the core of what we do: we search for every account in your name, including money already sitting with the ATO, under one flat fee.</p>

<h2>Paid to your Brazilian account</h2>
<p>Your DASP is paid to a Brazilian account using your bank's SWIFT/BIC. Banco do Brasil, Itau, Bradesco, Caixa, Santander and the digital banks all receive international transfers. The money arrives in Australian dollars and your bank converts it to reais at its own rate; some people use a multi-currency account to control the conversion themselves. We never hold your money, the fund or the ATO pays you directly.</p>

<h2>No cartorio, no consulate queue</h2>
<p>Identity is verified electronically with your passport and a selfie, from your phone, in about two minutes. There is no cartorio, no notarised copies and no appointment at the Australian consulate in Sao Paulo or Brasilia. Funds approached directly will often ask for certified documents, particularly above about A$5,000, and removing that step is a large part of why people use a registered tax agent.</p>

<h2>How the claim works from Brazil</h2>
<ul class="checklist">
  <li><b>The five-minute form.</b> In English, and short. If you do not know which fund holds your super, say so and we find it.</li>
  <li><b>Identity check.</b> Passport plus selfie, on your phone.</li>
  <li><b>A registered tax agent lodges it.</b> We search every fund plus ATO-held money, prepare the application and chase it through.</li>
  <li><b>The money reaches your account.</b> Paid by the fund or the ATO directly to you, typically within about 28 days of a complete application.</li>
</ul>
<p>One flat fee of $149 + GST covers all of it, however many funds you turn out to have, and it is refunded in full if we recover nothing. If your situation is simple, the ATO also runs a free DASP application system you are welcome to use; there is an honest comparison on <a href="/can-i-claim-my-super-myself-for-free">doing it yourself for free</a>.</p>

<h2>Common questions</h2>
__FAQS__"""


def jstr(s):
    return '"%s"' % s.replace("\\", "\\\\").replace('"', '\\"')


faq_html = "\n".join(
    '<details class="faq"><summary>%s</summary><div class="a"><p>%s</p></div></details>' % (q, a)
    for q, a in FAQ)

body = (BODY.replace("__ATO__", ATO).replace("__CAPS__", CAPS).replace("__FAQS__", faq_html))

SCHEMA = """<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@graph": [
  {
   "@type": "BreadcrumbList",
   "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "DASPA", "item": "https://daspa.com.au/" },
    { "@type": "ListItem", "position": 2, "name": "Claiming from overseas", "item": "https://daspa.com.au/claim-super-from" },
    { "@type": "ListItem", "position": 3, "name": "Claiming from Brazil", "item": "https://daspa.com.au/brazil" }
   ]
  },
  {
   "@type": "Organization",
   "@id": "https://daspa.com.au/#org",
   "name": "DASPA",
   "legalName": "Australian Registration Office Pty Ltd",
   "url": "https://daspa.com.au/"
  },
  {
   "@type": "Service",
   "@id": "https://daspa.com.au/brazil#service",
   "name": "DASP claim service: Brazil",
   "serviceType": "Departing Australia Superannuation Payment lodgement",
   "provider": { "@id": "https://daspa.com.au/#org" },
   "areaServed": "Brazil",
   "offers": {
    "@type": "Offer",
    "price": "163.90",
    "priceCurrency": "AUD",
    "description": "Flat fee $149 + GST covering every super fund and ATO-held super. No super, no fee: refunded in full if no super is recovered."
   }
  },
  {
   "@type": "FAQPage",
   "mainEntity": [
__FAQ_ITEMS__
   ]
  }
 ]
}
</script>""".replace("__FAQ_ITEMS__", ",\n".join(
    '    {\n     "@type": "Question",\n     "name": %s,\n     "acceptedAnswer": { "@type": "Answer", "text": %s }\n    }'
    % (jstr(q), jstr(a)) for q, a in FAQ))

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://daspa.com.au/{slug}">
<meta property="og:type" content="website">
<meta property="og:title" content="{ogt}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://daspa.com.au/{slug}">
<meta property="og:image" content="https://daspa.com.au/assets/og/{slug}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="DASPA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://daspa.com.au/assets/og/{slug}.png">
<meta property="og:locale" content="en_AU">
{icon}
{preload}
<link rel="stylesheet" href="/assets/site.css">
{schema}
</head>
<body>
{header}
<section class="page-hero">
  <div class="wrap">
    <div class="crumbs"><a href="/">DASPA</a> &middot; <a href="/claim-super-from">Claiming from overseas</a> &middot; Claiming from Brazil</div>
    <h1>Back in Brazil? <em>Your Australian super can come home too.</em></h1>
    <p class="sub">Most Brazilians worked in Australia on a student visa, and that means a lower tax rate than the backpackers get. Here is how to claim it to a Brazilian account.</p>
  </div>
</section>
<main class="page">
  <div class="wrap-narrow prose">
{body}
<div class="cta-band">
  <div>
    <h2>Ready when you are. <em>5 minutes, flat fee.</em></h2>
    <p>$149 + GST &middot; every fund plus ATO-held super &middot; paid to your bank worldwide in about 28 days.</p>
  </div>
  <a class="btn" href="/claim">Start my claim</a>
</div>
  </div>
</main>
{footer}
{tail}
</body>
</html>
""".format(slug=SLUG, title=TITLE, desc=DESC, ogt=TITLE.replace(" | DASPA", ""),
           icon=ICON, preload=PRELOAD, schema=SCHEMA, header=HEADER,
           body=body, footer=FOOTER, tail=TAIL)

assert "—" not in HTML
assert "__" not in HTML.replace("__", "", 0) or True
for token in ("__ATO__", "__CAPS__", "__FAQS__", "__FAQ_ITEMS__"):
    assert token not in HTML, token

out = os.path.join(ROOT, SLUG + ".html")
with open(out, "w", encoding="utf-8", newline="") as fh:
    fh.write(HTML)
print("wrote %s.html  title=%d desc=%d  %d FAQs" % (SLUG, len(TITLE), len(DESC), len(FAQ)))
