# Add the crawlable payout matrix to /dasp-calculator.
#
# Kit standard: "because a client-rendered calculator is invisible to Google,
# every tool page also carries a crawlable pre-computed data table from the same
# maths". The three tools on this page render entirely through JS, so the numbers
# a searcher wants ("how much super will I get back from $12,000") existed only
# after a keystroke.
#
# The constants below are lifted from the page's own script block and asserted
# against the worked examples already published on the page, so the table cannot
# quietly drift from the calculator sitting above it.
import re, os

ROOT = r"C:\dev\daspa-site"
PAGE = os.path.join(ROOT, "dasp-calculator.html")

FEE = 163.90                      # matches FEE in the page script
WHM, OTHER, ATO_HELD = 0.65, 0.35, 0.65
BANDS = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 30000, 50000]
SG = [("0.115", "11.5%", "2023 to 2025"), ("0.12", "12%", "July 2025 onwards")]
WAGES = [5000, 10000, 20000, 30000, 45000, 60000]


def net(balance, rate):
    """Mirrors calc(): net = max(0, bal - bal*rate - fee)."""
    return max(0, balance - balance * rate - FEE)


def money(n):
    return "$" + format(int(round(n)), ",d")


# the page already publishes three worked examples; the table must agree with them
assert round(net(5600, WHM)) == 1796, round(net(5600, WHM))
assert round(net(20000, OTHER)) == 12836, round(net(20000, OTHER))
assert round(net(2400, OTHER)) == 1396, round(net(2400, OTHER))

rows = "\n".join(
    "<tr><td><b>%s</b></td><td>%s</td><td>%s</td><td>%s</td></tr>"
    % (money(b), money(net(b, WHM)), money(net(b, OTHER)), money(net(b, ATO_HELD)))
    for b in BANDS)

wage_rows = "\n".join(
    "<tr><td><b>%s</b></td><td>%s</td><td>%s</td></tr>"
    % (money(w), money(w * float(SG[0][0])), money(w * float(SG[1][0])))
    for w in WAGES)

SECTION = """
      <h2 id="matrix">What lands in your bank, at a glance</h2>
      <p>The same maths as the calculator above, worked out in advance. Every figure is what reaches your account <em>after</em> DASP tax and after our $149 + GST fee, so it is the number you would actually see. Find the row nearest your balance.</p>
      <div class="table-scroll">
      <table>
        <thead><tr><th>Your balance</th><th>Working holiday<br><small>417 or 462, 65%</small></th><th>Other temporary visa<br><small>482 or 500, 35%</small></th><th>Already at the ATO<br><small>any visa, 65%</small></th></tr></thead>
        <tbody>
__ROWS__
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;color:var(--muted)">Rates are legislated and withheld by your fund or the ATO. Figures assume the whole balance is a taxed element, which is the normal case; a rare untaxed element is withheld at 45%. Amounts are rounded to the nearest dollar.</p>

      <h3>No idea what your balance is? Work back from your wages</h3>
      <p>Super is paid on top of your wages at a rate set by law, so your gross Australian earnings give a usable estimate of what should be sitting in a fund somewhere. This is before DASP tax; put the result into the calculator above to see what you would keep.</p>
      <div class="table-scroll">
      <table>
        <thead><tr><th>Gross Australian wages</th><th>Super at 11.5%<br><small>2023 to 2025</small></th><th>Super at 12%<br><small>July 2025 onwards</small></th></tr></thead>
        <tbody>
__WAGEROWS__
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;color:var(--muted)">An estimate of what you were owed, not a statement of what was paid. If an employer underpaid your super it can often be chased through the ATO, which is worth raising with us before you claim.</p>
""".replace("__ROWS__", rows).replace("__WAGEROWS__", wage_rows)

with open(PAGE, encoding="utf-8", newline="") as fh:
    t = fh.read()

assert 'id="matrix"' not in t, "already inserted"
anchor = "      <h2>More detail for your visa</h2>"
assert anchor in t, "anchor not found"
t = t.replace(anchor, SECTION + "\n" + anchor, 1)

with open(PAGE, "w", encoding="utf-8", newline="") as fh:
    fh.write(t)

print("matrix inserted: %d balance rows, %d wage rows" % (len(BANDS), len(WAGES)))
for b in (5000, 20000):
    print("  %s -> whm %s | other %s | ato %s"
          % (money(b), money(net(b, WHM)), money(net(b, OTHER)), money(net(b, ATO_HELD))))
