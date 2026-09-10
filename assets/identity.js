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

  function link(text, href) {
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.href = href; a.textContent = text;
    p.appendChild(a);
    return p;
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

  function showTodo() {
    paint({
      step: 'Step 2: Not completed', kind: 'todo',
      title: 'Next, verify your identity so we can lodge your claim',
      paras: [
        'We are required to confirm who you are before lodging on your behalf. It takes about two minutes.',
        'Have your passport with you. You will be asked to photograph it and to take a selfie so the photo can be matched.',
      ],
      button: verifyButton(),
      after: [
        para('Handled by Stripe Identity. Your document goes to Stripe, not to us, and we only ever see whether it succeeded.'),
        link('Cannot get it to work, or your document is not accepted? Send your ID to us instead.', '/upload-form'),
      ],
    });
  }

  function showManual() {
    paint({
      step: 'Step 2: Needs a manual check', kind: 'todo',
      title: 'We will verify your identity by hand',
      paras: [
        'The automated check cannot be used for documents issued by your country, so one of our team will do it manually instead. This is not a problem with your claim.',
        'Send your ID to us using the link below and we will take it from there.',
      ],
      after: [link('Send your ID to us', '/upload-form')],
    });
  }

  function showPending() {
    paint({
      step: 'Step 2: In progress', kind: 'todo',
      title: 'Stripe is still checking your documents',
      paras: [
        'Checks usually finish in seconds, but not always. This page will show it as done once they finish, so please check back shortly.',
      ],
      button: verifyButton('Try again'),
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
        'Please use the most recent link we emailed you. If you copied it by hand, check nothing was cut off.',
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
      button: verifyButton('Try again'),
      after: [link('Or send your ID to us instead.', '/upload-form')],
    });
  }

  function para(t) { var p = document.createElement('p'); p.textContent = t; return p; }

  // ------------------------------------------------------------- the server
  function read() {
    return fetch('/api/identity?c=' + encodeURIComponent(C) + '&o=' + encodeURIComponent(O),
      { cache: 'no-store' })
      .then(function (r) {
        if (r.status === 404) return { unusable: true };
        if (!r.ok) return { trouble: true };
        return r.json();
      })
      .catch(function () { return { trouble: true }; });
  }

  function render(s) {
    if (!s || s.trouble) return showTrouble();
    if (s.unusable) return showUnusable();
    if (s.enabled === false) return showUnusable();

    if (s.first_name && el.heroTitle) el.heroTitle.textContent = 'Thank you, ' + s.first_name + '.';
    if (s.order_number && el.order && el.email) {
      el.order.textContent = s.order_number;
      el.email.textContent = s.email || '';
      el.meta.hidden = false;
    }

    if (s.verification_status === 'verified') return showVerified();
    if (s.verification_status === 'needs_review') return showReview();
    if (s.manual_only) return showManual();
    if (s.verification_status === 'pending') return showPending();
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
