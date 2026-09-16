/* Step 2 of the verification page.
 *
 * STATE COMES FROM THE SERVER, EVERY TIME, AND IS NEVER CACHED.
 * That is what makes a link emailed today still correct a week later. Nothing
 * in this file decides whether somebody is verified.
 *
 * c and o are READ from the query string, not stripped from it, so the link
 * survives a reload and a bookmark.
 *
 * Distinct states get distinct copy. A single "something went wrong" is what
 * sent a client round the same loop five times: `unusable` (the link is not
 * valid for a paid claim, or the feature is off) is a different thing from
 * `trouble` (our failure, and the thing they need to do is still outstanding),
 * and both are different from "Stripe is still thinking about it".
 *
 * Never injects a name or email as markup. textContent throughout.
 */
(function () {
  var step2 = document.getElementById('step2');
  if (!step2) return;

  var STRIPE_JS = 'https://js.stripe.com/v3/';
  var el = {
    step: document.getElementById('s2-step'),
    icon: document.getElementById('s2-icon'),
    title: document.getElementById('s2-title'),
    body: document.getElementById('s2-body'),
    heroTitle: document.getElementById('hero-title'),
    heroSub: document.getElementById('hero-sub'),
    meta: document.getElementById('vmeta'),
    order: document.getElementById('m-order'),
    email: document.getElementById('m-email'),
  };

  var q = new URLSearchParams(window.location.search);
  var C = q.get('c') || '';
  var O = q.get('o') || '';
  /* Arriving straight from Checkout. One-time, expires with the session, and
     traded for the durable pair on the first successful read below. */
  var S = q.get('s') || '';

  var ICON = {
    done: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4 10-11"/></svg>',
    todo: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 6v8"/><path d="M12 17.6v.2"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  function paint(o) {
    el.step.textContent = o.step;
    el.icon.className = 'vicon ' + o.kind;
    el.icon.innerHTML = ICON[o.kind];          // our own constant, not user data
    el.title.textContent = o.title;
    el.body.textContent = '';
    (o.paras || []).forEach(function (t) {
      var p = document.createElement('p');
      p.textContent = t;                       // never innerHTML for copy
      el.body.appendChild(p);
    });
    if (o.button) el.body.appendChild(o.button);
    (o.after || []).forEach(function (node) { el.body.appendChild(node); });
  }

  /* The only fallback we offer is a person. There is no self-service ID
     upload yet, so nothing here may link to one: sending a claimant to a page
     that cannot take their document is worse than telling them to email us.
     Pre-filling the subject with the order number saves the team a round trip
     asking which claim this is. */
  function mailLine(text, subject) {
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.href = 'mailto:claims@daspa.com.au?subject=' + encodeURIComponent(subject);
    a.textContent = text;
    p.appendChild(a);
    return p;
  }

  function subject(what) {
    return O ? what + ' - order ' + O : what;
  }

  function verifyButton(label) {
    var b = document.createElement('button');
    b.className = 'btn';
    b.type = 'button';
    b.textContent = label || 'Verify my identity';
    b.addEventListener('click', function () { start(b); });
    return b;
  }

  // ------------------------------------------------------------ the states
  function showVerified() {
    if (el.heroTitle) el.heroTitle.textContent = 'Thank you.';
    paint({
      step: 'Step 2: Done', kind: 'done',
      title: 'Thank you, your identity has been verified',
      paras: [
        'Your verification was processed by Stripe Identity, using your passport and biometric matching. Your claim is now linked to your identity and nothing further is needed from you.',
        'Our team can now review your claim and lodge it.',
      ],
    });
  }

  /* `resumed` is for somebody who opened the check and did not finish it. Same
     card, same button: the task is identical and a second layout would only
     add a state to keep true. One sentence in front so it does not read as if
     we had not noticed they had already tried. */
  function showTodo(resumed) {
    paint({
      step: 'Step 2: Not completed', kind: 'todo',
      title: 'Next, verify your identity so we can lodge your claim',
      paras: [
        resumed
          ? 'It looks like the check was started but not finished, so nothing came through to us. You can pick it up again below, and starting over is fine.'
          : 'We are required to confirm who you are before lodging on your behalf. It takes about two minutes.',
        resumed
          ? 'We are required to confirm who you are before lodging on your behalf. It takes about two minutes, and you will need your passport to photograph, plus a selfie so the photo can be matched.'
          : 'Have your passport with you. You will be asked to photograph it and to take a selfie so the photo can be matched.',
      ],
      button: verifyButton(),
      after: [
        para('Handled by Stripe Identity. Your document goes to Stripe, not to us, and we only ever see whether it succeeded.'),
        mailLine('Cannot get it to work, or your document is not accepted? Email claims@daspa.com.au with your order reference and we will assist you.',
          subject('Identity verification help')),
      ],
    });
  }

  function showManual() {
    paint({
      step: 'Step 2: Needs a manual check', kind: 'todo',
      title: 'We will verify your identity by hand',
      paras: [
        'The automated check cannot be used for documents issued by your country, so one of our team will do it manually instead. This is not a problem with your claim.',
        'We will email you with what we need and how to send it securely. There is nothing for you to do right now.',
      ],
      after: [mailLine('Rather get started? Email us.', subject('Manual identity verification'))],
    });
  }

  /* Only ever shown in the second between the Stripe redirect and the webhook.
     Says what is true, and does not ask them to do anything. */
  function showConfirming() {
    paint({
      step: 'Step 2', kind: 'todo',
      title: 'Confirming your payment\u2026',
      paras: [
        'Your payment went through. We are just recording it against your claim, which takes a moment.',
        'This page updates by itself. There is no need to pay again or refresh.',
      ],
    });
  }

  /* Only reached when Stripe says `processing`, so the claimant HAS submitted
     their document and the wait is real. It used to be shown for any 'pending'
     row, including sessions that were opened and abandoned, which told people
     to wait for a check that had never been submitted.

     No button. While Stripe is genuinely mid-check there is nothing useful to
     press, and a "Try again" next to "we are still checking" reads as though
     the first attempt failed. The way out is still offered, by email. */
  function showPending() {
    paint({
      step: 'Step 2: In progress', kind: 'todo',
      title: 'Your documents are being checked',
      paras: [
        'Your passport and selfie came through and Stripe is checking them now. This usually finishes in seconds, but can take longer.',
        'There is nothing further for you to do. This page updates by itself for the next minute or so, and we email you when the check finishes either way, so you are free to close it.',
      ],
      after: [
        mailLine('Been longer than you expected? Email claims@daspa.com.au with your order reference and we will assist you.',
          subject('Identity verification help')),
      ],
    });
  }

  function showReview() {
    paint({
      step: 'Step 2: Under review', kind: 'todo',
      title: 'Your identity check is being reviewed',
      paras: [
        'This is routine. A specialist takes a second look and we will email you the moment it clears. Nothing more is needed from you right now.',
      ],
    });
  }

  /* The link is not usable against a paid claim. Deliberately does NOT say
     which part is wrong, because the server does not tell us: missing,
     mismatched and unpaid all answer the same 404 so the endpoint cannot be
     used to discover whether an order exists. */
  function showUnusable() {
    if (el.heroTitle) el.heroTitle.textContent = 'We could not open this link.';
    if (el.heroSub) el.heroSub.textContent = 'It may be incomplete, or it may belong to a different claim.';
    paint({
      step: 'Step 2', kind: 'stop',
      title: 'This verification link cannot be opened',
      paras: [
        'Please use the most recent link we emailed you. If you copied it by hand, check nothing was cut off, and if you have come straight from the payment page, the link there is single-use and may have expired.',
        'If it still will not open, email claims@daspa.com.au with your name and we will sort it out.',
      ],
    });
  }

  /* Our failure, and the task is still outstanding. Kept apart from unusable
     because a 502 from a mismatched key once read exactly like the inert state,
     which is a bad way to find out a page is lying to a client. */
  function showTrouble() {
    paint({
      step: 'Step 2: Not completed', kind: 'todo',
      title: 'We could not start the check just now',
      paras: [
        'This is a problem on our side, not with your claim, and your verification is still outstanding.',
        'Please try again in a few minutes, or email claims@daspa.com.au and we will send you a fresh link.',
      ],
      button: verifyButton(),
      after: [mailLine('Or email claims@daspa.com.au with your order reference and we will assist you.',
        subject('Identity verification help'))],
    });
  }

  function para(t) { var p = document.createElement('p'); p.textContent = t; return p; }

  // ------------------------------------------------------------- the server
  function read() {
    var qs = (C && O)
      ? 'c=' + encodeURIComponent(C) + '&o=' + encodeURIComponent(O)
      : 's=' + encodeURIComponent(S);
    return fetch('/api/identity?' + qs, { cache: 'no-store' })
      .then(function (r) {
        if (r.status === 404) return { unusable: true };
        if (!r.ok) return { trouble: true };
        return r.json();
      })
      .catch(function () { return { trouble: true }; });
  }

  var pendingTries = 0;
  var checkingTries = 0;

  function render(s) {
    if (!s || s.trouble) return showTrouble();
    if (s.unusable) return showUnusable();
    if (s.enabled === false) return showUnusable();

    /* Paid at Stripe, not yet recorded here: the redirect beat the webhook.
       Rare, and it resolves itself in about a second, so the page waits rather
       than showing a failure to somebody who has just been charged. Bounded,
       because waiting forever is its own kind of broken. */
    if (s.pending_payment) {
      if (pendingTries++ < 6) {
        showConfirming();
        window.setTimeout(function () { read().then(render); }, 1500);
        return;
      }
      return showTrouble();
    }

    /* Trade the one-time session id for the durable pair and rewrite the
       address bar, so a reload, a bookmark or a back button still works after
       the session id has expired. replaceState, not pushState: the redirect
       from Stripe should not become a history entry the client can go back to
       and re-trigger. */
    if (s.c && s.o) {
      var changed = (C !== s.c || O !== s.o);
      C = s.c; O = s.o;
      if (changed && window.history && window.history.replaceState) {
        try {
          window.history.replaceState({}, '',
            window.location.pathname + '?c=' + encodeURIComponent(C) + '&o=' + encodeURIComponent(O));
        } catch (e) { /* a rewritten URL is a convenience, never the mechanism */ }
      }
    }

    if (s.first_name && el.heroTitle) el.heroTitle.textContent = 'Thank you, ' + s.first_name + '.';
    if (s.order_number && el.order && el.email) {
      el.order.textContent = s.order_number;
      el.email.textContent = s.email || '';
      el.meta.hidden = false;
    }

    if (s.verification_status === 'verified') return showVerified();
    if (s.verification_status === 'needs_review') return showReview();
    if (s.manual_only) return showManual();
    /* Stripe is genuinely mid-check. Poll for a short while so somebody who
       has just submitted sees it turn green without touching anything, then
       stop: the confirmation email is the real notification, and a page that
       polls all afternoon is a cost to them and to us for no added certainty. */
    if (s.verification_status === 'pending') {
      showPending();
      if (checkingTries++ < 12) {
        window.setTimeout(function () { read().then(render); }, 5000);
      }
      return;
    }
    /* Started and not finished. The server resolves this against Stripe, so
       the page never has to guess which kind of 'pending' it is looking at. */
    if (s.verification_status === 'incomplete') return showTodo(true);
    return showTodo();
  }

  // -------------------------------------------------------------- starting
  function loadStripe() {
    if (window.Stripe) return Promise.resolve(window.Stripe);
    return new Promise(function (resolve, reject) {
      var t = document.createElement('script');
      t.src = STRIPE_JS;
      t.onload = function () { resolve(window.Stripe); };
      t.onerror = function () { reject(new Error('stripe.js blocked')); };
      document.head.appendChild(t);
    });
  }

  function start(btn) {
    btn.disabled = true;
    btn.textContent = 'Opening secure verification…';

    fetch('/api/identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ c: C, o: O }),
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          d.httpStatus = r.status; return d;
        });
      })
      .then(function (d) {
        if (d.httpStatus === 409) return showVerified();
        if (d.httpStatus === 404) return showUnusable();
        if (d.httpStatus === 403 && d.error === 'manual verification required') return showManual();
        if (d.httpStatus !== 200 || (!d.clientSecret && !d.url)) return showTrouble();

        /* Modal first, full-page redirect as the fallback. DASPA's clients
           arrive from overseas on phones, often inside an in-app browser where
           an embedded modal can lose camera permission and a redirect still
           works. Anything that goes wrong, including a blocked script, ends up
           on the redirect rather than on an error. */
        if (!d.pk || !d.clientSecret) { window.location.href = d.url; return null; }
        return loadStripe()
          .then(function (Stripe) { return Stripe(d.pk).verifyIdentity(d.clientSecret); })
          .then(afterModal)
          .catch(function () {
            if (d.url) window.location.href = d.url;
            else showTrouble();
          });
      })
      .catch(showTrouble);
  }

  /* The modal closing proves nothing: Stripe resolves when it closes whether or
     not anything was submitted, and resolves with an error object rather than
     rejecting on cancel. So ask the server again and let Stripe's own status
     decide. */
  function afterModal() { return read().then(render); }

  read().then(render);
})();
