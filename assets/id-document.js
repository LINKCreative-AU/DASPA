/* The manual ID upload on /id-verification.

   PORTED FROM abnassist-site/assets/id-document.js on 5 November 2026. DASPA
   differences: the honeypot is company_website (see _lib/guard.js), there is no
   ABN field, the order number is prefilled from ?o= when the identity page links
   here, the contact route is claims@daspa.com.au rather than a phone line, and
   the server refuses an upload that matches no paid claim, so that refusal is
   shown as it comes rather than as a technical error.

   The page is the fallback for someone whose Stripe Identity check will not
   complete, so the one thing this script must never do is fail quietly. Every
   error path ends with a visible message and a way to reach us, and the form
   stays filled in so a retry is one click rather than a re-type.

   Three steps, because the file cannot go through our own API: a Vercel
   function body caps at 4.5 MB and a phone photo of a licence is routinely
   bigger than that. See api/id-document.js.

     1. POST /api/id-document {action:'start'}  -> a signed upload URL per file
     2. PUT  each file straight to Supabase Storage, with a progress bar
     3. POST /api/id-document {action:'finish'} -> the team is emailed

   XHR rather than fetch for step 2, and only for step 2: fetch cannot report
   upload progress, and a 20 MB upload on mobile data with no progress bar looks
   broken long before it has failed. */
(function () {
  'use strict';

  var MAX_FILES = 4;
  var MAX_BYTES = 25 * 1024 * 1024;
  var ALLOWED = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'pdf'];

  var form = document.getElementById('idu-form');
  if (!form) return;

  var drop = document.getElementById('idu-drop');
  var input = document.getElementById('idu-file');
  var list = document.getElementById('idu-list');
  var btn = document.getElementById('idu-submit');
  var status = document.getElementById('idu-status');
  var thanks = document.getElementById('idu-thanks');
  var fileErr = document.getElementById('idu-file-err');

  /* When the form was opened. lib/guard.js refuses a submission that arrives
     implausibly fast; measured here rather than sent as a timestamp so a wrong
     clock on the visitor's machine never locks them out. */
  var OPENED_AT = Date.now();

  /* The queue is held here rather than read back off the input, because a file
     input cannot be edited: choosing a second file replaces the first, and
     removing one from a FileList is not possible at all. Without this, "add the
     back of the licence" silently threw the front away. */
  var queue = [];

  var extOf = function (n) {
    var m = String(n || '').match(/\.([A-Za-z0-9]+)$/);
    return m ? m[1].toLowerCase() : '';
  };
  // KB under a megabyte: a 240KB scan reading "0.2MB" looks like a failed
  // attachment rather than a small one.
  var size = function (b) {
    return b < 1048576 ? Math.max(1, Math.round(b / 1024)) + 'KB' : (b / 1048576).toFixed(1) + 'MB';
  };

  /* The status box is DASPA's .stop panel: red for a problem, the softer .ok
     tint for progress, hidden when there is nothing to say. */
  function say(msg, bad) {
    status.textContent = msg || '';
    status.classList.toggle('hidden', !msg);
    status.classList.toggle('ok', !!msg && !bad);
  }

  function fileProblem(f) {
    if (ALLOWED.indexOf(extOf(f.name)) === -1) {
      return f.name + ' is not a JPG, PNG, HEIC, WEBP or PDF.';
    }
    if (f.size > MAX_BYTES) {
      return f.name + ' is ' + size(f.size) + '. Each file has to be under 25MB, so please '
        + 'take the photo again at a lower resolution or email it to claims@daspa.com.au.';
    }
    if (!f.size) return f.name + ' is empty.';
    return null;
  }

  function render() {
    list.innerHTML = '';
    queue.forEach(function (item, i) {
      var row = document.createElement('div');
      row.className = 'idu-file';

      var nm = document.createElement('span');
      nm.className = 'idu-name';
      nm.textContent = item.file.name;
      row.appendChild(nm);

      var sz = document.createElement('span');
      sz.className = 'idu-size';
      sz.textContent = size(item.file.size);
      row.appendChild(sz);

      if (item.done) {
        var ok = document.createElement('span');
        ok.className = 'idu-tick';
        ok.textContent = 'sent ✓';
        row.appendChild(ok);
      } else if (item.pct != null) {
        var bar = document.createElement('span');
        bar.className = 'idu-bar';
        var fill = document.createElement('i');
        fill.style.width = item.pct + '%';
        bar.appendChild(fill);
        row.appendChild(bar);
      } else {
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'idu-remove';
        rm.setAttribute('aria-label', 'Remove ' + item.file.name);
        rm.textContent = '×';
        rm.addEventListener('click', function () { queue.splice(i, 1); render(); });
        row.appendChild(rm);
      }

      list.appendChild(row);
    });
    document.getElementById('idu-count').textContent = queue.length
      ? queue.length + ' of ' + MAX_FILES + ' files attached'
      : '';
  }

  function add(files) {
    var problems = [];
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (queue.length >= MAX_FILES) {
        problems.push('Only ' + MAX_FILES + ' files can be sent at once. Email the rest to claims@daspa.com.au.');
        break;
      }
      var bad = fileProblem(f);
      if (bad) { problems.push(bad); continue; }
      // Same name and same size twice is a double-tap on the file picker, not a
      // second document.
      var dupe = queue.some(function (q) { return q.file.name === f.name && q.file.size === f.size; });
      if (!dupe) queue.push({ file: f, pct: null, done: false });
    }
    fileErr.textContent = problems.join(' ');
    fileErr.style.display = problems.length ? 'block' : 'none';
    render();
  }

  /* ---------- picking files ---------- */

  input.addEventListener('change', function () { add(input.files); input.value = ''; });

  // The whole zone is the button, keyboard included: a bare "click to upload"
  // label that only the mouse can reach is not usable on a page people already
  // arrive at frustrated.
  drop.addEventListener('click', function () { input.click(); });
  drop.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });

  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files);
  });

  /* ---------- one file to a signed URL ---------- */

  function put(url, item) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      // Storage keeps this as the object's content type. An empty string from a
      // HEIC on an older browser is left alone rather than guessed at.
      if (item.file.type) xhr.setRequestHeader('content-type', item.file.type);
      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          item.pct = Math.round((e.loaded / e.total) * 100);
          render();
        }
      };
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) { item.done = true; render(); resolve(); }
        else reject(new Error('upload ' + xhr.status));
      };
      xhr.onerror = function () { reject(new Error('upload failed')); };
      xhr.ontimeout = function () { reject(new Error('upload timed out')); };
      xhr.timeout = 15 * 60 * 1000;
      xhr.send(item.file);
    });
  }

  /* One retry each, then give up and say so. A dropped connection halfway
     through a 20 MB photo on mobile data is the common failure here, and it
     succeeds on the second attempt often enough to be worth trying. */
  async function putWithRetry(url, item) {
    try { await put(url, item); }
    catch (first) {
      console.warn('retrying upload of ' + item.file.name + ':', first.message);
      item.pct = null; render();
      await put(url, item);
    }
  }

  /* ---------- submit ---------- */

  /* An email address cannot contain spaces, so any whitespace in the field is
     something the client cannot see: a non-breaking space from autofill or a
     paste, a zero-width character from a copied signature. JS's \s covers the
     first and not the second. Both made a valid-looking address fail the check
     below in testing on 5 November 2026, so the field is cleaned before it is
     checked, and the cleaned value is what is sent. */
  function cleanEmail() {
    var em = form.querySelector('[name=email]');
    var v = em.value.replace(/[\s\u200B-\u200D\u2060\uFEFF]/g, '');
    if (v !== em.value) em.value = v;
    return v;
  }

  function fieldsValid() {
    cleanEmail();
    var ok = true;
    form.querySelectorAll('.field').forEach(function (w) {
      var inp = w.querySelector('input, textarea');
      var bad = inp.required && !inp.value.trim();
      w.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    var em = form.querySelector('[name=email]');
    if (em.value && !/^[^@]+@[^@]+\.[^@]+$/.test(em.value)) {
      em.closest('.field').classList.add('invalid');
      ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!fieldsValid()) { say('Check the fields marked above.', true); return; }
    if (!queue.length) {
      fileErr.textContent = 'Attach at least one photo or PDF of your passport.';
      fileErr.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    say('Preparing your upload…');

    try {
      var r = await fetch('/api/id-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          // Form guards, see api/_lib/guard.js.
          company_website: (form.company_website && form.company_website.value) || '',
          elapsed_ms: Date.now() - OPENED_AT,
          name: form.name.value.trim(),
          email: cleanEmail(),
          order: form.order.value.trim() || null,
          note: form.note.value.trim() || null,
          files: queue.map(function (q) { return { name: q.file.name, size: q.file.size }; }),
        }),
      });
      var data = await r.json().catch(function () { return {}; });
      /* No paid claim for that email or order number, or already verified. The
         server's sentence says what to do, so it is shown as it is rather than
         wrapped in "that did not go through". */
      if (r.status === 404 || r.status === 409) {
        var refusal = new Error(data.error || 'We could not match that to a paid claim.');
        refusal.plain = true;
        throw refusal;
      }
      if (!r.ok) throw new Error(data.error || ('start ' + r.status));

      for (var i = 0; i < queue.length; i++) {
        say('Uploading ' + (i + 1) + ' of ' + queue.length + '. Please keep this page open.');
        await putWithRetry(data.uploads[i].url, queue[i]);
      }

      say('Finishing up…');
      var f = await fetch('/api/id-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish', id: data.id }),
      });
      var fd = await f.json().catch(function () { return {}; });
      if (!f.ok) throw new Error(fd.error || ('finish ' + f.status));

      say('');
      document.getElementById('idu-thanks-email').textContent = form.email.value.trim();
      form.classList.add('hidden');
      thanks.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = 'Send my passport';
      queue.forEach(function (q) { if (!q.done) q.pct = null; });
      render();
      say(err.plain ? err.message
        : 'That did not go through: ' + err.message + '. Please try again, or email claims@daspa.com.au '
          + 'with your order number and we will sort it out.', true);
    }
  });

  /* The identity page links here with the order number, so the client does not
     have to go and find it. Only a DASP reference is accepted. */
  try {
    var o = new URLSearchParams(window.location.search).get('o');
    if (o && /^DASP\d{8}$/i.test(o) && !form.order.value) form.order.value = o.toUpperCase();
  } catch (e) { /* no URLSearchParams: the field just starts empty */ }

  render();
})();
