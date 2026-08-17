# Cyber Tech — Marketing Website

A fast, self-contained marketing site for **Cyber Tech** (Kitwe, Zambia).
No build step, no framework, no dependencies — just open it and it runs.

```
cyber-tech-website/
├── index.html
├── README.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/            (drop your logo / screenshots here)
```

---

## Viewing it

Double-click `index.html` — everything is relative, so it works straight off the disk.

To serve it locally instead (better for testing links):

```bash
python -m http.server 8899
```

Then open `http://localhost:8899`.

---

## What's on the page

| Section | Purpose |
|---|---|
| Hero | Animated particle network that reacts to the cursor, typing headline, live clock panel |
| Stats strip | Animated counters |
| Marquee | Scrolling list of everything you offer |
| Services | Six service cards (school systems, portals, business systems, HR/payroll, custom apps, installation & support) |
| Solutions | Deep-dive on the School Management System + animated mock dashboard |
| Our Work | Nine projects with working category filters |
| Process | Four-step engagement flow |
| Why Cyber Tech | Six differentiators + quote card |
| Engagements | Starter / Institution / Enterprise packages |
| FAQ | Six accordion answers |
| Contact | Details + quote form that sends via **WhatsApp** or **email** |

### Interactions built in
- Custom cursor (dot + trailing ring that grows over clickable things)
- Mouse-reactive particle field in the hero
- Cursor spotlight on the hero and on every card
- Magnetic buttons, 3D tilt cards
- Scroll progress bar, scroll reveals, active-section nav highlighting
- Live clock on **Kitwe time (CAT, UTC+2)** — correct even for a visitor abroad
- Automatic **"We're open now" / "Closed"** badge based on your office hours
- Full mobile menu, floating WhatsApp button, back-to-top
- Respects `prefers-reduced-motion` and works with keyboard focus

---

## Your details (already wired in)

- **Phone / WhatsApp:** +260 975 341 516
- **Email:** rainserick@gmail.com
- **Offices:** Kitwe, Copperbelt, Zambia
- **Hours:** Mon–Fri 08:00–17:00, Sat 08:00–13:00, Sun closed

To change them later:
- Phone & email in the form logic: top of section 12 in `assets/js/main.js` (`PHONE`, `EMAIL`)
- Everything visible: search `index.html` for `975341516` and `rainserick@gmail.com`
- Office hours: `updateOfficeStatus()` in `assets/js/main.js` (times are in minutes from midnight — `480` = 08:00, `1020` = 17:00)

---

## Before you publish — edit these

1. **The stats.** Search `index.html` for `EDIT ME`. The four numbers (25+ systems, 5+ years, 100%, 24/7) are placeholders — put your real figures in so nothing on the site can be challenged.
2. **Testimonials.** There's a commented note in the "Why Cyber Tech" section. Once you have real client quotes (name, school/company, what the system did for them), swap the quote card for them. Real names convert far better than anything generic.
3. **Screenshots.** The "Solutions" section uses a CSS mock dashboard. Replacing it with a real screenshot of one of your systems (blur out any real student/customer data first) will make the page much stronger.
4. **A logo.** Drop a PNG/SVG in `assets/img/` and replace the `.logo__mark` SVG if you have one.
5. **Social share image.** Add `assets/img/og.jpg` (1200×630) and uncomment/add
   `<meta property="og:image" content="assets/img/og.jpg">` in the `<head>` — this is the picture that appears when someone shares your link on WhatsApp or Facebook.

---

## Putting it online (free options)

**Netlify (easiest):** go to app.netlify.com/drop and drag the `cyber-tech-website` folder onto the page. You get a live URL in seconds. Add your own domain later under *Domain settings*.

**GitHub Pages:** push the folder to a repo, then *Settings → Pages → Deploy from branch → main / root*.

**Cloudflare Pages / Vercel:** connect the repo, leave the build command empty, set the output directory to `/`.

A domain like `cybertech.co.zm` or `cybertechzm.com` will make the marketing considerably more convincing than a free subdomain — worth the annual fee.

---

## Notes

- Fonts (Outfit + JetBrains Mono) load from Google Fonts, so first paint needs internet. If you want it to work fully offline, download the font files into `assets/` and swap the `<link>` for a local `@font-face`.
- No tracking or analytics is included. If you want visitor numbers, add a Google Analytics or Plausible snippet before `</head>`.
- The contact form has no server — it composes a prefilled WhatsApp message or email. That's deliberate: it works on static hosting and lands the enquiry straight where you'll see it.
