# Language pages, built around REAL native-language head terms.
#
# Ahrefs, pulled 21 Aug 2026. Volumes are for the LOCALISED query, not for the
# English string "dasp" typed by people in that country, which is what SEO.md was
# quoting and is a different thing entirely.
#
#   TAIWAN                                    JAPAN
#     澳洲退休金            150  KD 0           スーパーアニュエーション          200  KD 0
#     澳洲退休金申請教學     100                 スーパーアニュエーション 返金     150  KD 0
#     澳洲退休金申請         50                  オーストラリア スーパーアニュエーション  150  KD 0
#     澳洲退休金領回         20                  スーパーアニュエーション 返金 やり方   70
#     澳洲退休金可以退多少   10                  スーパーアニュエーションとは        40
#     澳洲退休金護照公證     10                  返金 帰国後 / 返金方法             40
#     澳洲退休金代辦         10
#     澳洲退休金超過5000     10
#
#   KOREA: 호주 슈퍼 환급 is 10/mo. Koreans search the ENGLISH term (700/mo), so
#   Korean gets ONE page, kept as a trust and conversion asset. Building out a
#   Korean subtree would be translation risk bought for no search demand.
#
# One page, one head term, applied inside each language. The Japanese landing page
# targets the definitional term (200) and the refund page targets the procedural
# one (150 plus 70 plus 40), because those are different queries with different
# intent and collapsing them into one page wastes the larger of the two.
#
# URLs are flat (/zh-tw-apply, not /zh-tw/apply) because every other URL on this
# site is flat and cleanUrls is already proven against that shape. Worth moving to
# a folder per language when these come out of noindex.
#
# ALL OF THESE SHIP NOINDEX. Registered tax agent, statements about Australian tax
# law, and nobody here reads these languages. A native reader signs off the copy
# AND validates the target queries before the robots tag comes off, one page at a
# time. scripts/check.py enforces the noindex-and-not-in-sitemap pairing, and
# checks each page contains only the scripts it should.
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "uk.html")

with open(SRC, encoding="utf-8", newline="") as fh:
    tpl = fh.read()

HEADER = re.search(r'<header class="site">.*?</header>', tpl, re.S).group(0)
FOOTER = re.search(r'<footer class="site">.*?</footer>', tpl, re.S).group(0)
TAIL = re.search(r'</footer>\s*(.*?)</body>', tpl, re.S).group(1).strip()
ICON = re.search(r'<link rel="icon"[^>]*>', tpl).group(0)
PRELOAD = re.search(r'<link rel="preload"[^>]*>', tpl).group(0)

# ---------------------------------------------------------------------------
# The payout table, generated from the same constants as the English calculator
# so a rate change cannot leave a translated page quietly wrong.
# ---------------------------------------------------------------------------
FEE = 163.90
WHM, OTHER = 0.65, 0.35
BANDS = [2500, 5000, 7500, 10000, 15000, 20000, 30000]


def net(balance, rate):
    return max(0, balance - balance * rate - FEE)


def money(n):
    return "$" + format(int(round(n)), ",d")


assert money(net(20000, OTHER)) == "$12,836"   # agrees with /dasp-calculator
assert money(net(5000, WHM)) == "$1,586"


def payout_table(headers):
    rows = "\n".join(
        "<tr><td><b>%s</b></td><td>%s</td><td>%s</td></tr>"
        % (money(b), money(net(b, WHM)), money(net(b, OTHER))) for b in BANDS)
    return ("""<div class="table-scroll">
<table>
<thead><tr><th>%s</th><th>%s</th><th>%s</th></tr></thead>
<tbody>
%s
</tbody>
</table>
</div>""" % (headers[0], headers[1], headers[2], rows))


RATE_ROWS = {
    "zh-tw": [("打工度假 417 · 462（退休金仍在基金）", "65%", "35%"),
              ("其他臨時簽證 482 · 500 等（應稅部分）", "35%", "65%"),
              ("已轉交澳洲稅務局 ATO（不分簽證）", "65%", "35%")],
    "ja": [("ワーキングホリデー 417 · 462（基金に残っている場合）", "65%", "35%"),
           ("その他の一時滞在ビザ 482 · 500 など（課税対象分）", "35%", "65%"),
           ("既に ATO へ移管済み（ビザを問わず）", "65%", "35%")],
    "ko": [("워킹홀리데이 417 · 462 (연금이 펀드에 있는 경우)", "65%", "35%"),
           ("그 외 임시 비자 482 · 500 등 (과세분)", "35%", "65%"),
           ("이미 국세청(ATO)으로 이관된 경우 (비자 무관)", "65%", "35%")],
}
RATE_HEAD = {
    "zh-tw": ("你的情況", "DASP 稅率", "實拿比例"),
    "ja": ("該当する状況", "DASP 税率", "受取割合"),
    "ko": ("상황", "DASP 세율", "수령 비율"),
}


def rate_table(lang):
    h = RATE_HEAD[lang]
    rows = "\n".join("<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % r for r in RATE_ROWS[lang])
    return ("""<div class="table-scroll">
<table>
<thead><tr><th>%s</th><th>%s</th><th>%s</th></tr></thead>
<tbody>
%s
</tbody>
</table>
</div>""" % (h[0], h[1], h[2], rows))


# ---------------------------------------------------------------------------
GOVERNS = {
    "zh-tw": ("本頁為中文說明，僅供參考。條款、稅務內容與法律文件以"
              '<a href="/">英文版本</a>為準。'),
    "ja": ("このページは参考用の日本語訳です。規約および税務・法務に関する記載は"
           '<a href="/">英語版</a>が正文となります。'),
    "ko": ("이 페이지는 참고용 한국어 안내입니다. 약관과 세무·법률 관련 내용은 "
           '<a href="/">영문 페이지</a>가 우선합니다.'),
}

LANG_META = {
    "zh-tw": dict(lang="zh-Hant-TW", locale="zh_TW", crumb="繁體中文"),
    "ja": dict(lang="ja", locale="ja_JP", crumb="日本語"),
    "ko": dict(lang="ko", locale="ko_KR", crumb="한국어"),
}

# in-language nav, so every page in a language reaches the others
NAV = {
    "zh-tw": [("/zh-tw", "澳洲退休金"), ("/zh-tw-apply", "申請教學"),
              ("/zh-tw-calculator", "可以退多少"), ("/zh-tw-faq", "常見問題")],
    "ja": [("/ja", "スーパーアニュエーション"), ("/ja-refund", "返金のやり方"),
           ("/ja-calculator", "いくら戻る"), ("/ja-faq", "よくある質問")],
    "ko": [("/ko", "호주 퇴직연금 환급")],
}

CTA = {
    "zh-tw": ("準備好了嗎？<em>五分鐘，固定費用。</em>",
              "$149 + GST · 涵蓋所有基金與 ATO 保管款項 · 約 28 天內入帳", "開始申請"),
    "ja": ("ご準備ができましたら。<em>5 分、定額。</em>",
           "$149 + GST · すべての基金と ATO 保管分を含む · 約 28 日で入金", "申請をはじめる"),
    "ko": ("준비되셨나요? <em>5분, 정액 수수료.</em>",
           "$149 + GST · 모든 펀드와 ATO 보유분 포함 · 약 28일 내 본인 계좌로 입금", "신청 시작하기"),
}

PAGES = []   # (slug, lang, head_term, title, desc, h1, sub, body, faq, en_equiv)

# ===========================================================================
# TRADITIONAL CHINESE
# ===========================================================================
PAGES.append(dict(
    slug="zh-tw", lang="zh-tw", en="/",
    head_term="澳洲退休金 (150/mo)",
    title="澳洲退休金是什麼？離境後怎麼領回 | DASPA",
    desc="在澳洲工作時雇主依法提撥的退休金，離境後可以全額領回。這裡說明它是什麼、你有沒有、稅率怎麼算，以及六個月的關鍵期限。",
    h1="澳洲退休金，<em>離開澳洲後可以全額領回。</em>",
    sub="只要曾經持臨時簽證在澳洲工作，雇主就依法為你提撥了退休金。離境之後可以用 DASP 把它全部領回。",
    body="""<div class="answer-first">
  <p><b>澳洲退休金（Superannuation）是雇主依法在你的薪水之外另外提撥的錢，帳戶裡的餘額屬於你。</b>持臨時簽證在澳洲工作、之後離境的人，可以透過 DASP（Departing Australia Superannuation Payment）把整筆錢領回。條件是簽證已到期或已取消，而且你人已經離開澳洲。稅率由澳洲法律訂定，依簽證種類而不同：打工度假簽證（417 · 462）為 65%，其他多數臨時簽證的應稅部分為 35%。</p>
</div>

<h2>什麼是澳洲退休金</h2>
<p>在澳洲工作時，雇主必須在你的時薪或年薪<b>之外</b>，額外把一筆錢存進退休金帳戶，目前的法定比例是 12%。這筆錢不是從你的薪水裡扣的，也不會出現在你的銀行帳戶裡，所以很多打工度假的人整趟旅程結束都不知道它存在。錢會留在某一家退休金基金（super fund）裡，直到你符合條件把它領出來。</p>
<p>對澳洲人來說，那個條件是退休。對持臨時簽證的人來說，條件是<b>離開澳洲</b>，而這就是 DASP。</p>

<h2>我到底有沒有澳洲退休金</h2>
<p>如果你在澳洲有領過薪水，答案幾乎一定是有。幾個常見情況：</p>
<ul class="checklist">
  <li><b>換過好幾份工作。</b>每個雇主都可能把錢存進<em>不同</em>的基金。做過農場、餐廳、飯店三份工，很可能就有三個帳戶，而你只記得其中一個，或一個都不記得。</li>
  <li><b>從來沒收到過對帳單。</b>基金寄的信通常寄到你當時的澳洲地址，那個地址你早就退租了。沒收到信不代表沒有錢。</li>
  <li><b>錢已經被轉走了。</b>離境滿六個月後，基金必須把餘額交給澳洲稅務局（ATO）保管。錢還是你的，但稅率會變差。</li>
</ul>
<p>不知道在哪一家基金完全沒關係。用護照資料查出所有以你名義開立的帳戶，本來就是這項服務的重點，不另外收費。</p>

<h2>稅率取決於簽證，不是國籍</h2>
<p>決定稅率的是你在澳洲工作期間持有的簽證，不是你的國籍或目前居住地。這些稅率由澳洲法律訂定，由基金或稅務局直接代扣，任何代辦都無法降低。</p>
__RATE_TABLE__
<p>所有金額皆以澳幣計算，實際入帳金額會依你的銀行換匯而定。想知道自己大概能拿回多少，可以看<a href="/zh-tw-calculator">澳洲退休金可以退多少</a>。</p>

<h2>超過六個月，差別很大</h2>
<p>簽證到期且你離境滿六個月後，基金必須把餘額交給 ATO 列為無人請領款項。由 ATO 保管的退休金，<b>不分簽證一律課 65%</b>。如果你原本持 482 或 500 簽證，稅率等於從 35% 跳到 65%。申請的時間點，是整件事裡少數你能自己決定的變數。</p>

<h2>接下來怎麼做</h2>
<p>實際的申請步驟、需要準備什麼、以及自己送件和找代辦的差別，整理在<a href="/zh-tw-apply">澳洲退休金申請教學</a>。其他零碎的問題可以看<a href="/zh-tw-faq">常見問題</a>。</p>""",
    faq=[("什麼是澳洲退休金？", "澳洲退休金（Superannuation）是雇主依法在你的薪水之外另外提撥的錢，目前法定比例為 12%。帳戶裡的餘額屬於你，會留在退休金基金裡直到符合領取條件。對持臨時簽證的人來說，領取條件就是離開澳洲。"),
         ("離開澳洲後要怎麼領回退休金？", "透過 DASP（Departing Australia Superannuation Payment）申請。條件是簽證已到期或已取消，而且你已經離境。整個流程可以在海外完成，不需要回澳洲，也不需要保留澳洲銀行帳戶。"),
         ("我怎麼知道自己有沒有退休金？", "只要在澳洲領過薪水，幾乎一定有。雇主可能把錢存進不同的基金，所以做過多份工作的人常常有好幾個帳戶。用護照資料就可以查出所有以你名義開立的帳戶。")]))

PAGES.append(dict(
    slug="zh-tw-apply", lang="zh-tw", en="/dasp-online-application",
    head_term="澳洲退休金申請教學 (100/mo) + 澳洲退休金申請 (50/mo)",
    title="澳洲退休金申請教學 2026：步驟與文件 | DASPA",
    desc="離境後申請澳洲退休金的完整步驟：需要準備哪些資料、自己送件和找代辦差在哪、卡關時怎麼處理，以及送出後多久入帳。",
    h1="澳洲退休金申請教學，<em>2026 年版。</em>",
    sub="從確認資格到錢入帳，整個流程都在海外完成。以下是實際要做的每一步，以及最常卡住的地方。",
    body="""<div class="answer-first">
  <p><b>申請澳洲退休金要先確認三件事：簽證已到期或已取消、你人已經離開澳洲、而且你知道（或查得出）錢在哪一家基金。</b>三件都成立之後，可以自己在澳洲稅務局的免費線上系統送件，也可以交給註冊稅務代理人代辦。資料齊全的申請通常在 28 天內直接匯入你本人的台灣帳戶。</p>
</div>

<h2>第一步：確認資格</h2>
<ul class="checklist">
  <li><b>簽證狀態。</b>必須已到期或已取消。如果你確定不回去了但簽證還有效期，可以向澳洲內政部申請取消簽證，這樣馬上符合資格，不必空等。</li>
  <li><b>你人在澳洲境外。</b>還在澳洲境內時無法申請，這是規定，不是流程問題。</li>
  <li><b>你不是澳洲公民或永久居民。</b>持永久簽證的人不適用 DASP。紐西蘭公民另有 KiwiSaver 的跨塔斯曼轉移機制。</li>
</ul>

<h2>第二步：準備資料</h2>
<ul class="checklist">
  <li><b>護照。</b>入境澳洲時使用的那本。換過護照的話，兩本的資料都要。</li>
  <li><b>稅號 TFN。</b>非必要，但有的話查詢帳戶會快很多。</li>
  <li><b>基金名稱與會員編號。</b>不知道也可以送件，查詢帳戶本來就是服務內容。</li>
  <li><b>收款帳戶。</b>台灣的帳戶即可，需要 SWIFT/BIC。帳戶名稱要與護照姓名一致，這是最常見的退件原因。</li>
  <li><b>離境日期。</b>大概的日期就可以。</li>
</ul>

<h2>第三步：送件</h2>
<p>有兩條路，結果一樣，差別在誰做事、卡關時誰處理。</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>自己送件</th><th>交給 DASPA</th></tr></thead>
<tbody>
<tr><td>費用</td><td>免費</td><td>$149 + GST 固定收費</td></tr>
<tr><td>稅率</td><td colspan="2">完全相同，由法律訂定</td></tr>
<tr><td>不知道基金在哪</td><td>要自己一家家查</td><td>查遍所有基金與 ATO 保管款項</td></tr>
<tr><td>基金要求公證文件</td><td>要自己找公證人</td><td>用護照與自拍完成電子驗證</td></tr>
<tr><td>被退件</td><td>自己重來</td><td>由代理人處理</td></tr>
</tbody>
</table>
</div>
<p>說清楚：澳洲稅務局的免費線上系統確實好用。如果你只有一個基金、資料齊全、餘額不高，自己送件完全合理。</p>

<h2>最容易卡住的三件事</h2>
<ul class="checklist">
  <li><b>姓名不一致。</b>護照、基金帳戶、銀行帳戶三邊的姓名拼法必須對得起來。中文姓名的英文拼法在不同文件上不同，是退件的第一名原因。</li>
  <li><b>餘額超過 5,000 澳幣。</b>部分基金在金額較高時會要求經公證的身分文件。透過註冊稅務代理人送件時，改以電子驗證處理，不必找公證人。</li>
  <li><b>錢已經在 ATO。</b>離境滿六個月後款項會被移轉，稅率一律變成 65%。這種情況要向 ATO 而非基金申請。</li>
</ul>

<h2>送出之後</h2>
<p>資料齊全的申請，澳洲稅務局的標準是 28 天內付款。實際上拖延多半來自資料不齊、姓名不符，或基金要求補件。款項由基金或 ATO 直接匯到你的帳戶，我們不經手你的錢。</p>
<p>想先估算金額，可以看<a href="/zh-tw-calculator">澳洲退休金可以退多少</a>；還不清楚退休金是什麼，先看<a href="/zh-tw">澳洲退休金說明</a>。</p>""",
    faq=[("澳洲退休金申請需要什麼文件？", "護照（入境澳洲時使用的那本）、收款銀行帳戶資料含 SWIFT/BIC、以及大概的離境日期。稅號 TFN 和基金名稱有的話更快，但不是必要的。"),
         ("我可以自己申請澳洲退休金嗎？", "可以。澳洲稅務局提供免費的 DASP 線上申請系統。如果你只有一個基金、資料齊全、餘額不高，自己送件完全合理。會找代辦的通常是不知道基金在哪、款項已轉到 ATO，或自己送件被退件。"),
         ("申請要多久才會拿到錢？", "資料齊全的申請，澳洲稅務局的標準是 28 天內付款。拖延多半來自資料不齊、姓名不符，或基金要求補充文件。"),
         ("餘額超過 5,000 澳幣會比較麻煩嗎？", "部分基金在金額較高時會要求經公證的身分文件。透過註冊稅務代理人送件時改以電子驗證處理，不需要另外找公證人。")]))

PAGES.append(dict(
    slug="zh-tw-calculator", lang="zh-tw", en="/dasp-calculator",
    head_term="澳洲退休金可以退多少",
    title="澳洲退休金可以退多少？稅後金額對照表 | DASPA",
    desc="依你的簽證與餘額，看實際會匯進帳戶的金額。含稅率對照、常見餘額的稅後試算，以及不知道餘額時的推估方式。",
    h1="澳洲退休金可以退多少？<em>先看稅後的數字。</em>",
    sub="退休金餘額不等於入帳金額。稅率由簽證決定，以下是扣完稅、扣完固定費用之後實際會到手的金額。",
    body="""<div class="answer-first">
  <p><b>你實際拿到的金額，等於退休金餘額扣掉法定的 DASP 稅，再扣掉一次性的服務費。</b>打工度假簽證（417 · 462）的稅率是 65%，其他多數臨時簽證的應稅部分是 35%，已轉到 ATO 的款項則不分簽證一律 65%。稅率由澳洲法律訂定，任何代辦都無法降低，唯一能改變結果的是<b>申請的時間點</b>。</p>
</div>

<h2>稅率對照</h2>
__RATE_TABLE__

<h2>稅後實拿金額對照表</h2>
<p>下表已扣除 DASP 稅與 $149 + GST 的固定費用，也就是實際會匯進你帳戶的金額。找最接近你餘額的那一列。</p>
__PAYOUT_TABLE__
<p style="font-size:13px;color:var(--muted)">金額以澳幣計算並四捨五入至整數。表格假設整筆餘額為應稅部分，這是最常見的情況；少見的非應稅部分適用 45%。實際入帳金額會依你的銀行換匯而定。</p>

<h2>不知道餘額怎麼推估</h2>
<p>雇主依法要在薪水之外另外提撥，目前比例是 12%。用你在澳洲的稅前總收入乘上這個比例，就是一個可用的估計值。舉例來說，總收入 3 萬澳幣，退休金大約是 3,600 澳幣，這是稅前的數字。</p>
<p>如果你在澳洲工作的期間比較早，比例會低一些：2021 年 7 月前是 9.5%，2023 到 2025 年間約 11% 到 11.5%。</p>

<h2>為什麼六個月很重要</h2>
<p>離境滿六個月後，基金必須把餘額交給 ATO，稅率一律變成 65%。對打工度假簽證來說前後都是 65%，沒有差別；但對 482 或 500 簽證來說，餘額 2 萬澳幣的情況下，差距大約是 6,000 澳幣。這是整件事裡唯一由你決定的變數。</p>
<p>互動式試算工具目前是英文版：<a href="/dasp-calculator">DASP tax calculator</a>。申請步驟請看<a href="/zh-tw-apply">申請教學</a>。</p>""",
    faq=[("澳洲退休金可以退多少？", "退休金餘額扣掉法定 DASP 稅之後的金額。打工度假簽證 417 和 462 的稅率是 65%，其他多數臨時簽證的應稅部分是 35%，已轉到 ATO 的款項不分簽證一律 65%。"),
         ("我不知道自己的退休金餘額怎麼辦？", "用你在澳洲的稅前總收入乘上法定提撥比例（目前 12%）可以得到可用的估計值。實際餘額我們會用你的護照資料查出來，不另外收費。"),
         ("稅率可以降低嗎？", "不行。DASP 稅率由澳洲法律訂定，由基金或稅務局直接代扣，任何代辦都無法降低。唯一能改變結果的是申請的時間點，因為超過六個月後款項會轉到 ATO 並一律課 65%。")]))

PAGES.append(dict(
    slug="zh-tw-faq", lang="zh-tw", en="/faq",
    head_term="長尾問題：護照公證、代辦、超過5000",
    title="澳洲退休金常見問題：公證、代辦與期限 | DASPA",
    desc="台灣人申請澳洲退休金最常問的問題：需不需要護照公證、找代辦划不划算、離開很久還能不能領、以及稅可不可以退。",
    h1="澳洲退休金<em>常見問題。</em>",
    sub="以下是台灣申請人最常問的問題，包含幾個我們認為應該說清楚、而不是含糊帶過的部分。",
    body="""<div class="answer-first">
  <p><b>最常見的三個問題：不需要護照公證（透過註冊稅務代理人以電子方式驗證身分）、沒有申請期限（但超過六個月稅率會變差）、以及 DASP 稅無法透過報稅退回。</b>細節在下面。</p>
</div>

<h2>資格與時間</h2>
<details class="faq"><summary>需要再回澳洲一趟嗎？</summary><div class="a"><p>不需要，而且必須是已經離境才能申請。整個流程本來就是設計成在海外完成。</p></div></details>
<details class="faq"><summary>我還在澳洲，可以先申請嗎？</summary><div class="a"><p>不行。DASP 要求簽證已到期或已取消，而且你已經離開澳洲。如果你確定不回去了但簽證還有效期，可以向澳洲內政部申請取消簽證，這樣就能馬上符合資格。</p></div></details>
<details class="faq"><summary>我已經離開好幾年了，還來得及嗎？</summary><div class="a"><p>DASP 沒有申請期限，錢還是你的。差別在於超過六個月後款項會轉到 ATO，並適用 65% 稅率。這類舊案件我們處理過很多。</p></div></details>
<details class="faq"><summary>我後來又拿到別的澳洲簽證，有影響嗎？</summary><div class="a"><p>稅率跟著提撥當時的簽證走，不是跟著你最後持有的簽證。打工度假期間提撥的部分，即使你後來換成技術簽證，仍然適用打工度假的稅率。</p></div></details>

<h2>文件與身分驗證</h2>
<details class="faq"><summary>澳洲退休金需要護照公證嗎？</summary><div class="a"><p>透過我們申請不需要。身分驗證用護照加自拍的電子方式完成，不必找公證人，也不必跑辦事處。自己直接向基金申請時，部分基金在金額較高的情況下會要求經公證的文件。</p></div></details>
<details class="faq"><summary>餘額超過 5,000 澳幣會不會比較麻煩？</summary><div class="a"><p>這是常見的門檻，部分基金在超過之後會要求更嚴格的身分證明。透過註冊稅務代理人送件時以電子驗證處理，流程不變。</p></div></details>
<details class="faq"><summary>我的英文姓名在不同文件上拼法不一樣。</summary><div class="a"><p>這是退件的第一名原因，也是可以事先處理的。護照、基金帳戶、銀行帳戶三邊對得起來就沒問題，對不起來的部分我們會協助釐清。</p></div></details>
<details class="faq"><summary>我不知道退休金在哪一家基金。</summary><div class="a"><p>最常見的情況。我們用你的護照資料查詢所有以你名義開立的退休金帳戶，包含已轉到 ATO 的部分，不另外收費。</p></div></details>

<h2>費用與稅</h2>
<details class="faq"><summary>找代辦划得來嗎？</summary><div class="a"><p>看情況，我們的答案不會一律是「划得來」。如果你只有一個基金、資料齊全、餘額不高，澳洲稅務局的免費系統完全夠用。會找我們的人通常是不知道基金在哪、款項已經轉到 ATO，或是自己送件被退件。</p></div></details>
<details class="faq"><summary>費用怎麼算？</summary><div class="a"><p>$149 + GST（合計澳幣 $163.90）固定收費，不論餘額多少、有幾個基金帳戶都一樣，不是按餘額抽成。查不到任何可領回的退休金時，費用全額退還。</p></div></details>
<details class="faq"><summary>這筆稅可以退嗎？</summary><div class="a"><p>DASP 稅屬於最終扣繳稅，無法透過澳洲報稅退回。但薪資所得被預扣的所得稅（PAYG）是另一回事，那部分有機會退稅，屬於不同的申請。</p></div></details>
<details class="faq"><summary>台灣要不要為這筆錢繳稅？</summary><div class="a"><p>這筆錢在澳洲已依法課稅。台灣端如何認定屬於台灣稅務問題，我們沒有相關執照，不提供這方面的意見，建議諮詢台灣的會計師。</p></div></details>

<h2>收款</h2>
<details class="faq"><summary>可以匯到台灣的帳戶嗎？</summary><div class="a"><p>可以。基金或 ATO 會用你的 SWIFT/BIC 資料國際匯款，款項以澳幣送出，由你的銀行換匯。</p></div></details>
<details class="faq"><summary>我的澳洲帳戶已經關了。</summary><div class="a"><p>沒問題，改匯到你現在使用的台灣帳戶即可。重點是帳戶名稱要與護照上的姓名一致。</p></div></details>
<details class="faq"><summary>申請表有中文嗎？</summary><div class="a"><p>表格與通知信件為英文，內容以護照與銀行帳戶資料為主，並不複雜。卡住的話可以用 WhatsApp 直接問我們。</p></div></details>""",
    faq=[("澳洲退休金需要護照公證嗎？", "透過註冊稅務代理人申請不需要。身分驗證用護照加自拍的電子方式完成，不必找公證人。自己直接向基金申請時，部分基金在金額較高的情況下會要求經公證的文件。"),
         ("澳洲退休金找代辦划得來嗎？", "看情況。如果你只有一個基金、資料齊全、餘額不高，澳洲稅務局的免費系統完全夠用。會找代辦的人通常是不知道基金在哪、款項已經轉到 ATO，或是自己送件被退件。"),
         ("澳洲退休金的稅可以退嗎？", "DASP 稅屬於最終扣繳稅，無法透過澳洲報稅退回。但薪資所得被預扣的所得稅（PAYG）是另一回事，那部分有機會退稅。"),
         ("餘額超過 5,000 澳幣會比較麻煩嗎？", "部分基金在超過這個金額後會要求更嚴格的身分證明。透過註冊稅務代理人送件時以電子驗證處理，流程不變。")]))

# ===========================================================================
# JAPANESE
# The landing page owns the DEFINITIONAL term (スーパーアニュエーション, 200/mo,
# plus オーストラリア スーパーアニュエーション 150 and とは 40). The refund page
# owns the PROCEDURAL cluster (返金 150, 返金 やり方 70, 返金方法 20, 帰国後 20).
# Different queries, different intent, so they get different pages.
# ===========================================================================
PAGES.append(dict(
    slug="ja", lang="ja", en="/",
    head_term="スーパーアニュエーション (200/mo) + オーストラリア スーパーアニュエーション (150) + とは (40)",
    title="スーパーアニュエーションとは｜制度と返金 | DASPA",
    desc="オーストラリアで働くと雇用主が積み立てる年金制度。仕組み、自分の分があるかの確かめ方、帰国後に受け取るための条件を日本語で説明します。",
    h1="スーパーアニュエーションとは、<em>あなたのために積み立てられたお金です。</em>",
    sub="オーストラリアで働くと、雇用主は給与とは別に年金を積み立てる義務があります。一時滞在ビザだった方は、帰国後にその全額を請求できます。",
    body="""<div class="answer-first">
  <p><b>スーパーアニュエーション（Superannuation）は、給与とは別に雇用主が積み立てるオーストラリアの年金制度で、口座の残高はあなたのものです。</b>現在の法定積立率は 12%。オーストラリア人にとっての受給条件は退職ですが、一時滞在ビザで働いた方の条件は<b>出国</b>で、その手続きが DASP（Departing Australia Superannuation Payment）です。税率はビザによって決まり、ワーキングホリデー（417 · 462）は 65%、その他の多くの一時滞在ビザは課税対象分に 35% です。</p>
</div>

<h2>仕組み</h2>
<p>オーストラリアで働くと、雇用主は時給や年収と<b>は別に</b>、法律で定められた割合を年金口座へ積み立てる義務があります。給与から差し引かれるお金ではなく、銀行口座にも入ってきません。そのため、ワーキングホリデーで滞在した方の多くは、帰国するまでその存在に気づきません。</p>
<p>お金はいずれかのスーパー基金（super fund）に置かれたままになり、受給条件を満たすまで引き出せません。</p>

<h2>自分の分が残っているか</h2>
<p>オーストラリアで給与を受け取ったことがあるなら、ほぼ確実に残っています。よくあるのは次のようなケースです。</p>
<ul class="checklist">
  <li><b>複数の職場で働いた。</b>雇用主ごとに<em>別々の</em>基金に積み立てられることがあります。ファーム、レストラン、ホテルで働けば、口座が三つあってもおかしくありません。</li>
  <li><b>通知が届いていない。</b>基金からの書類は当時のオーストラリアの住所に送られます。もう住んでいない住所です。届いていないことは、残っていないことを意味しません。</li>
  <li><b>既に移管されている。</b>出国から 6 か月が過ぎると、基金は残高をオーストラリア税務局（ATO）へ引き渡します。お金はあなたのものですが、税率が不利になります。</li>
</ul>
<p>どの基金か分からなくても問題ありません。パスポート情報からご本人名義の口座をすべて探すことが、このサービスの中心です。追加料金はかかりません。</p>

<h2>税率はビザで決まります</h2>
<p>税率を決めるのは、働いていた当時に保有していたビザであり、国籍でも現在の居住地でもありません。税率は法律で定められ、基金または税務局が源泉徴収します。どの代理人でも変更できません。</p>
__RATE_TABLE__
<p>金額はすべてオーストラリアドル建てです。手取りの目安は<a href="/ja-calculator">いくら戻るか</a>をご覧ください。</p>

<h2>6 か月を過ぎると不利になります</h2>
<p>ビザが失効し、出国から 6 か月が経過すると、基金は残高を未請求資産として ATO へ引き渡さなければなりません。ATO が保管する年金は、<b>ビザを問わず一律 65%</b> が課税されます。482 や 500 のビザだった方は、35% から 65% へ跳ね上がることになります。申請の時期は、ご自身で決められる数少ない要素です。</p>

<h2>次にすること</h2>
<p>実際の手続き、必要なもの、自分で申請する場合との違いは<a href="/ja-refund">スーパーアニュエーション返金のやり方</a>にまとめています。細かい疑問は<a href="/ja-faq">よくある質問</a>へ。</p>""",
    faq=[("スーパーアニュエーションとは何ですか。", "給与とは別に雇用主が積み立てるオーストラリアの年金制度で、現在の法定積立率は 12% です。口座の残高はあなたのものであり、受給条件を満たすまで基金に留め置かれます。一時滞在ビザの方にとっての受給条件は、オーストラリアを出国することです。"),
         ("自分にスーパーアニュエーションが残っているか分かりません。", "オーストラリアで給与を受け取ったことがあるなら、ほぼ確実に残っています。雇用主ごとに別の基金へ積み立てられることがあるため、複数の職場で働いた方は口座が複数あることも珍しくありません。パスポート情報からすべて調査できます。"),
         ("帰国後にスーパーアニュエーションはどうなりますか。", "そのまま基金に残ります。出国から 6 か月が過ぎると、基金は残高をオーストラリア税務局へ引き渡し、ビザを問わず 65% の税率が適用されます。お金がなくなるわけではありませんが、条件は不利になります。")]))

PAGES.append(dict(
    slug="ja-refund", lang="ja", en="/dasp-online-application",
    head_term="スーパーアニュエーション 返金 (150/mo) + やり方 (70) + 返金方法 (20) + 帰国後 (20)",
    title="スーパーアニュエーション返金のやり方と必要書類 | DASPA",
    desc="帰国後にオーストラリアの年金を受け取る手順。必要な書類、自分で申請する場合との違い、つまずきやすい点、入金までの期間をまとめました。",
    h1="スーパーアニュエーション返金の<em>やり方。</em>",
    sub="条件の確認から入金まで、すべて日本にいながら完了します。実際に必要な手順と、最もつまずきやすい箇所をまとめました。",
    body="""<div class="answer-first">
  <p><b>返金請求の前に三つを確認します。ビザが失効または取り消されていること、既に出国していること、そして積立先の基金が分かる（または調べられる）こと。</b>この三つが揃えば、オーストラリア税務局の無料オンラインシステムで自分で申請するか、登録税務代理人に依頼するかを選べます。書類の揃った申請は通常 28 日以内に、ご本人名義の日本の口座へ直接振り込まれます。</p>
</div>

<h2>手順 1：条件を確認する</h2>
<ul class="checklist">
  <li><b>ビザの状態。</b>失効または取り消し済みであることが必要です。帰国を決めていて有効期間が残っている場合は、内務省にビザの取り消しを申請すれば、期限を待たずに条件を満たせます。</li>
  <li><b>オーストラリア国外にいること。</b>滞在中は申請できません。手続き上の都合ではなく、制度上の条件です。</li>
  <li><b>永住者や市民権保持者でないこと。</b>永住ビザの方は DASP の対象外です。</li>
</ul>

<h2>手順 2：必要なものを揃える</h2>
<ul class="checklist">
  <li><b>パスポート。</b>オーストラリア入国時に使用したもの。更新している場合は両方の情報が必要です。</li>
  <li><b>タックスファイルナンバー（TFN）。</b>必須ではありませんが、あると口座の特定が早くなります。</li>
  <li><b>基金名と会員番号。</b>不明でも申請できます。口座を探すこと自体がサービスの中心です。</li>
  <li><b>受取口座。</b>日本の口座で構いません。SWIFT/BIC が必要です。<b>口座名義がパスポートの氏名と一致していること</b>が最も重要です。</li>
  <li><b>出国日。</b>おおよそで構いません。</li>
</ul>

<h2>手順 3：申請する</h2>
<p>方法は二つあり、受け取る税率も金額も同じです。違うのは誰が作業し、つまずいたときに誰が対応するかです。</p>
<div class="table-scroll">
<table>
<thead><tr><th></th><th>自分で申請</th><th>DASPA に依頼</th></tr></thead>
<tbody>
<tr><td>費用</td><td>無料</td><td>$149 + GST の定額</td></tr>
<tr><td>税率</td><td colspan="2">同じ。法律で定められています</td></tr>
<tr><td>基金が分からない</td><td>自分で一つずつ確認</td><td>すべての基金と ATO 保管分を調査</td></tr>
<tr><td>公証書類を求められた</td><td>自分で公証人を手配</td><td>パスポートと自撮りで電子的に確認</td></tr>
<tr><td>却下された</td><td>自分でやり直し</td><td>代理人が対応</td></tr>
</tbody>
</table>
</div>
<p>はっきり申し上げると、オーストラリア税務局の無料システムはよくできています。基金が一つだけで、書類が揃っていて、残高もそれほど多くないのであれば、ご自身で申請するのが合理的です。</p>

<h2>つまずきやすい三つ</h2>
<ul class="checklist">
  <li><b>氏名の不一致。</b>パスポート、基金口座、銀行口座の三つで氏名の表記が揃っている必要があります。却下理由の第一位です。</li>
  <li><b>残高が 5,000 ドルを超える場合。</b>一部の基金は公証済みの本人確認書類を求めます。登録税務代理人経由なら電子的な本人確認で処理でき、公証人は不要です。</li>
  <li><b>既に ATO へ移管されている場合。</b>出国から 6 か月を過ぎると移管され、税率は一律 65% になります。この場合の請求先は基金ではなく ATO です。</li>
</ul>

<h2>申請したあと</h2>
<p>書類の揃った申請について、オーストラリア税務局の基準は 28 日以内の支払いです。遅れの原因はほとんどが情報の不足、氏名の不一致、基金からの追加書類の要求です。支払いは基金または ATO からご本人の口座へ直接行われ、当社がお金を預かることはありません。</p>
<p>金額の目安は<a href="/ja-calculator">いくら戻るか</a>、制度そのものは<a href="/ja">スーパーアニュエーションとは</a>をご覧ください。</p>""",
    faq=[("スーパーアニュエーションの返金にはどんな書類が必要ですか。", "オーストラリア入国時に使用したパスポート、SWIFT/BIC を含む受取口座の情報、そしておおよその出国日です。タックスファイルナンバーと基金名はあると早くなりますが、必須ではありません。"),
         ("自分でスーパーアニュエーションの返金申請はできますか。", "できます。オーストラリア税務局が無料のオンライン申請システムを提供しています。基金が一つで書類が揃っていれば、ご自身での申請が合理的です。代理人に依頼される方は、基金が分からない、既に ATO へ移管されている、自分で申請して却下された、といったケースがほとんどです。"),
         ("返金までどのくらいかかりますか。", "書類の揃った申請について、オーストラリア税務局の基準は 28 日以内の支払いです。遅れの原因は情報の不足、氏名の不一致、基金からの追加書類の要求がほとんどです。"),
         ("残高が 5,000 ドルを超えると手続きは複雑になりますか。", "一部の基金は残高が大きい場合に公証済みの本人確認書類を求めます。登録税務代理人経由であれば電子的な本人確認で処理でき、公証人の手配は不要です。")]))

PAGES.append(dict(
    slug="ja-calculator", lang="ja", en="/dasp-calculator",
    head_term="いくら戻るか（返金額の目安）",
    title="スーパーアニュエーションはいくら戻る？早見表 | DASPA",
    desc="ビザと残高から、実際に口座へ振り込まれる金額の目安がわかります。税率の一覧、残高別の手取り早見表、残高が不明なときの概算方法。",
    h1="いくら戻る？<em>税引き後の数字から。</em>",
    sub="残高がそのまま振り込まれるわけではありません。税率はビザで決まります。以下は税と定額費用を引いたあと、実際に手元に残る金額です。",
    body="""<div class="answer-first">
  <p><b>受け取る金額は、残高から法定の DASP 税を引き、さらに一度きりの手数料を引いた額です。</b>ワーキングホリデー（417 · 462）は 65%、その他の多くの一時滞在ビザは課税対象分に 35%、既に ATO へ移管された分はビザを問わず 65% です。税率は法律で定められており、どの代理人でも変えられません。結果を変えられる唯一の要素は<b>申請する時期</b>です。</p>
</div>

<h2>税率の一覧</h2>
__RATE_TABLE__

<h2>手取りの早見表</h2>
<p>DASP 税と $149 + GST の定額費用を差し引いた、実際に振り込まれる金額です。ご自身の残高に近い行をご覧ください。</p>
__PAYOUT_TABLE__
<p style="font-size:13px;color:var(--muted)">金額はオーストラリアドル建て、1 ドル単位に四捨五入しています。残高の全額が課税対象分である一般的なケースを想定しています。まれな非課税対象分には 45% が適用されます。実際の入金額はご利用の銀行の為替レートによって変わります。</p>

<h2>残高が分からないときの概算</h2>
<p>雇用主は給与とは別に、法律で定められた割合（現在 12%）を積み立てます。オーストラリアでの税引き前の総収入にこの割合を掛ければ、使える目安が出ます。たとえば総収入が 3 万ドルなら、積立額はおよそ 3,600 ドル。これは税引き前の数字です。</p>
<p>働いていた時期が早い場合、割合は下がります。2021 年 7 月より前は 9.5%、2023 年から 2025 年はおよそ 11% から 11.5% でした。</p>

<h2>6 か月が効いてくる理由</h2>
<p>出国から 6 か月を過ぎると残高は ATO へ移管され、税率は一律 65% になります。ワーキングホリデーの方は前後どちらも 65% で変わりませんが、482 や 500 のビザだった方は、残高 2 万ドルの場合でおよそ 6,000 ドルの差になります。</p>
<p>対話式の計算ツールは現在英語版のみです：<a href="/dasp-calculator">DASP tax calculator</a>。手続きは<a href="/ja-refund">返金のやり方</a>をご覧ください。</p>""",
    faq=[("スーパーアニュエーションはいくら戻りますか。", "残高から法定の DASP 税を差し引いた金額です。ワーキングホリデー 417 と 462 は 65%、その他の多くの一時滞在ビザは課税対象分に 35%、既に ATO へ移管された分はビザを問わず 65% です。"),
         ("自分の残高が分からない場合はどうすればよいですか。", "オーストラリアでの税引き前の総収入に法定積立率（現在 12%）を掛けると目安が出ます。実際の残高はパスポート情報から調査します。追加料金はかかりません。"),
         ("税率を下げることはできますか。", "できません。DASP の税率は法律で定められ、基金または税務局が源泉徴収します。結果を変えられるのは申請の時期だけで、6 か月を過ぎると ATO へ移管され一律 65% になります。")]))

PAGES.append(dict(
    slug="ja-faq", lang="ja", en="/faq",
    head_term="ロングテール（公証、帰国後、自分で）",
    title="スーパーアニュエーションのよくある質問 | DASPA",
    desc="公証は必要か、帰国して何年も経っていても請求できるか、税は取り戻せるか、日本で課税されるのか。日本人からよく届く質問への回答です。",
    h1="よくある<em>質問。</em>",
    sub="日本の方から実際に届く質問をまとめました。曖昧にせず、はっきりお答えするべきだと考えている点も含めています。",
    body="""<div class="answer-first">
  <p><b>よく届く三つの質問への短い答え。公証は不要です（登録税務代理人経由なら電子的に本人確認します）。申請期限はありません（ただし 6 か月を過ぎると税率が不利になります）。そして DASP の税金は確定申告で取り戻すことはできません。</b>詳しくは以下をご覧ください。</p>
</div>

<h2>条件と時期</h2>
<details class="faq"><summary>オーストラリアに戻る必要はありますか。</summary><div class="a"><p>ありません。むしろ出国済みであることが条件です。手続きはすべて国外から完了するように設計されています。</p></div></details>
<details class="faq"><summary>まだオーストラリアにいますが、先に申請できますか。</summary><div class="a"><p>できません。ビザが失効または取り消されており、かつ出国していることが条件です。帰国を決めていて有効期間が残っている場合は、内務省にビザの取り消しを申請すれば条件を満たせます。</p></div></details>
<details class="faq"><summary>帰国して何年も経ちますが、間に合いますか。</summary><div class="a"><p>DASP に申請期限はありません。お金はあなたのものです。違いは 6 か月を過ぎると ATO へ移管され、65% の税率が適用される点です。年数が経過した案件も数多く扱っています。</p></div></details>
<details class="faq"><summary>その後べつのオーストラリアのビザを取得しました。影響はありますか。</summary><div class="a"><p>税率は積み立てられた当時のビザに従い、最後に保有したビザではありません。ワーキングホリデー期間中に積み立てられた分は、その後に技術ビザへ移行していてもワーキングホリデーの税率が適用されます。</p></div></details>

<h2>書類と本人確認</h2>
<details class="faq"><summary>公証は必要ですか。</summary><div class="a"><p>当社経由では不要です。パスポートと自撮りによる電子的な本人確認で完了し、公証人も領事館も必要ありません。基金へ直接申請する場合、残高が大きいと公証済み書類を求められることがあります。</p></div></details>
<details class="faq"><summary>残高が 5,000 ドルを超えると面倒になりますか。</summary><div class="a"><p>よくある境目で、一部の基金はこれを超えるとより厳格な本人確認を求めます。登録税務代理人経由なら電子的な確認で処理でき、流れは変わりません。</p></div></details>
<details class="faq"><summary>ローマ字表記が書類によって違います。</summary><div class="a"><p>却下理由の第一位ですが、事前に対処できます。パスポート、基金口座、銀行口座の三つが揃っていれば問題ありません。揃っていない部分は当社で整理します。</p></div></details>
<details class="faq"><summary>どの基金か分かりません。</summary><div class="a"><p>最も多いご相談です。パスポート情報から、ご本人名義のすべての年金口座と ATO 保管分を調査します。追加料金はかかりません。</p></div></details>

<h2>費用と税金</h2>
<details class="faq"><summary>代行を頼む価値はありますか。</summary><div class="a"><p>場合によります。いつでも「ある」とは申し上げません。基金が一つで書類が揃い、残高もそれほど多くなければ、オーストラリア税務局の無料システムで十分です。ご依頼が多いのは、基金が分からない、既に ATO へ移管されている、自分で申請して却下された、というケースです。</p></div></details>
<details class="faq"><summary>費用はいくらですか。</summary><div class="a"><p>$149 + GST（合計 163.90 オーストラリアドル）の定額です。残高がいくらでも、基金がいくつあっても同じで、残高に対する歩合ではありません。返金できる年金が見つからなかった場合は全額返金します。</p></div></details>
<details class="faq"><summary>この税金は取り戻せますか。</summary><div class="a"><p>DASP の税金は最終源泉徴収税で、オーストラリアの確定申告で取り戻すことはできません。ただし給与から源泉徴収された所得税（PAYG）は別で、還付の対象になる場合があります。</p></div></details>
<details class="faq"><summary>日本で課税されますか。</summary><div class="a"><p>このお金はオーストラリアで法律に基づき課税済みです。日本側の取り扱いは日本の税務の問題であり、当社はその資格を持たないため見解を述べません。日本の税理士にご相談ください。</p></div></details>

<h2>受け取り</h2>
<details class="faq"><summary>日本の口座で受け取れますか。</summary><div class="a"><p>受け取れます。基金または ATO が SWIFT/BIC を使って国際送金します。オーストラリアドルで送金され、ご利用の銀行が円に換算します。</p></div></details>
<details class="faq"><summary>オーストラリアの銀行口座は解約しました。</summary><div class="a"><p>問題ありません。現在お使いの日本の口座へお振り込みします。口座名義がパスポートのお名前と一致していることが条件です。</p></div></details>
<details class="faq"><summary>申請フォームは日本語ですか。</summary><div class="a"><p>フォームとご案内のメールは英語です。内容はパスポートと銀行口座の情報が中心で、複雑ではありません。お困りの場合は WhatsApp からご連絡ください。</p></div></details>""",
    faq=[("スーパーアニュエーションの返金に公証は必要ですか。", "登録税務代理人経由では不要です。パスポートと自撮りによる電子的な本人確認で完了します。基金へ直接申請する場合、残高が大きいと公証済みの書類を求められることがあります。"),
         ("帰国して何年も経っていますが請求できますか。", "できます。DASP に申請期限はありません。ただし出国から 6 か月を過ぎると残高は ATO へ移管され、ビザを問わず 65% の税率が適用されます。"),
         ("DASP の税金は取り戻せますか。", "取り戻せません。DASP の税金は最終源泉徴収税で、オーストラリアの確定申告の対象外です。ただし給与から源泉徴収された所得税（PAYG）は別で、還付の対象になる場合があります。"),
         ("日本で課税されますか。", "このお金はオーストラリアで法律に基づき課税済みです。日本側の取り扱いは日本の税務の問題であり、当社は資格を持たないため見解を述べません。日本の税理士にご相談ください。")]))

# ===========================================================================
# KOREAN, one page only.
# Korean-language demand is about 10 searches a month; Koreans search the English
# term "dasp" (700/mo), which the English site already serves. So this page exists
# to convert and to reassure, not to rank, and it is not built out further.
# Translation risk is only worth buying where there is demand to buy it with.
# ===========================================================================
PAGES.append(dict(
    slug="ko", lang="ko", en="/",
    head_term="(none: Korean-language demand is ~10/mo, English 'dasp' is 700/mo)",
    title="호주 퇴직연금(슈퍼) 환급 DASP 신청 | DASPA",
    desc="호주를 떠난 뒤 남겨둔 퇴직연금을 돌려받는 방법. 세율, 6개월 기한, 신청 절차, 정액 수수료를 한국어로 정리했습니다.",
    h1="호주를 떠나셨나요? <em>남겨둔 퇴직연금을 돌려받으세요.</em>",
    sub="워킹홀리데이, 학생, 취업 비자로 호주에서 일했다면 퇴직연금이 그대로 남아 있습니다. 호주 등록 세무사가 대신 찾아 신청합니다.",
    body="""<div class="answer-first">
  <p><b>호주에서 임시 비자로 일한 뒤 출국했다면, 남아 있는 퇴직연금을 DASP(Departing Australia Superannuation Payment)로 전액 신청할 수 있습니다.</b> 비자가 만료되었거나 취소되었고 호주를 떠난 상태여야 합니다. 세금은 비자 종류에 따라 법으로 정해져 있으며, 워킹홀리데이(417 · 462)는 65%, 그 외 대부분의 임시 비자는 과세분에 대해 35%입니다. 신청이 완료되면 보통 28일 이내에 본인 명의의 한국 계좌로 입금됩니다.</p>
</div>

<h2>퇴직연금(슈퍼)이란</h2>
<p>호주에서 일하면 고용주는 시급이나 연봉과 <b>별도로</b> 일정 비율(현재 12%)을 퇴직연금 계좌에 넣어야 합니다. 급여에서 공제되는 돈이 아니고 통장에도 들어오지 않기 때문에, 워킹홀리데이로 다녀온 분들은 귀국할 때까지 존재 자체를 모르는 경우가 많습니다.</p>
<p>호주인에게 수령 조건은 은퇴이지만, 임시 비자로 일한 사람에게는 <b>출국</b>이 조건입니다. 그 절차가 DASP입니다.</p>

<h2>내 퇴직연금이 남아 있는지</h2>
<ul class="checklist">
  <li><b>여러 곳에서 일했다면.</b> 고용주마다 <em>다른</em> 펀드에 넣었을 수 있습니다. 농장, 식당, 호텔에서 일했다면 계좌가 세 개일 수도 있습니다.</li>
  <li><b>안내문을 받은 적이 없다면.</b> 펀드는 당시 호주 주소로 우편을 보냅니다. 이미 떠난 주소입니다. 못 받았다는 것이 없다는 뜻은 아닙니다.</li>
  <li><b>이미 이관되었다면.</b> 출국 후 6개월이 지나면 펀드는 잔액을 국세청(ATO)에 넘깁니다. 돈은 그대로 본인 것이지만 세율이 불리해집니다.</li>
</ul>
<p>어느 펀드인지 모르셔도 괜찮습니다. 여권 정보로 본인 명의의 모든 계좌를 찾는 것이 이 서비스의 핵심이며, 추가 비용은 없습니다.</p>

<h2>세율은 비자로 정해집니다</h2>
<p>국적이나 현재 거주지가 아니라, 호주에서 근무할 당시 보유했던 비자가 세율을 결정합니다. 이 세율은 호주 법률로 정해져 있으며 어떤 세무사도 낮출 수 없습니다.</p>
__RATE_TABLE__
<p>모든 금액은 호주달러 기준이며, 실제 입금액은 은행 환율에 따라 달라집니다.</p>

<h2>세후 실수령액</h2>
<p>DASP 세금과 $149 + GST 정액 수수료를 모두 뺀, 실제로 계좌에 들어오는 금액입니다.</p>
__PAYOUT_TABLE__

<h2>6개월이 지나면 손해가 커집니다</h2>
<p>비자가 만료되고 출국한 지 6개월이 지나면, 펀드는 잔액을 국세청(ATO)에 미청구 자금으로 넘겨야 합니다. ATO가 보관 중인 퇴직연금은 <b>비자와 관계없이 65%</b>가 과세됩니다. 482나 500 비자였다면 35%에서 65%로 올라갑니다. 신청 시점은 본인이 통제할 수 있는 거의 유일한 변수입니다.</p>

<h2>진행 방식</h2>
<ul class="checklist">
  <li><b>1. 신청서 작성.</b> 영문 온라인 양식으로 약 5분. 어느 펀드인지 모르셔도 제출할 수 있습니다.</li>
  <li><b>2. 신원 확인.</b> 여권과 셀피로 진행합니다. 공증이나 영사관 방문은 필요 없습니다.</li>
  <li><b>3. 등록 세무사가 신청.</b> 모든 펀드와 ATO 보유분을 확인한 뒤 신청하고 입금까지 관리합니다.</li>
  <li><b>4. 본인 계좌로 입금.</b> 펀드 또는 ATO에서 고객님 계좌로 직접 송금됩니다. 저희가 자금을 보관하지 않습니다.</li>
</ul>

<h2>비용</h2>
<p>수수료는 <b>$149 + GST (총 호주달러 $163.90)</b> 정액입니다. 잔액이 얼마이든, 펀드가 몇 개이든 동일하며 잔액의 일정 비율을 가져가는 방식이 아닙니다. 회수된 퇴직연금이 없으면 전액 환불됩니다.</p>
<p>분명히 말씀드리면, 호주 국세청은 무료 DASP 온라인 신청 시스템을 운영합니다. 상황이 단순하다면 직접 신청하셔도 충분합니다. 저희를 찾으시는 분들은 대개 펀드를 모르거나, 이미 ATO로 넘어갔거나, 직접 신청했다가 거절당한 경우입니다.</p>

<h2>자주 묻는 질문</h2>
<details class="faq"><summary>호주에 다시 가야 하나요?</summary><div class="a"><p>아니요. 오히려 호주를 떠난 상태여야 신청이 가능합니다. 모든 절차는 해외에서 진행하도록 만들어져 있습니다.</p></div></details>
<details class="faq"><summary>아직 호주에 있는데 미리 신청할 수 있나요?</summary><div class="a"><p>불가능합니다. DASP는 비자가 만료되었거나 취소되었고, 출국한 상태여야 합니다. 돌아가지 않기로 하셨는데 비자 기간이 남아 있다면 내무부에 비자 취소를 요청해 바로 자격을 갖출 수 있습니다.</p></div></details>
<details class="faq"><summary>공증이 필요한가요?</summary><div class="a"><p>저희를 통하면 필요 없습니다. 여권과 셀피로 전자 신원확인을 진행합니다. 펀드에 직접 신청하는 경우 잔액이 크면 공증 서류를 요구하기도 합니다.</p></div></details>
<details class="faq"><summary>호주 계좌를 이미 해지했습니다.</summary><div class="a"><p>문제되지 않습니다. 현재 사용 중인 한국 계좌로 송금받으실 수 있습니다. 계좌 명의가 여권상 이름과 일치하면 됩니다.</p></div></details>
<details class="faq"><summary>출국한 지 몇 년이 지났습니다. 늦었나요?</summary><div class="a"><p>DASP 신청에는 기한이 없습니다. 다만 6개월이 지난 자금은 ATO로 이관되어 65% 세율이 적용됩니다. 오래된 건도 많이 처리합니다.</p></div></details>
<details class="faq"><summary>세금을 돌려받을 수 있나요?</summary><div class="a"><p>DASP 세금은 최종 원천징수세로, 호주 세금 신고를 통해 환급받을 수 없습니다. 다만 급여에서 원천징수된 소득세(PAYG)는 별개이며, 환급 대상일 수 있습니다.</p></div></details>
<details class="faq"><summary>신청서가 한국어인가요?</summary><div class="a"><p>양식과 이메일 안내는 영어로 제공됩니다. 항목은 여권 정보와 계좌 정보 위주로 간단합니다. 막히는 부분이 있으면 WhatsApp으로 문의해 주세요.</p></div></details>""",
    faq=[("호주 퇴직연금이란 무엇인가요?", "호주에서 일하면 고용주가 급여와 별도로 일정 비율(현재 12%)을 넣어주는 퇴직연금입니다. 계좌 잔액은 본인 것이며, 임시 비자로 일한 사람의 수령 조건은 호주를 떠나는 것입니다."),
         ("호주에 다시 가야 하나요?", "아니요. 오히려 호주를 떠난 상태여야 신청이 가능합니다. 모든 절차는 해외에서 진행하도록 만들어져 있습니다."),
         ("공증이 필요한가요?", "등록 세무사를 통하면 필요 없습니다. 여권과 셀피로 전자 신원확인을 진행합니다. 펀드에 직접 신청하는 경우 잔액이 크면 공증 서류를 요구하기도 합니다."),
         ("출국한 지 몇 년이 지났습니다. 늦었나요?", "DASP 신청에는 기한이 없습니다. 다만 6개월이 지난 자금은 ATO로 이관되어 비자와 관계없이 65% 세율이 적용됩니다.")]))


# ===========================================================================
# Render
# ===========================================================================
def jstr(s):
    return '"%s"' % s.replace("\\", "\\\\").replace('"', '\\"')


PAYOUT_HEAD = {
    "zh-tw": ("退休金餘額", "打工度假 417 · 462", "其他臨時簽證 482 · 500"),
    "ja": ("残高", "ワーキングホリデー 417 · 462", "その他の一時滞在ビザ 482 · 500"),
    "ko": ("퇴직연금 잔액", "워킹홀리데이 417 · 462", "그 외 임시 비자 482 · 500"),
}

BY_LANG = {}
for p in PAGES:
    BY_LANG.setdefault(p["lang"], []).append(p)


# What job a page does, independent of its slug. Pages sharing a role are genuine
# translations of each other and belong in one hreflang cluster; pages that do not
# share one must NOT be linked, because a cluster claiming an equivalence it does
# not have is worse than no cluster. /zh-tw-apply and /ja-refund are the same job
# under different head terms, so they pair. Neither has a Korean counterpart, so
# neither gets a Korean alternate.
ROLE = {
    "zh-tw": "landing", "ja": "landing", "ko": "landing",
    "zh-tw-apply": "apply", "ja-refund": "apply",
    "zh-tw-calculator": "calculator", "ja-calculator": "calculator",
    "zh-tw-faq": "faq", "ja-faq": "faq",
}


def hreflang_for(page):
    out = ['<link rel="alternate" hreflang="en" href="https://daspa.com.au%s">' % page["en"]]
    role = ROLE[page["slug"]]
    for lang, meta in LANG_META.items():
        sibling = next((q for q in BY_LANG.get(lang, []) if ROLE[q["slug"]] == role), None)
        if sibling:
            out.append('<link rel="alternate" hreflang="%s" href="https://daspa.com.au/%s">'
                       % (meta["lang"], sibling["slug"]))
    out.append('<link rel="alternate" hreflang="x-default" href="https://daspa.com.au%s">' % page["en"])
    return chr(10).join(out)


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
    {nav}
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
<p class="note lang-governs">{governs}</p>
  </div>
</main>
{footer}
{tail}
</body>
</html>
"""

for p in PAGES:
    lang = p["lang"]
    meta = LANG_META[lang]
    nav_items = NAV[lang]
    nav = ""
    if len(nav_items) > 1:
        nav = '<div class="lang-nav">' + " ".join(
            ('<span class="here">%s</span>' % label) if href.lstrip("/") == p["slug"]
            else ('<a href="%s">%s</a>' % (href, label))
            for href, label in nav_items) + "</div>"

    body = (p["body"]
            .replace("__RATE_TABLE__", rate_table(lang))
            .replace("__PAYOUT_TABLE__", payout_table(PAYOUT_HEAD[lang])))
    faq = ",\n".join(
        '  {\n   "@type": "Question",\n   "name": %s,\n   "acceptedAnswer": { "@type": "Answer", "text": %s }\n  }'
        % (jstr(q), jstr(a)) for q, a in p["faq"])
    cta_h, cta_p, cta_btn = CTA[lang]

    html = TEMPLATE.format(
        slug=p["slug"], lang=meta["lang"], locale=meta["locale"], title=p["title"],
        desc=p["desc"], ogt=p["title"].replace(" | DASPA", ""),
        hreflang=hreflang_for(p), icon=ICON, preload=PRELOAD, faq=faq,
        header=HEADER, footer=FOOTER, tail=TAIL, crumb=meta["crumb"], nav=nav,
        h1=p["h1"], sub=p["sub"], body=body, governs=GOVERNS[lang],
        cta_h=cta_h, cta_p=cta_p, cta_btn=cta_btn)

    assert "—" not in html, p["slug"]
    assert "__RATE_TABLE__" not in html and "__PAYOUT_TABLE__" not in html, p["slug"]
    with open(os.path.join(ROOT, p["slug"] + ".html"), "w", encoding="utf-8", newline="") as fh:
        fh.write(html)
    print("%-18s %-6s  %s" % (p["slug"] + ".html", meta["lang"], p["head_term"]))

# The English homepage points at each language's landing page.
LANDING = ['<link rel="alternate" hreflang="en" href="https://daspa.com.au/">']
for lang, meta in LANG_META.items():
    LANDING.append('<link rel="alternate" hreflang="%s" href="https://daspa.com.au/%s">'
                   % (meta["lang"], lang))
LANDING.append('<link rel="alternate" hreflang="x-default" href="https://daspa.com.au/">')

home = os.path.join(ROOT, "index.html")
with open(home, encoding="utf-8", newline="") as fh:
    t = fh.read()
t2 = re.sub(r'\n<link rel="alternate" hreflang="[^"]*" href="[^"]*">', "", t)
m = re.search(r'<link rel="canonical"[^>]*>', t2)
t2 = t2[:m.end()] + "\n" + "\n".join(LANDING) + t2[m.end():]
if t2 != t:
    with open(home, "w", encoding="utf-8", newline="") as fh:
        fh.write(t2)
    print("\nhomepage hreflang cluster refreshed")
print("\n%d language pages built, all noindex" % len(PAGES))
