/* ==========================================================
   Launceston Lankan Lions Cricket Club - site scripts
   All data below is DUMMY content. Edit the arrays to update the site.
   ========================================================== */

(function () {
  'use strict';

  /* ---------- Data ---------- */

  // Times are Launceston local time (AEDT, UTC+11, during daylight saving).
  const fixtures = [
    { date: '2026-10-03T13:00:00+11:00', opponent: 'Invermay XI',       venue: 'Home',  ground: 'Home ground, Launceston', result: { outcome: 'win',  text: 'Won by 24 runs' } },
    { date: '2026-10-10T13:00:00+11:00', opponent: 'Tamar Titans',      venue: 'Away',  ground: 'Tamar Oval',              result: { outcome: 'loss', text: 'Lost by 3 wickets' } },
    { date: '2026-10-24T13:00:00+11:00', opponent: 'Northern Hawks',    venue: 'Home',  ground: 'Home ground, Launceston' },
    { date: '2026-10-31T13:00:00+11:00', opponent: 'Meander Strikers',  venue: 'Away',  ground: 'Meander Park' },
    { date: '2026-11-07T13:00:00+11:00', opponent: 'Westbury Warriors', venue: 'Home',  ground: 'Home ground, Launceston' },
    { date: '2026-11-14T13:00:00+11:00', opponent: 'Longford Lions XI', venue: 'Away',  ground: 'Longford Recreation Ground' },
    { date: '2026-11-21T13:00:00+11:00', opponent: 'Prospect Pirates',  venue: 'Home',  ground: 'Home ground, Launceston' }
  ];

  const squad = [
    { name: 'Kasun Perera',     role: 'Batter',       no: 7,  note: 'Captain' },
    { name: 'Dilshan Fernando', role: 'All-rounder',  no: 10, note: 'Vice-captain' },
    { name: 'Nuwan Silva',      role: 'Bowler',       no: 23, note: 'Opening bowler' },
    { name: 'Chamara Jayasinghe', role: 'Wicketkeeper', no: 1, note: 'Keeper and opener' },
    { name: 'Ravindu Wickrama', role: 'Batter',       no: 14, note: 'Middle order' },
    { name: 'Tharindu Bandara', role: 'Bowler',       no: 9,  note: 'Left-arm spinner' },
    { name: 'Sahan Gunawardena', role: 'All-rounder', no: 18, note: 'Seam and lower order' },
    { name: 'Isuru Rathnayake', role: 'Batter',       no: 5,  note: 'Top order' },
    { name: 'Lahiru Madushanka', role: 'Bowler',      no: 31, note: 'Fast bowler' },
    { name: 'Pasindu Herath',   role: 'Wicketkeeper', no: 22, note: 'Reserve keeper' },
    { name: 'Dinesh Karunaratne', role: 'All-rounder', no: 3, note: 'Off-spin and batting' },
    { name: 'Malith Abeysekera', role: 'Bowler',      no: 45, note: 'Medium pace' }
  ];

  /* ---------- Helpers ---------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = n => String(n).padStart(2, '0');

  const dateFmtDay   = d => d.toLocaleDateString('en-AU', { day: 'numeric', timeZone: 'Australia/Hobart' });
  const dateFmtMonth = d => d.toLocaleDateString('en-AU', { month: 'short', timeZone: 'Australia/Hobart' });
  const dateFmtFull  = d => d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Australia/Hobart' });
  const timeFmt      = d => d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', timeZone: 'Australia/Hobart' });

  /* ---------- Mobile nav ---------- */

  const navToggle = $('#navToggle');
  const siteNav = $('#siteNav');

  function closeNav() {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.addEventListener('click', e => { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* ---------- Fixtures ---------- */

  const fixtureList = $('#fixtureList');
  const tabs = $$('.tab');

  function fixtureItem(f) {
    const d = new Date(f.date);
    const li = document.createElement('li');
    li.className = 'fixture' + (f.venue === 'Away' ? ' is-away' : '');

    const badgeClass = f.result ? f.result.outcome : '';
    const badgeText = f.result ? f.result.text : f.venue;

    li.innerHTML =
      '<div class="fixture-date"><b>' + dateFmtDay(d) + '</b><span>' + dateFmtMonth(d) + '</span></div>' +
      '<div class="fixture-teams">LLCC v ' + f.opponent +
        '<span class="fixture-meta">' + dateFmtFull(d) + ', ' + timeFmt(d) + ' &middot; ' + f.ground + '</span></div>' +
      '<span class="badge ' + badgeClass + '">' + badgeText + '</span>';
    return li;
  }

  function renderFixtures(view) {
    const now = Date.now();
    const list = fixtures
      .filter(f => view === 'results' ? !!f.result : !f.result && new Date(f.date) > now)
      .sort((a, b) => view === 'results' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));

    fixtureList.innerHTML = '';
    if (!list.length) {
      const li = document.createElement('li');
      li.className = 'fixture';
      li.innerHTML = '<div></div><div class="fixture-teams">Nothing to show yet<span class="fixture-meta">Check back after the next match.</span></div>';
      fixtureList.appendChild(li);
      return;
    }
    list.forEach(f => fixtureList.appendChild(fixtureItem(f)));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      fixtureList.setAttribute('aria-labelledby', tab.id);
      renderFixtures(tab.dataset.view);
    });
  });

  renderFixtures('upcoming');

  /* ---------- Next match countdown ---------- */

  const nextDetail = $('#nextDetail');
  const cd = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };

  const next = fixtures
    .filter(f => !f.result && new Date(f.date) > Date.now())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  if (next) {
    const target = new Date(next.date);
    nextDetail.textContent = 'LLCC v ' + next.opponent + ', ' + dateFmtFull(target) + ' at ' + timeFmt(target);

    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / 864e5); diff -= days * 864e5;
      const hours = Math.floor(diff / 36e5); diff -= hours * 36e5;
      const mins = Math.floor(diff / 6e4);   diff -= mins * 6e4;
      const secs = Math.floor(diff / 1e3);
      cd.d.textContent = pad(days);
      cd.h.textContent = pad(hours);
      cd.m.textContent = pad(mins);
      cd.s.textContent = pad(secs);
    };
    tick();
    setInterval(tick, 1000);
  } else {
    nextDetail.textContent = 'Fixtures to be announced';
    $('#countdown').hidden = true;
  }

  /* ---------- Squad ---------- */

  const squadGrid = $('#squadGrid');
  const chips = $$('#squadFilters .chip');

  const initials = name => name.split(' ').map(p => p[0]).slice(0, 2).join('');

  function renderSquad(role) {
    squadGrid.innerHTML = '';
    squad
      .filter(p => role === 'all' || p.role === role)
      .forEach(p => {
        const li = document.createElement('li');
        li.className = 'player';
        li.innerHTML =
          '<div class="avatar" data-no="' + p.no + '" aria-hidden="true">' + initials(p.name) + '</div>' +
          '<h3>' + p.name + '</h3>' +
          '<p class="role">' + p.role + '</p>' +
          '<p>' + p.note + '</p>';
        squadGrid.appendChild(li);
      });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.toggle('is-active', c === chip));
      renderSquad(chip.dataset.role);
    });
  });

  renderSquad('all');

  /* ---------- Gallery lightbox ---------- */

  const lightbox = $('#lightbox');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxArt = $('#lightboxArt');

  $$('#galleryGrid .tile').forEach(tile => {
    tile.addEventListener('click', () => {
      lightboxCaption.textContent = tile.dataset.caption;
      lightboxArt.innerHTML = '<img src="images/logo.png" alt="">';
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  $('#lightboxClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Join form (demo validation) ---------- */

  const form = $('#joinForm');
  const status = $('#formStatus');

  function setError(id, message) {
    const input = $('#' + id);
    const err = $('#' + id + 'Error');
    err.textContent = message;
    input.closest('.field').classList.toggle('has-error', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    const nameOk = setError('name', name ? '' : 'Enter your full name.');
    const emailOk = setError('email',
      !email ? 'Enter your email address.' :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email, like name@example.com.' : '');

    if (!nameOk || !emailOk) {
      (nameOk ? form.email : form.name).focus();
      return;
    }

    /* DEMO ONLY: nothing is sent anywhere.
       To receive real sign-ups, post the form data to a service such as
       Formspree, Netlify Forms or your own endpoint:
       fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) }) */
    status.textContent = 'Thanks ' + name.split(' ')[0] + ', we have your details. A club member will contact you soon.';
    form.reset();
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

})();
