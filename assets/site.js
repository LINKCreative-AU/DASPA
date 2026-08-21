/* DASPA, shared front-end behaviour: WhatsApp links, refund estimator, eligibility quiz. */

/* ============================================================
   PLACEHOLDER, WhatsApp number, digits only with country code
   (e.g. "61400000000"). Replace before launch; every WhatsApp
   button on the site is built from this one constant.
   ============================================================ */
var WHATSAPP_NUMBER = 'WHATSAPP_NUMBER_PLACEHOLDER';
var WHATSAPP_MESSAGE = 'Hi, I have a question about claiming my super';

/* Fee shown across the site. Charged amount lives server-side in api/_lib/config.js. Keep the two in sync. $149 + GST = $163.90 (GST treatment may change for non-resident
   export sales, see the server config comment). */
var FEE_EX_GST = 149;
var FEE_INC_GST = 163.90;

var aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
var aud2 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 });

document.addEventListener('DOMContentLoaded', function () {
  wireWhatsApp();
  initEstimator();
  initQuiz();
});

function wireWhatsApp() {
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* ---------- refund estimator ----------
   DASP withholding rates (ATO, current at the last-updated date shown on the page):
   65% for working holiday makers (subclass 417/462, incl. associated bridging visas),
   35% on the taxed element for other temporary visas. Estimates only, the exact tax
   depends on the components of the payment as calculated by the fund. */
function initEstimator() {
  var card = document.getElementById('estimator');
  if (!card) return;

  var slider = card.querySelector('#est-balance');
  var amtIn = card.querySelector('#est-balance-in');
  var lineBal = card.querySelector('#est-line-balance');
  var lineTax = card.querySelector('#est-line-tax');
  var lineTaxLabel = card.querySelector('#est-tax-label');
  var lineFee = card.querySelector('#est-line-fee');
  var net = card.querySelector('#est-net');

  // DASP withholding by visa subclass: working holiday family (417/462) 65%,
  // other temporary visas (482 skilled, 500 student) 35% on the taxed element.
  var RATES = { '417': 0.65, '462': 0.65, '482': 0.35, '500': 0.35 };
  function rate() {
    return RATES[card.querySelector('input[name=est-visa]:checked').value] || 0.35;
  }

  var balance = Number(slider.value);

  function render() {
    var r = rate();
    var tax = balance * r;
    var netAmt = Math.max(0, balance - tax - FEE_INC_GST);
    lineBal.textContent = aud.format(balance);
    lineTaxLabel.textContent = 'DASP tax withheld (' + Math.round(r * 100) + '%)';
    lineTax.textContent = '−' + aud.format(tax);
    lineFee.textContent = '−' + aud2.format(FEE_INC_GST);
    net.textContent = aud.format(netAmt);
  }

  // Typed estimate is the primary input; the slider mirrors it (and vice versa).
  function setBalance(n, source) {
    balance = Math.max(0, Math.min(500000, n || 0));
    if (source !== 'slider') slider.value = Math.max(slider.min, Math.min(slider.max, balance));
    if (source !== 'input') amtIn.value = balance ? balance.toLocaleString('en-AU') : '';
    render();
  }

  amtIn.addEventListener('input', function () {
    setBalance(Number(amtIn.value.replace(/[^0-9]/g, '')), 'input');
  });
  amtIn.addEventListener('blur', function () { setBalance(balance); });
  slider.addEventListener('input', function () { setBalance(Number(slider.value), 'slider'); });
  card.querySelectorAll('input[name=est-visa]').forEach(function (i) { i.addEventListener('change', render); });
  setBalance(balance);
}

/* ---------- eligibility quiz ---------- */
function initQuiz() {
  var host = document.getElementById('quiz');
  if (!host) return;

  var steps = [
    {
      q: 'What kind of visa did you hold in Australia?',
      opts: [
        { label: 'Working holiday visa (417 or 462)', next: 1, tag: 'whm' },
        { label: 'Student, skilled or another temporary visa', next: 1, tag: 'other' },
        { label: 'I’m an Australian or NZ citizen, or a permanent resident', fail: {
          title: 'A DASP isn’t available on your visa history, but your super is still yours.',
          body: 'Departing Australia Superannuation Payments are only for former temporary visa holders. Citizens, permanent residents and most NZ citizens keep their super in the system until retirement, though NZ citizens moving home permanently can usually transfer it to a KiwiSaver scheme under the Trans-Tasman scheme. If that’s you, message us on WhatsApp and we’ll point you in the right direction (no charge).'
        } }
      ]
    },
    {
      q: 'Have you left Australia?',
      opts: [
        { label: 'Yes, I’ve departed', next: 2 },
        { label: 'Not yet, I’m still in Australia', fail: {
          title: 'Almost. A DASP can only be paid after you leave.',
          body: 'You can’t claim while you’re still in Australia, but you can get everything ready now: complete our form before you fly and we’ll lodge the moment you’ve departed and your visa has ended. That way your money follows you home instead of sitting here. Start the form now or come back once you’ve left. Either works.',
          cta: { href: '/claim', label: 'Get my claim ready' }
        } }
      ]
    },
    {
      q: 'Has your visa expired or been cancelled?',
      opts: [
        { label: 'Yes, it’s expired or cancelled', next: 3 },
        { label: 'No, it’s still active', fail: {
          title: 'Your visa needs to end before the ATO will pay a DASP.',
          body: 'If you’ve left Australia for good but your visa is still running, you can ask the Department of Home Affairs to cancel it. That makes you eligible straight away instead of waiting for the expiry date. We can walk you through the cancellation request as part of your claim. Message us on WhatsApp or start the form and note it in the visa section.',
          cta: { href: '/claim', label: 'Start my claim anyway' }
        } },
        { label: 'Not sure', next: 3, note: 'No problem, checking your visa status with Home Affairs is part of what we do on every claim.' }
      ]
    },
    {
      q: 'Did you work and earn super while you were here?',
      opts: [
        { label: 'Yes, I know my fund', pass: true },
        { label: 'I worked, but I don’t know where my super is', pass: true, note: 'That’s most of our clients. With your TFN we search every fund plus ATO-held money, so nothing gets left behind.' },
        { label: 'No, I never worked in Australia', fail: {
          title: 'No super means nothing to claim, sorry!',
          body: 'Super is only paid when you work for an employer in Australia (they must pay it on top of your wage if you earn over the threshold). If you never worked here, there’s no DASP to recover. If you think an employer should have paid super and didn’t, message us on WhatsApp. Unpaid super can sometimes be chased through the ATO.'
        } }
      ]
    }
  ];

  var at = 0;
  var history = [];

  function render() {
    var s = steps[at];
    var pct = Math.round((at / steps.length) * 100);
    var html = '<div class="qnum">Question ' + (at + 1) + ' of ' + steps.length + '</div>' +
      '<div class="bar"><i style="width:' + Math.max(pct, 8) + '%"></i></div>' +
      '<h3>' + s.q + '</h3><div class="q-opts">';
    s.opts.forEach(function (o, i) { html += '<button type="button" data-i="' + i + '">' + o.label + '</button>'; });
    html += '</div>';
    if (history.length) html += '<button type="button" class="q-back">← Back</button>';
    host.innerHTML = html;

    host.querySelectorAll('.q-opts button').forEach(function (b) {
      b.addEventListener('click', function () { pick(s.opts[Number(b.dataset.i)]); });
    });
    var back = host.querySelector('.q-back');
    if (back) back.addEventListener('click', function () { at = history.pop(); render(); });
  }

  function pick(o) {
    if (o.fail) return showFail(o.fail);
    if (o.pass) return showPass(o.note);
    history.push(at);
    at = o.next;
    render();
    if (o.note) {
      var n = document.createElement('div');
      n.className = 'note';
      n.textContent = o.note;
      host.querySelector('h3').before(n);
    }
  }

  function showFail(f) {
    var html = '<div class="result fail"><div class="qnum">Our honest answer</div><h3>' + f.title + '</h3><p>' + f.body + '</p>';
    if (f.cta) html += '<a class="btn" href="' + f.cta.href + '">' + f.cta.label + '</a> ';
    html += '<a class="btn ghost" href="#" data-wa>Ask us on WhatsApp</a>' +
      '<p style="margin-top:14px"><button type="button" class="q-back">← Start the check again</button></p></div>';
    host.innerHTML = html;
    wireWhatsApp();
    host.querySelector('.q-back').addEventListener('click', restart);
  }

  function showPass(note) {
    var html = '<div class="result ok"><div class="qnum">Good news</div>' +
      '<h3>You look eligible to claim your super back. 🎉</h3>' +
      (note ? '<p>' + note + '</p>' : '') +
      '<p>Complete the 5-minute form, verify your identity with your passport and a selfie, and our registered tax agents handle the rest. Flat fee ' + aud2.format(FEE_INC_GST) + ', no percentage taken from your super, paid to any bank account worldwide.</p>' +
      '<a class="btn" href="/claim">Start my claim</a> <a class="btn ghost" href="#" data-wa>Question first? WhatsApp us</a>' +
      '<p style="margin-top:14px"><button type="button" class="q-back">← Start the check again</button></p></div>';
    host.innerHTML = html;
    wireWhatsApp();
    host.querySelector('.q-back').addEventListener('click', restart);
  }

  function restart() { at = 0; history = []; render(); }

  render();
}
