# Korean and Taiwanese landing pages.
#
# SEO.md names these as the biggest untapped cluster in the data: South Korea 700
# searches/month and Taiwan 450/month for "dasp", against near-zero competition.
#
# SHIPPED NOINDEX ON PURPOSE. This is a registered tax agent's site making
# statements about Australian tax law, so translated copy needs a native reader to
# sign it off before it is opened to search. Everything else is ready: the hreflang
# cluster, the schema and the sitemap entries are written so that removing the
# robots meta tag on a page is the only step left. Same pattern the kit used for
# the salary guide: build it dark, flip one flag per page.
import re, os

ROOT = r"C:\dev\daspa-site"
SRC = os.path.join(ROOT, "uk.html")

with open(SRC, encoding="utf-8", newline="") as fh:
    tpl = fh.read()

HEADER = re.search(r'<header class="site">.*?</header>', tpl, re.S).group(0)
FOOTER = re.search(r'<footer class="site">.*?</footer>', tpl, re.S).group(0)
TAIL = re.search(r'</footer>\s*(.*?)</body>', tpl, re.S).group(1).strip()
ICON = re.search(r'<link rel="icon"[^>]*>', tpl).group(0)
PRELOAD = re.search(r'<link rel="preload"[^>]*>', tpl).group(0)

HREFLANG = """<link rel="alternate" hreflang="en" href="https://daspa.com.au/">
<link rel="alternate" hreflang="ko" href="https://daspa.com.au/ko">
<link rel="alternate" hreflang="zh-Hant-TW" href="https://daspa.com.au/zh-tw">
<link rel="alternate" hreflang="x-default" href="https://daspa.com.au/">"""

PAGES = {}

# ---------------------------------------------------------------------------
# Korean
# ---------------------------------------------------------------------------
PAGES["ko"] = dict(
    lang="ko",
    locale="ko_KR",
    title="호주 퇴직연금(슈퍼) 환급 DASP 신청 | DASPA",
    desc="호주를 떠난 뒤 남겨둔 퇴직연금(Superannuation)을 돌려받는 방법. 세율, 6개월 기한, 신청 절차, 정액 수수료를 한국어로 정리했습니다.",
    h1="호주를 떠나셨나요? <em>남겨둔 퇴직연금을 돌려받으세요.</em>",
    sub="워킹홀리데이, 학생, 취업 비자로 호주에서 일했다면 퇴직연금(슈퍼)이 그대로 남아 있습니다. 호주 등록 세무사(Registered Tax Agent 26076969)가 대신 찾아 신청합니다.",
    body="""<div class="answer-first">
  <p><b>호주에서 임시 비자로 일한 뒤 출국했다면, 남아 있는 퇴직연금을 DASP(Departing Australia Superannuation Payment)로 전액 신청할 수 있습니다.</b> 비자가 만료되었거나 취소되었고 호주를 떠난 상태여야 합니다. 세금은 비자 종류에 따라 법으로 정해져 있으며, 워킹홀리데이(417 · 462)는 65%, 그 외 대부분의 임시 비자는 과세분에 대해 35%입니다. 신청이 완료되면 보통 28일 이내에 본인 명의의 한국 계좌로 입금됩니다.</p>
</div>

<h2>세율은 비자로 정해집니다</h2>
<p>국적이나 현재 거주지가 아니라, 호주에서 근무할 당시 보유했던 비자가 세율을 결정합니다. 이 세율은 호주 법률로 정해져 있으며 어떤 세무사도 낮출 수 없습니다.</p>
<div class="table-scroll">
<table>
<thead><tr><th>상황</th><th>DASP 세율</th><th>수령 비율</th></tr></thead>
<tbody>
<tr><td>워킹홀리데이 417 · 462 (연금이 펀드에 있는 경우)</td><td>65%</td><td>35%</td></tr>
<tr><td>그 외 임시 비자 482 · 500 등 (과세분)</td><td>35%</td><td>65%</td></tr>
<tr><td>이미 국세청(ATO)으로 이관된 경우 (비자 무관)</td><td>65%</td><td>35%</td></tr>
</tbody>
</table>
</div>

<h2>6개월이 지나면 손해가 커집니다</h2>
<p>비자가 만료되고 출국한 지 6개월이 지나면, 펀드는 잔액을 호주 국세청(ATO)에 미청구 자금으로 넘겨야 합니다. ATO가 보관 중인 퇴직연금은 <b>비자와 관계없이 65%</b>가 과세됩니다. 482나 500 비자였다면 35%에서 65%로 세율이 두 배 가까이 올라간다는 뜻입니다. 신청 시점은 본인이 통제할 수 있는 거의 유일한 변수입니다.</p>

<h2>진행 방식</h2>
<ul class="checklist">
  <li><b>1. 신청서 작성.</b> 영문 온라인 양식으로 약 5분이 걸립니다. 어느 펀드에 있는지 모르셔도 괜찮습니다. 본인 명의의 모든 계좌를 찾아드리는 것이 이 서비스의 핵심입니다.</li>
  <li><b>2. 신원 확인.</b> 여권과 셀피로 진행합니다. 공증이나 영사관 방문은 필요 없습니다.</li>
  <li><b>3. 등록 세무사가 신청.</b> 모든 펀드와 ATO 보유분을 확인한 뒤 신청하고, 입금될 때까지 진행 상황을 관리합니다.</li>
  <li><b>4. 본인 계좌로 입금.</b> 퇴직연금은 펀드 또는 ATO에서 고객님 계좌로 직접 송금됩니다. 저희가 고객님의 자금을 보관하는 일은 없습니다.</li>
</ul>

<h2>비용</h2>
<p>수수료는 <b>$149 + GST (총 $163.90 호주달러)</b> 정액입니다. 잔액이 얼마이든, 펀드가 몇 개이든 동일합니다. 퇴직연금 잔액의 일정 비율을 가져가는 방식이 아닙니다. 그리고 회수된 퇴직연금이 없으면 수수료는 전액 환불됩니다.</p>
<p>참고로, 호주 국세청은 무료 DASP 온라인 신청 시스템을 운영합니다. 상황이 단순하다면 직접 신청하셔도 충분합니다. 저희를 이용하시는 이유는 대개 펀드를 모르거나, 이미 ATO로 넘어갔거나, 직접 신청했다가 거절당한 경우입니다.</p>

<h2>자주 묻는 질문</h2>
<details class="faq"><summary>호주에 다시 가야 하나요?</summary><div class="a"><p>아니요. 오히려 호주를 떠난 상태여야 신청이 가능합니다. 모든 절차는 해외에서 진행하도록 만들어져 있습니다.</p></div></details>
<details class="faq"><summary>어느 펀드에 있는지 모릅니다.</summary><div class="a"><p>가장 흔한 경우입니다. 여권 정보로 본인 명의의 모든 퇴직연금 계좌와 ATO 보유분까지 조회합니다. 추가 비용은 없습니다.</p></div></details>
<details class="faq"><summary>호주 계좌를 이미 해지했습니다.</summary><div class="a"><p>문제되지 않습니다. 현재 사용 중인 한국 계좌로 송금받으실 수 있습니다. 계좌 명의가 여권상 이름과 일치하면 됩니다.</p></div></details>
<details class="faq"><summary>출국한 지 몇 년이 지났습니다. 늦었나요?</summary><div class="a"><p>DASP 신청에는 기한이 없습니다. 다만 6개월이 지난 자금은 ATO로 이관되어 65% 세율이 적용됩니다. 오래된 건도 많이 처리합니다.</p></div></details>
<details class="faq"><summary>세금을 돌려받을 수 있나요?</summary><div class="a"><p>DASP 세금은 최종 원천징수세로, 호주 세금 신고를 통해 환급받을 수 없습니다. 다만 급여에서 원천징수된 소득세(PAYG)는 별개이며, 환급 대상일 수 있습니다.</p></div></details>
<details class="faq"><summary>신청서가 한국어인가요?</summary><div class="a"><p>양식과 이메일 안내는 영어로 제공됩니다. 항목은 여권 정보와 계좌 정보 위주로 간단합니다. 막히는 부분이 있으면 WhatsApp으로 문의해 주세요.</p></div></details>""",
    faq=[("호주에 다시 가야 하나요?", "아니요. 오히려 호주를 떠난 상태여야 신청이 가능합니다. 모든 절차는 해외에서 진행하도록 만들어져 있습니다."),
         ("어느 펀드에 있는지 모릅니다.", "가장 흔한 경우입니다. 여권 정보로 본인 명의의 모든 퇴직연금 계좌와 ATO 보유분까지 조회합니다. 추가 비용은 없습니다."),
         ("호주 계좌를 이미 해지했습니다.", "문제되지 않습니다. 현재 사용 중인 한국 계좌로 송금받으실 수 있습니다. 계좌 명의가 여권상 이름과 일치하면 됩니다."),
         ("출국한 지 몇 년이 지났습니다. 늦었나요?", "DASP 신청에는 기한이 없습니다. 다만 6개월이 지난 자금은 ATO로 이관되어 65% 세율이 적용됩니다."),
         ("세금을 돌려받을 수 있나요?", "DASP 세금은 최종 원천징수세로, 호주 세금 신고를 통해 환급받을 수 없습니다. 다만 급여에서 원천징수된 소득세(PAYG)는 별개이며, 환급 대상일 수 있습니다.")],
    cta_h="준비되셨나요? <em>5분, 정액 수수료.</em>",
    cta_p="$149 + GST · 모든 펀드와 ATO 보유분 포함 · 약 28일 내 본인 계좌로 입금",
    cta_btn="신청 시작하기",
)

# ---------------------------------------------------------------------------
# Traditional Chinese (Taiwan)
# ---------------------------------------------------------------------------
PAGES["zh-tw"] = dict(
    lang="zh-Hant-TW",
    locale="zh_TW",
    title="澳洲退休金 DASP 申請退還 | DASPA",
    desc="離開澳洲後如何領回打工度假或工作期間累積的退休金（Superannuation）。稅率、六個月期限、申請流程與固定費用，中文說明。",
    h1="離開澳洲了嗎？<em>把你的退休金一起帶回來。</em>",
    sub="只要曾經持臨時簽證在澳洲工作，雇主就依法為你提撥了退休金。澳洲註冊稅務代理人（Registered Tax Agent 26076969）代你查詢並申請。",
    body="""<div class="answer-first">
  <p><b>持臨時簽證在澳洲工作、之後離境的人，可以用 DASP（Departing Australia Superannuation Payment）把留在澳洲的退休金全額領回。</b>條件是簽證已到期或已取消，而且你人已經離開澳洲。稅率由澳洲法律訂定，依簽證種類而不同：打工度假簽證（417 · 462）為 65%，其他多數臨時簽證的應稅部分為 35%。資料齊全的申請通常在 28 天內直接匯入你本人的台灣帳戶。</p>
</div>

<h2>稅率取決於簽證，不是國籍</h2>
<p>決定稅率的是你在澳洲工作期間持有的簽證，而不是你的國籍或目前居住地。這些稅率由澳洲法律訂定，由基金或稅務局直接代扣，任何代辦都無法降低。</p>
<div class="table-scroll">
<table>
<thead><tr><th>你的情況</th><th>DASP 稅率</th><th>實拿比例</th></tr></thead>
<tbody>
<tr><td>打工度假 417 · 462（退休金仍在基金）</td><td>65%</td><td>35%</td></tr>
<tr><td>其他臨時簽證 482 · 500 等（應稅部分）</td><td>35%</td><td>65%</td></tr>
<tr><td>已轉交澳洲稅務局 ATO（不分簽證）</td><td>65%</td><td>35%</td></tr>
</tbody>
</table>
</div>

<h2>超過六個月，差別很大</h2>
<p>簽證到期且你離境滿六個月後，基金必須把餘額轉交澳洲稅務局（ATO）列為無人請領款項。由 ATO 保管的退休金，<b>不分簽證一律課 65%</b>。如果你原本持 482 或 500 簽證，稅率等於從 35% 跳到 65%。申請的時間點，是整件事裡少數你能自己決定的變數。</p>

<h2>流程</h2>
<ul class="checklist">
  <li><b>1. 填寫申請表。</b>線上英文表格，大約五分鐘。不知道錢在哪一家基金也沒關係，把所有帳戶找出來正是這項服務的重點。</li>
  <li><b>2. 身分驗證。</b>用護照和自拍完成，不需要公證，也不必跑辦事處。</li>
  <li><b>3. 由註冊稅務代理人送件。</b>查遍所有基金與 ATO 保管的款項後送件，並持續追蹤到入帳為止。</li>
  <li><b>4. 直接匯給你。</b>退休金由基金或 ATO 直接匯入你指定的帳戶，我們不經手你的錢。</li>
</ul>

<h2>費用</h2>
<p>固定收費 <b>$149 + GST（合計澳幣 $163.90）</b>。不論餘額多少、有幾個基金帳戶都一樣，不是按退休金餘額抽成。如果查不到任何可領回的退休金，費用全額退還。</p>
<p>另外要說清楚：澳洲稅務局本身就提供免費的 DASP 線上申請系統。如果你的情況單純，自己申請完全可行。會找我們的人，通常是不知道基金在哪、錢已經被轉到 ATO，或是自己送件被退件。</p>

<h2>常見問題</h2>
<details class="faq"><summary>需要再回澳洲一趟嗎？</summary><div class="a"><p>不需要，而且必須是已經離境才能申請。整個流程本來就是設計成在海外完成。</p></div></details>
<details class="faq"><summary>我不知道退休金在哪一家基金。</summary><div class="a"><p>這是最常見的情況。我們用你的護照資料查詢所有以你名義開立的退休金帳戶，包含已轉到 ATO 的部分，不另外收費。</p></div></details>
<details class="faq"><summary>我的澳洲帳戶已經關了。</summary><div class="a"><p>沒問題，改匯到你現在使用的台灣帳戶即可。重點是帳戶名稱要與護照上的姓名一致。</p></div></details>
<details class="faq"><summary>我已經離開好幾年了，還來得及嗎？</summary><div class="a"><p>DASP 沒有申請期限，錢還是你的。差別在於超過六個月後款項會轉到 ATO，並適用 65% 稅率。這類舊案件我們處理過很多。</p></div></details>
<details class="faq"><summary>這筆稅可以退嗎？</summary><div class="a"><p>DASP 稅屬於最終扣繳稅，無法透過澳洲報稅退回。但薪資所得被預扣的所得稅（PAYG）是另一回事，那部分有機會退稅。</p></div></details>
<details class="faq"><summary>申請表有中文嗎？</summary><div class="a"><p>表格與通知信件為英文，內容以護照與銀行帳戶資料為主，並不複雜。卡住的話可以用 WhatsApp 直接問我們。</p></div></details>""",
    faq=[("需要再回澳洲一趟嗎？", "不需要，而且必須是已經離境才能申請。整個流程本來就是設計成在海外完成。"),
         ("我不知道退休金在哪一家基金。", "這是最常見的情況。我們用你的護照資料查詢所有以你名義開立的退休金帳戶，包含已轉到 ATO 的部分，不另外收費。"),
         ("我的澳洲帳戶已經關了。", "沒問題，改匯到你現在使用的台灣帳戶即可。重點是帳戶名稱要與護照上的姓名一致。"),
         ("我已經離開好幾年了，還來得及嗎？", "DASP 沒有申請期限，錢還是你的。差別在於超過六個月後款項會轉到 ATO，並適用 65% 稅率。"),
         ("這筆稅可以退嗎？", "DASP 稅屬於最終扣繳稅，無法透過澳洲報稅退回。但薪資所得被預扣的所得稅（PAYG）是另一回事，那部分有機會退稅。")],
    cta_h="準備好了嗎？<em>五分鐘，固定費用。</em>",
    cta_p="$149 + GST · 涵蓋所有基金與 ATO 保管款項 · 約 28 天內入帳",
    cta_btn="開始申請",
)


def jstr(s):
    return '"%s"' % s.replace("\\", "\\\\").replace('"', '\\"')


TEMPLATE = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,follow">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://daspa.com.au/{slug}">
{hreflang}
<meta property="og:type" content="website">
<meta property="og:title" content="{ogt}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="https://daspa.com.au/{slug}">
<meta property="og:locale" content="{locale}">
<meta property="og:site_name" content="DASPA">
<meta property="og:image" content="https://daspa.com.au/assets/og/index.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://daspa.com.au/assets/og/index.png">
{icon}
{preload}
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">
{{
 "@context": "https://schema.org",
 "@type": "FAQPage",
 "inLanguage": "{lang}",
 "mainEntity": [
{faq}
 ]
}}
</script>
</head>
<body>
{header}
<section class="page-hero">
  <div class="wrap">
    <div class="crumbs"><a href="/">DASPA</a> &middot; {crumb}</div>
    <h1>{h1}</h1>
    <p class="sub">{sub}</p>
  </div>
</section>
<main class="page">
  <div class="wrap-narrow prose">
{body}
<div class="cta-band">
  <div>
    <h2>{cta_h}</h2>
    <p>{cta_p}</p>
  </div>
  <a class="btn" href="/claim">{cta_btn}</a>
</div>
  </div>
</main>
{footer}
{tail}
</body>
</html>
"""

CRUMB = {"ko": "한국어", "zh-tw": "繁體中文"}

for slug, p in PAGES.items():
    faq = ",\n".join(
        '  {\n   "@type": "Question",\n   "name": %s,\n   "acceptedAnswer": { "@type": "Answer", "text": %s }\n  }'
        % (jstr(q), jstr(a)) for q, a in p["faq"])
    html = TEMPLATE.format(
        slug=slug, lang=p["lang"], locale=p["locale"], title=p["title"], desc=p["desc"],
        ogt=p["title"].replace(" | DASPA", ""), hreflang=HREFLANG, icon=ICON, preload=PRELOAD,
        faq=faq, header=HEADER, footer=FOOTER, tail=TAIL, crumb=CRUMB[slug],
        h1=p["h1"], sub=p["sub"], body=p["body"],
        cta_h=p["cta_h"], cta_p=p["cta_p"], cta_btn=p["cta_btn"])
    assert "\u2014" not in html, slug
    out = os.path.join(ROOT, slug + ".html")
    with open(out, "w", encoding="utf-8", newline="") as fh:
        fh.write(html)
    print("wrote %-12s lang=%-11s %d bytes  (noindex)" % (slug + ".html", p["lang"], len(html)))

# the English homepage joins the cluster, so the alternates resolve both ways
home = os.path.join(ROOT, "index.html")
with open(home, encoding="utf-8", newline="") as fh:
    t = fh.read()
if 'hreflang="ko"' not in t:
    m = re.search(r'<link rel="canonical"[^>]*>', t)
    t = t[:m.end()] + "\n" + HREFLANG + t[m.end():]
    with open(home, "w", encoding="utf-8", newline="") as fh:
        fh.write(t)
    print("homepage joined the hreflang cluster")
