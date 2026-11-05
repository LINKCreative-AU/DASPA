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

# Overridable so this runs outside the Windows machine it was written on.
ROOT = os.environ.get("DASPA_ROOT", r"C:\dev\daspa-site")
PAGE = os.path.join(ROOT, "dasp-calculator.html")

FEE = 150.00                      # matches FEE in the page script
# Corrected 13 Oct 2026: ATO-held super carries NO separate rate. Per the ATO's
# DASP page and s 5 of the Superannuation (DASP Tax) Act 2007, 65% applies only
# where the payment includes working-holiday-period contributions; a never-WHM
# claimant stays at the ordinary rates even on ATO-held money. The matrix
# therefore has no "already at the ATO" column: the rate follows the visa.
WHM, OTHER = 0.65, 0.35
BANDS = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 30000, 50000]
SG = [("0.115", "11.5%", "2023 to 2025"), ("0.12", "12%", "July 2025 onwards")]
WAGES = [5000, 10000, 20000, 30000, 45000, 60000]


def net(balance, rate):
    """Mirrors calc(): net = max(0, bal - bal*rate - fee)."""
    return max(0, balance - balance * rate - FEE)


def money(n):
    return "$" + format(int(round(n)), ",d")


# the page already publishes three worked examples; the table must agree with them
assert round(net(5600, WHM)) == 1810, round(net(5600, WHM))
assert round(net(20000, OTHER)) == 12850, round(net(20000, OTHER))
assert round(net(2400, OTHER)) == 1410, round(net(2400, OTHER))

rows = "\n".join(
    "<tr><td><b>%s</b></td><td>%s</td><td>%s</td></tr>"
    % (money(b), money(net(b, WHM)), money(net(b, OTHER)))
    for b in BANDS)

wage_rows = "\n".join(
    "<tr><td><b>%s</b></td><td>%s</td><td>%s</td></tr>"
    % (money(w), money(w * float(SG[0][0])), money(w * float(SG[1][0])))
    for w in WAGES)

# Per visa: one plain sentence each, with its own anchor.
#
# Why: this page is the site's link asset. The AI answer on the `dasp` results
# ends by asking for the reader's visa and balance, which is exactly what the
# calculator takes, but a widget gives an AI nothing to quote. A sentence per
# visa at a stated balance does, and an anchor per visa gives an outreach link
# somewhere specific to land (/dasp-calculator#417).
#
# Computed from WHM, OTHER and FEE, the same constants the table uses, so the
# sentences cannot disagree with the table or with the calculator above them.
SAMPLE = 10000
VISAS = [
    ("417", "Working Holiday visa (subclass 417)", WHM, "/visa-417"),
    ("462", "Work and Holiday visa (subclass 462)", WHM, "/visa-462"),
    ("482", "Skilled visa (subclass 482)", OTHER, "/visa-482"),
    ("500", "Student visa (subclass 500)", OTHER, "/visa-500"),
]
assert round(SAMPLE * WHM) == 6500 and round(SAMPLE * OTHER) == 3500


def visa_line(code, name, rate, guide):
    tax = SAMPLE * rate
    paid = SAMPLE - tax
    if rate == WHM:
        basis = "DASP tax is %d%%" % round(rate * 100)
        caveat = ""
    else:
        # The ordinary rate only holds if none of the super in that fund came
        # from a working holiday visa; if any did, the fund applies 65% to all.
        basis = "DASP tax is %d%% on the taxed element" % round(rate * 100)
        caveat = ", provided none of your super in that fund came from a working holiday visa"
    return ('<p id="%s"><b>%s.</b> %s, so on a %s balance %s is withheld and %s is paid out%s. '
            'After our %s fee you would receive %s. <a href="%s">%s guide</a></p>'
            % (code, name, basis, money(SAMPLE), money(tax), money(paid), caveat,
               money(FEE), money(net(SAMPLE, rate)), guide, code))


by_visa = "\n".join("      " + visa_line(*v) for v in VISAS)

SECTION = """
      <h2 id="matrix">What lands in your bank, at a glance</h2>
      <p>The same maths as the calculator above, worked out in advance. Every figure is what reaches your account <em>after</em> DASP tax and after our $150.00 fee, so it is the number you would actually see. Find the row nearest your balance.</p>
      <div class="table-scroll">
      <table>
        <thead><tr><th>Your balance</th><th>Working holiday<br><small>417 or 462, 65%</small></th><th>Other temporary visa<br><small>482 or 500, 35%</small></th></tr></thead>
        <tbody>
__ROWS__
        </tbody>
      </table>
      </div>
      <p style="font-size:13px;color:var(--muted)">Rates are legislated and withheld by your fund or the ATO, and they are the same whether the super is still with your fund or already ATO-held: the rate follows the visa you held. Figures assume the whole balance is a taxed element, which is the normal case; a rare untaxed element is withheld at 45%. Amounts are rounded to the nearest dollar.</p>

      <h3 id="by-visa">What you keep, by visa</h3>
      <div class="by-visa">
__BYVISA__
      </div>
      <p style="font-size:13px;color:var(--muted)">One rule changes these numbers: if any of your super in a fund came from contributions made while you held a working holiday visa (417 or 462), that fund applies 65% to the whole payment, including super earned later on another visa. Source: <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/temporary-residents-and-superannuation/departing-australia-superannuation-payment-dasp" target="_blank" rel="noopener">ATO, DASP</a>, last updated 21 April 2026.</p>

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
""".replace("__ROWS__", rows).replace("__WAGEROWS__", wage_rows).replace("__BYVISA__", by_visa)

with open(PAGE, encoding="utf-8", newline="") as fh:
    t = fh.read()
# The section is built with \n but the page is CRLF. Inserting bare \n lines
# into it leaves mixed endings, which is what broke two byte-comparing guard
# tests on abnassist. Work in \n, write back in the file's own ending.
eol = "\r\n" if "\r\n" in t else "\n"
t = t.replace("\r\n", "\n")

anchor = "      <h2>More detail for your visa</h2>"
assert anchor in t, "anchor not found"
if 'id="matrix"' in t:
    # Replace the existing section in place (from its heading to the anchor).
    start = t.index('      <h2 id="matrix">')
    end = t.index(anchor)
    t = t[:start] + SECTION.lstrip("\n") + "\n" + t[end:]
else:
    t = t.replace(anchor, SECTION + "\n" + anchor, 1)

with open(PAGE, "w", encoding="utf-8", newline="") as fh:
    fh.write(t.replace("\n", eol))

print("matrix written: %d balance rows, %d wage rows" % (len(BANDS), len(WAGES)))
for b in (5000, 20000):
    print("  %s -> whm %s | other %s"
          % (money(b), money(net(b, WHM)), money(net(b, OTHER))))
