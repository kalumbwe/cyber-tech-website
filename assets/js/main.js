/* =========================================================
   CYBER TECH — main.js
   Live clock · custom cursor · particle field · reveals · form
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* =====================================================
     1. LIVE CLOCK  (always shows Kitwe / Zambia time, CAT)
     ===================================================== */
  var clockTime = document.getElementById('clockTime');
  var clockMeridiem = document.getElementById('clockMeridiem');
  var clockDate = document.getElementById('clockDate');
  var statusEl = document.getElementById('officeStatus');
  var statusText = document.getElementById('officeStatusText');

  var ZONE = 'Africa/Lusaka';

  function zonedParts(date) {
    // Read the wall-clock time in Kitwe regardless of the visitor's own timezone.
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: ZONE,
      hour12: false,
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var out = {};
    fmt.formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    return out;
  }

  function tick() {
    var p;
    try {
      p = zonedParts(new Date());
    } catch (e) {
      // Fallback for very old browsers without full Intl timezone support
      var d = new Date();
      p = {
        hour: String(d.getHours()).padStart(2, '0'),
        minute: String(d.getMinutes()).padStart(2, '0'),
        second: String(d.getSeconds()).padStart(2, '0'),
        weekday: d.toDateString().slice(0, 3),
        day: String(d.getDate()),
        month: '',
        year: String(d.getFullYear())
      };
    }

    var h24 = parseInt(p.hour, 10);
    var h12 = h24 % 12 === 0 ? 12 : h24 % 12;

    if (clockTime) {
      clockTime.textContent =
        String(h12).padStart(2, '0') + ':' + p.minute + ':' + p.second;
    }
    if (clockMeridiem) clockMeridiem.textContent = h24 < 12 ? 'AM' : 'PM';
    if (clockDate) {
      clockDate.textContent = p.weekday + ', ' + p.day + ' ' + p.month + ' ' + p.year;
    }

    updateOfficeStatus(p, h24);
  }

  // Office hours: Mon–Fri 08:00–17:00, Sat 08:00–13:00, Sun closed
  function updateOfficeStatus(p, h24) {
    if (!statusEl || !statusText) return;

    var minutes = h24 * 60 + parseInt(p.minute, 10);
    var day = (p.weekday || '').toLowerCase();
    var open = false, msg = 'Closed — leave a message';

    if (day.indexOf('sun') === 0) {
      open = false;
      msg = 'Closed today — WhatsApp us';
    } else if (day.indexOf('sat') === 0) {
      open = minutes >= 480 && minutes < 780;              // 08:00–13:00
      msg = open ? "We're open now" : 'Closed — opens 08:00';
    } else {
      open = minutes >= 480 && minutes < 1020;             // 08:00–17:00
      msg = open ? "We're open now" : 'Closed — opens 08:00';
    }

    statusEl.classList.toggle('is-open', open);
    statusEl.classList.toggle('is-closed', !open);
    statusText.textContent = msg;
  }

  tick();
  setInterval(tick, 1000);

  /* =====================================================
     2. CUSTOM CURSOR  (spring-following ring + dot)
     ===================================================== */
  if (!isTouch && !reduceMotion) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('cursor-ready');
      if (dot) dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });

    (function loopCursor() {
      // Lerp gives the ring its smooth trailing motion
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loopCursor);
    })();

    document.addEventListener('mousedown', function () { ring && ring.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { ring && ring.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-ready'); });
    document.addEventListener('mouseenter', function () { document.body.classList.add('cursor-ready'); });

    var hoverables = 'a, button, summary, input, select, textarea, .card, .work, .plan, .filter, .step';
    document.querySelectorAll(hoverables).forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring && ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring && ring.classList.remove('is-hover'); });
    });
  }

  /* =====================================================
     3. MAGNETIC BUTTONS
     ===================================================== */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.28 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* =====================================================
     4. CARD SPOTLIGHT + SUBTLE 3D TILT
     ===================================================== */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.card, .work, .plan, .mock').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = ((e.clientX - r.left) / r.width) * 100;
        var py = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty('--px', px + '%');
        el.style.setProperty('--py', py + '%');

        if (el.classList.contains('tilt')) {
          var rotY = ((e.clientX - r.left) / r.width - 0.5) * 7;
          var rotX = (0.5 - (e.clientY - r.top) / r.height) * 7;
          el.style.transform =
            'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-6px)';
        }
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* =====================================================
     5. HERO SPOTLIGHT FOLLOWING THE CURSOR
     ===================================================== */
  var hero = document.querySelector('.hero');
  var spotlight = document.getElementById('heroSpotlight');
  if (hero && spotlight && !isTouch) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      spotlight.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      spotlight.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* =====================================================
     6. HERO PARTICLE NETWORK (canvas, reacts to cursor)
     ===================================================== */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var pointer = { x: -9999, y: -9999 };
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    function sizeCanvas() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      var target = Math.min(Math.round((W * H) / 15000), isTouch ? 40 : 95);
      particles = [];
      for (var i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.8 + 0.7
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Gentle repulsion away from the cursor
        var dx = p.x - pointer.x, dy = p.y - pointer.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 16000 && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var force = (126 - d) / 126 * 0.7;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }

        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,0.55)';
        ctx.fill();

        // Link nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var lx = p.x - q.x, ly = p.y - q.y;
          var ld2 = lx * lx + ly * ly;
          if (ld2 < 18000) {
            var alpha = (1 - ld2 / 18000) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(79,125,255,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Highlight links to the cursor itself
        if (d2 < 26000) {
          var a2 = (1 - d2 / 26000) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = 'rgba(34,211,238,' + a2.toFixed(3) + ')';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }

    hero.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener('mouseleave', function () { pointer.x = -9999; pointer.y = -9999; });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeCanvas, 180);
    });

    sizeCanvas();
    draw();
  }

  /* =====================================================
     7. TYPING HEADLINE
     ===================================================== */
  var typeTarget = document.getElementById('typeTarget');
  if (typeTarget) {
    var phrases = [
      'your school.',
      'your business.',
      'your college.',
      'your front office.',
      'your whole company.'
    ];
    var pi = 0, ci = 0, deleting = false;

    if (reduceMotion) {
      typeTarget.textContent = 'your school & your business.';
    } else {
      (function typeLoop() {
        var word = phrases[pi];
        ci = deleting ? ci - 1 : ci + 1;
        typeTarget.textContent = word.slice(0, ci);

        var delay = deleting ? 45 : 95;
        if (!deleting && ci === word.length) { delay = 1900; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 320; }

        setTimeout(typeLoop, delay);
      })();
    }
  }

  /* =====================================================
     8. SCROLL REVEALS + COUNTERS
     ===================================================== */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('is-in'); }, i * 70);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var end = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1600, start = performance.now();

        (function step(now) {
          var t = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        })(start);

        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* =====================================================
     9. HEADER, NAV, SCROLL PROGRESS, BACK TO TOP
     ===================================================== */
  var header = document.getElementById('header');
  var progress = document.getElementById('scrollProgress');
  var toTop = document.getElementById('toTop');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (header) header.classList.toggle('is-stuck', y > 40);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    // Highlight the section currently in view
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop - 140 <= y) current = sec.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* =====================================================
     10. PROJECT FILTERS
     ===================================================== */
  var filterBtns = document.querySelectorAll('.filter');
  var workItems = document.querySelectorAll('.work');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      workItems.forEach(function (item) {
        var show = f === 'all' || item.getAttribute('data-cat') === f;
        item.classList.toggle('is-hidden', !show);
        if (show) {
          item.classList.remove('is-in');
          // Re-trigger the entrance animation for the newly shown cards
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { item.classList.add('is-in'); });
          });
        }
      });
    });
  });

  /* =====================================================
     11. FAQ — one open at a time
     ===================================================== */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) { if (other !== item) other.open = false; });
      }
    });
  });

  /* =====================================================
     12. QUOTE FORM → WhatsApp / Email
     ===================================================== */
  var PHONE = '260975341516';
  var EMAIL = 'rainserick@gmail.com';

  var form = document.getElementById('quoteForm');
  var statusOut = document.getElementById('formStatus');

  function collect() {
    var fields = {
      name: document.getElementById('name'),
      org: document.getElementById('org'),
      phone: document.getElementById('phone'),
      service: document.getElementById('service'),
      message: document.getElementById('message')
    };

    var missing = [];
    ['name', 'phone', 'service'].forEach(function (k) {
      var el = fields[k];
      var ok = el && el.value.trim() !== '';
      el.parentElement.classList.toggle('has-error', !ok);
      if (!ok) missing.push(k);
    });

    if (missing.length) {
      if (statusOut) {
        statusOut.textContent = 'Please fill in your name, phone number and the service you need.';
        statusOut.classList.add('is-error');
      }
      fields[missing[0]].focus();
      return null;
    }

    if (statusOut) { statusOut.textContent = ''; statusOut.classList.remove('is-error'); }

    return {
      name: fields.name.value.trim(),
      org: fields.org.value.trim() || 'Not specified',
      phone: fields.phone.value.trim(),
      service: fields.service.value,
      message: fields.message.value.trim() || 'No extra details provided.'
    };
  }

  function buildBody(d) {
    return (
      'New enquiry for Cyber Tech\n\n' +
      'Name: ' + d.name + '\n' +
      'School / Company: ' + d.org + '\n' +
      'Phone: ' + d.phone + '\n' +
      'Service needed: ' + d.service + '\n\n' +
      'Details:\n' + d.message
    );
  }

  var waBtn = document.getElementById('sendWhatsApp');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      var d = collect();
      if (!d) return;
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(buildBody(d)), '_blank', 'noopener');
      if (statusOut) statusOut.textContent = 'Opening WhatsApp… we usually reply within a few hours.';
    });
  }

  var mailBtn = document.getElementById('sendEmail');
  if (mailBtn) {
    mailBtn.addEventListener('click', function () {
      var d = collect();
      if (!d) return;
      var subject = 'Quote request: ' + d.service + ' — ' + d.name;
      window.location.href =
        'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(buildBody(d));
      if (statusOut) statusOut.textContent = 'Opening your email app…';
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* =====================================================
     13. FOOTER YEAR
     ===================================================== */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
