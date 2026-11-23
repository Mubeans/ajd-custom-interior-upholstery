# AJD Custom Interior Upholstery — Irving, TX

A static, bilingual (English / Español) website for **AJD Custom Interior Upholstery**, 601 N Belt Line Rd Suite 180, Irving, TX 75061, (214) 489-1200.

Prospect **rank 2** on the Irving list (priority 9.2), immediately after Japanese Auto Repair. The listed website gap is *"No standalone website located in quick search"* — confirmed during this build: the business's Google listing still shows **"Add website"**, so no site exists to replace.

No build step, no framework, no backend. Five hand-written HTML pages, one stylesheet, two scripts, one SVG icon. Nothing is downloaded at runtime except the Google Fonts stylesheet.

> **This is a local preview, not a deployment.** It is not published anywhere, and it has `<meta name="robots" content="noindex, nofollow">` on every page so it cannot be indexed if it is ever served by accident.

---

## 1. Preview it locally

From the parent folder (`WEBSITES-CLD`):

```bash
py -m http.server 8103 --directory ajd-custom-interior-upholstery
```

Then open <http://localhost:8103>. An `ajd-custom-interior-upholstery` entry is also registered in `../.claude/launch.json` (port 8103), so Claude's preview pane can start the same server by name.

Opening `index.html` straight from the filesystem works too, but a local server is closer to production behaviour.

---

## 2. Files

```
ajd-custom-interior-upholstery/
├─ index.html        Home — hero, the public record, the shop's own words,
│                    review topics, before-you-call, visit
├─ services.html     Cars · Boats · Furniture, each with what is on the record,
│                    what is not, and what to ask — plus "what this page is not"
├─ work.html         Twelve labelled, deliberately empty photo frames +
│                    review topics + why no photographs are used
├─ about.html        Fact ledger with a source for every line, the three
│                    sources, and "what only the owner can confirm"
├─ contact.html      Phone / email / in person, an estimate note builder,
│                    hours, directions, accessibility
├─ README.md         This file
└─ assets/
   ├─ css/styles.css Whole design system: tokens, components, responsive, print
   ├─ js/i18n.js     Every customer-facing string, EN and ES (315 keys each)
   ├─ js/site.js     Language switch, live open/closed status, drawer,
   │                 scroll reveal, estimate note builder
   └─ img/favicon.svg
```

There are **no raster images anywhere in this project**. Every decorative mark — the stitch texture, the topstitch card borders, the seam rules, the monogram — is CSS or inline SVG. §8 explains why.

---

## 3. Design system

Deliberately unlike the sibling `japanese-auto-repair` site (cream paper, charcoal, amber). This one is dark-dominant and material-led — a trim shop at the bench.

| Token | Value | Notes |
| --- | --- | --- |
| Ink | `#15120f` | Warm near-black page surface |
| Ink raised | `#1d1915` | Cards, drawer, footer |
| Bone | `#f0ebe3` | The light bands |
| Text | `#f0ebe3` / `#bcb2a4` / `#8d8578` | Primary, dim, faint — all on ink |
| Saddle tan | `#c9833c` | Accent and CTAs on dark (5.9:1) |
| Tan ink | `#7a4a1c` | The same accent on bone (6.0:1) |
| Thread | `#e9705b` | Validation and tick marks, used sparingly |
| Display | Fraunces | Headings and the pull quote |
| Body | Figtree | 17px / 1.65 |
| Technical | IBM Plex Mono | Section indices, hours, labels, buttons |

The recurring motif is a **stitch**: dashed rules between sections, a topstitch line set 8px inside every card and panel, a dashed seam under the current nav item, and a rotated running-stitch SVG texture behind each page header.

The `ui-ux-pro-max` design-system generator proposed Cinzel / Josefin Sans and a luxury-real-estate palette for this query. That was rejected as off-brief for a working trim shop; its *Portfolio Grid* structure, its "Exaggerated Minimalism" high-contrast direction and its pre-delivery checklist were applied.

---

## 4. Language switch (EN / ES)

* Strings live in `assets/js/i18n.js` as `window.AJD_I18N = { en: {...}, es: {...} }` — 315 keys each.
* Markup binds with `data-i18n` (text), `data-i18n-html` (values containing `<em>`), `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-title`, `data-i18n-content` (meta description) and `data-i18n-placeholder` (form fields).
* **Every page carries its full English copy in the HTML itself.** The dictionary overwrites it; it never supplies it. That is what makes the no-JavaScript fallback a complete page rather than a blank one (§7).
* The choice is stored in `localStorage` under `ajd-lang` and survives navigation and reloads. A tiny inline script in each `<head>` applies the stored language to `<html lang>` before paint; `i18n.js` and `site.js` are `defer`-loaded, so the swap happens between parse and first paint.
* With no stored choice, a browser whose language starts with `es` gets Spanish; everyone else gets English.

**To add or change copy:** add the key to *both* `en` and `es`, then reference it from the markup. The checker in §7 fails if a key is missing from either language, or if any element bound to a key is empty in the HTML.

One passage is deliberately **not** translated: the quotation from the business's Facebook page on the home page. It is marked `lang="en"` and left in the original wording in both languages, because translating someone's published words and still presenting them as a quotation would misrepresent them. The Spanish paragraph underneath explains in Spanish what it says.

---

## 5. Live "open now / closed" status

`site.js` holds the listed hours as minute ranges and evaluates them against **America/Chicago** (via `Intl.DateTimeFormat`, so a visitor in another time zone still sees the shop's status, falling back to the visitor's clock if IANA data is unavailable). It renders "Open now · Closes 5:00 PM", "Closed · Opens 8:00 AM" or "Closed · Opens Mon 8:00 AM", and highlights today's row in every hours list, refreshing once a minute.

With JavaScript off the pill shows the static, non-committal **"Listed hours · Mon–Fri 8 AM–5 PM · Sat 12–5 PM"** — never a live claim it cannot back up.

If the hours change, edit the `SCHEDULE` array in `assets/js/site.js` **and** the `hours.*` keys in `i18n.js`.

---

## 6. The estimate note builder, and where a backend would go

The contact page has a form, but **it posts nowhere and stores nothing**. On submit it assembles the answers into a plain-text message and hands it to the visitor's own email client, addressed to `ajd.upholstery@gmail.com` — the address the business publishes on its own Facebook page. The form says so in its own copy, in both languages. Nothing is sent until the visitor presses send in their mail app.

This was chosen over the two alternatives: a form that silently posts nowhere would be dishonest, and a form pointing at an endpoint the owner has not agreed to would be worse.

When the owner confirms a destination:

1. **Keep the mailto, change the address.** Edit `data-mailto` on the `<form>` in `contact.html` and the `fact.email` key in `i18n.js`.
2. **A real form.** Give the `<form>` an `action` and `method`, point it at a form service (Formspree, Basin, Web3Forms) or the owner's own endpoint, and delete the `initEstimateForm` submit handler's `event.preventDefault()` path. Keep the visible labels, the 48px-tall inputs and the next-to-the-field errors. Add any new strings to both dictionaries.
3. **Online booking.** If the shop adopts a scheduling tool, add it as a fourth channel card on `contact.html` — and remove the line on that page that says three published channels exist, since it would become wrong.

Whatever is added, strike the matching line from the "What only the owner can confirm" list on `about.html` (`about.open.i*`).

---

## 7. Checks that were run

### Static checker

`check_site.py` (run from the session scratchpad; no Node toolchain on this machine) verified across all five pages:

* HTML tag nesting and closure — no unclosed or mismatched tags
* Every `data-i18n*` key used in markup, in `site.js`, or as a `<option value>` exists in **both** dictionaries, and both dictionaries have identical key sets
* No element bound to an i18n key is empty in the HTML — i.e. nothing goes blank with JavaScript off
* Every local `src`/`href` resolves to a file that exists; no duplicate `id` on any page
* Every page has the `tel:+12144891200` link, the Google Maps link, both language buttons, the mobile menu button, a `#main` landmark, a skip link, a viewport meta, a meta description and a favicon
* No stray or mistyped `tel:` targets
* `styles.css` braces balance; every `var(--x)` used is defined; every variable defined is used; every class used in HTML has a rule
* Every `<label for>` matches a control id, and every control `site.js` reads exists in the markup

**Result: 0 errors, 0 warnings.** 315 EN / 315 ES keys, all 315 in use.

### Browser verification (preview pane, localhost:8103)

* **No console errors or warnings** on any of the five pages, in either language
* **Language switch** updates `<html lang>`, `<title>`, the meta description, every visible string, placeholders, aria-labels and the live status pill; the choice persists across navigation and reload. Zero elements render empty in Spanish; zero strings are left in English except the deliberately untranslated quotation
* **Responsive:** 100 page × width combinations (5 pages × 320, 360, 375, 414, 430, 480, 540, 600, 700, 768, 820, 900, 940, 1000, 1024, 1080, 1180, 1280, 1440, 1600) — **no horizontal overflow and no tap target under 44 × 44px anywhere**
* **Contrast:** 1,958 text nodes measured across 5 pages × 2 languages × 2 widths, with translucent backgrounds correctly composited — **0 failures** against WCAG AA (4.5:1 body, 3:1 large)
* **Mobile drawer** opens, closes, relabels itself ("Open menu" / "Cerrar menú"), closes on Escape and on link click; its links are 62px tall
* **Estimate form:** submitting it empty is blocked, both required fields are flagged, the error text appears next to the field and focus moves to the first bad one; typing clears the flag; the assembled message is correct in both languages with correct URL encoding
* **No-JavaScript fallback** tested for real, by loading each page in a `sandbox="allow-same-origin"` iframe with scripting genuinely disabled: all five pages render complete English copy (3,000–5,200 characters each), with correct titles and meta descriptions, the phone number, the address, the hours table, the footer disclaimer, the static hours pill, and the `<noscript>` note on the contact page. No horizontal overflow
* **Live status** correctly read "Open now · Closes 5:00 PM" on Wednesday 18 November 2026, with today's row highlighted in every hours list

### Four real bugs were found this way and fixed

1. **`form.elements.item` returned a function, not the field.** `HTMLFormControlsCollection` already owns `item()`, `namedItem()` and `length`, so the named lookup collided and the estimate message would have been built from `undefined`. Controls are now looked up with `form.querySelector('[name="…"]')`, and the checker fails the build if `form.elements.<name>` reappears.
2. **Horizontal overflow below 540px.** The header brand had `flex: none`, pinning the header's minimum width at 443px. The brand now shrinks, and its wordmark drops below 560px leaving the AJD monogram (the link keeps its accessible name either way).
3. **The Facebook quotation rendered bone-on-bone and was invisible.** `.srcquote p` sets an explicit colour, so it did not inherit the light band's ink. Caught by the contrast audit, not by eye.
4. **Form labels at 2.73:1 on the cream card.** `--text-faint` is tuned for the dark surface. Small form text on the bone band now uses the bone-band ink.

Two smaller fixes in the same pass: tap targets were brought up to 44px (language buttons were 36, small buttons 42, nav links 34), and the skip link was moved off-screen *vertically* rather than with `left: -9999px`, which can add to a document's scroll width.

---

## 8. Facts, sources, and what is missing

### Presented as verified

Every one of these is in the ledger on `about.html` with its source shown next to it. All were read on **18 November 2026**.

| Fact | Value | Source |
| --- | --- | --- |
| Business name | AJD Custom Interior Upholstery | Google Business Profile |
| Category | Auto upholsterer | Google Business Profile |
| Address | 601 N Belt Line Rd Suite 180, Irving, TX 75061 | Google + directories |
| Phone | (214) 489-1200 | Google + the business's Facebook page |
| Email | ajd.upholstery@gmail.com | The business's Facebook page |
| Hours | Mon–Fri 8:00 AM–5:00 PM · Sat 12:00 PM–5:00 PM · Sun closed | Google Business Profile |
| Rating | 4.8 from 65 reviews | Google Business Profile |
| Photos | 225 on the listing | Google Business Profile |
| Accessibility | Wheelchair accessible entrance; wheelchair accessible parking lot | Google Business Profile |
| Plus code | R294+X7 Irving, Texas | Google Business Profile |
| Review topics | pricing 13 · seats 11 · timeliness 3 · friendly staff 3 · sunroof shade repair 2 · seat rebuilds 2 · headliner upholstery 2 · courteous team 2 · cushions 2 · ford 2 | Google's own topic labels and counts |
| Landmark | "on the backside of Glam Furniture" | A Texas auto-upholstery directory |

### Presented as a quotation, not as fact

The home page quotes the business's own published description from its Facebook page, verbatim, attributed and dated:

> "With more than 30 years of experience and dedication, we do Custom Interior Upholstery for cars, boats and furniture. From selecting material to choosing the perfect colors and patterns, we tailor every aspect of the design to suit your preferences"

This is the **only first-person voice anywhere on the site**, and it is marked as a quotation of someone else's words. The "more than 30 years" figure is therefore never asserted by the site — it is reported as something the business says about itself. `about.html` labels it "Quoted, not verified independently."

The three pages that discuss cars, boats and furniture all trace back to this one sentence plus the Google category. That is stated on the page, not implied.

### Why the rating and review count are on the site

The memory standard for these prospect sites excludes ratings and review counts "unless verified". These were verified by direct observation of the Google listing, and they are shown **with the date they were read and a link to the live listing**, never as a standing marketing claim. If that is still too much for the pitch, delete the `home.record.f1*` and `home.record.f2*` figures from `index.html` and the `about.l7*` row from `about.html`; nothing else depends on them.

**Decision (18 November 2026): keep them.** This was raised explicitly and confirmed, so their presence is a considered choice rather than an oversight — don't strip them in a later accuracy pass without asking.

They will go stale. **Re-read the rating, the review count and the photo count before any owner meeting.**

### Deliberately absent

No prices. No turnaround times. No warranty, certification or guarantee claims. No staff names. No years-in-business figure stated as the site's own. No claim about walk-ins, parking layout, appointments, payment methods, ownership structure, or how the shop answers the phone. No prediction of what the shop will say. No "we"/"our" outside the one marked quotation.

### Two findings worth raising with the owner

1. **A second phone number is circulating.** Yahoo Local, MapQuest and at least one city directory list **(972) 887-3341** for this business. Google and the business's own Facebook page both list **(214) 489-1200**, which is what this site uses throughout. If the 972 number is dead, those directories are sending callers nowhere — worth cleaning up, and a concrete thing to lead with.
2. **The Facebook page's categories look mis-set.** It is filed under *Furniture Repair & Upholstery Service · **Car dealership** · **Boat Rental***. The last two are almost certainly wrong and are not used anywhere on this site. They may be hurting how the page surfaces.

### One lead that could not be verified, and is therefore not on the site

An Alignable listing for this business appears in search results describing **vinyl repair, carpet installation, convertible top replacement, custom seat covers and headliner replacement**. The page itself returned HTTP 429 to every attempt (both WebFetch and the browser), so it was never read directly — only summarised by a search engine. That is second-hand, so none of it appears on the site. If the owner confirms this list, `services.html` has room for it immediately.

### No photographs

The business already has **225 photos on its Google listing** — far more than this site would need. None are reproduced here, because photos on a Google listing may have been uploaded by the business *or* by its customers and the two are not distinguishable from outside; republishing them elsewhere is the owner's call.

Stock photography was considered and rejected outright. A photograph of a workshop that is not this one, placed on a page about this one, is a claim — exactly the kind this site exists to avoid. `work.html` instead shows twelve labelled, visibly empty frames saying what photograph belongs in each. That is honest, and it is also the clearest possible brief for the one thing the owner has to supply.

---

## 9. Owner-confirmation checklist

Nothing below was invented to fill a gap. Each line is copy that can be written the moment the owner supplies it. The same list appears on `about.html` so the owner can see it on the site itself.

### Must be answered before anything goes live

* [ ] **Hours** — confirm Mon–Fri 8:00 AM–5:00 PM, Sat 12:00 PM–5:00 PM, Sun closed. Any lunch closure, seasonal hours or holiday closures? → `SCHEDULE` in `site.js` + `hours.*` in `i18n.js`
* [ ] **Phone** — confirm (214) 489-1200 is the number to publish, and whether (972) 887-3341 is still live (see §8)
* [ ] **Preferred contact method** — phone, email, text, or Facebook message? The site currently leads with phone
* [ ] **Form destination** — is `ajd.upholstery@gmail.com` monitored, and should enquiries go there? If not, where? → §6
* [ ] **Services** — the full list of work taken on, and anything explicitly not taken on. Confirm or reject the Alignable list in §8 → `services.html`
* [ ] **Business history** — how long the shop has operated, and whether the "more than 30 years" line from Facebook is current and may be stated as fact rather than quoted → `home.words.quote`, `about.l10*`
* [ ] **Photographs** — permission to publish, and which ones. Twelve captioned slots are waiting in `work.html`
* [ ] **Business name** — "AJD Custom Interior Upholstery" (Google) or "AJD Upholstery" (Facebook)? The site uses the longer form throughout
* [ ] **Remove the footer disclaimer** (`footer.disclaimer`) once the owner has approved the copy — it currently states that the site is not operated or endorsed by the business, which is true today and must not be true on a live site
* [ ] **Remove `<meta name="robots" content="noindex, nofollow">`** from all five pages at launch

### Needed to make the site genuinely useful

* [ ] **Prices or price ranges**, or how estimates are given and what a quote needs
* [ ] **Turnaround times**, and whether appointments are required or walk-ins are fine
* [ ] **Warranty** on materials and labour, and its terms
* [ ] **Staff** — who works there, any training or certifications, and whether names may be published
* [ ] **Payment methods** accepted
* [ ] **Parking and the entrance** — confirm the "backside of Glam Furniture" description, and say where to park
* [ ] **Materials** — what is stocked, whether customers may supply their own fabric
* [ ] **Boats and furniture** — are both still taken on, and on what terms?
* [ ] **Service area** — Irving only, or wider DFW? Any pickup or mobile service?

### Nice to have

* [ ] A real logo to replace the `AJD` monogram and `assets/img/favicon.svg`
* [ ] An `og:image` and social preview tags, once real photographs exist
* [ ] Social links, if the owner wants the Facebook page linked more prominently than in the footer
* [ ] Re-read the Google rating, review count and photo count before any meeting — all three are dated on the site and all three move

---

## 10. Browser support

Modern evergreen browsers. `IntersectionObserver`, `Intl.DateTimeFormat` with IANA time zones, CSS custom properties, `clamp()`, `aspect-ratio`, `:has()` and `backdrop-filter` are used, each with a sensible fallback: without `IntersectionObserver` all content renders immediately; without time zone data the status falls back to the visitor's clock; without `localStorage` (private mode) the switch still works for the current visit; without `:has()` two panels gain a hover lift they do not need; without `backdrop-filter` the header is opaque instead of blurred.

With JavaScript entirely disabled, every page is complete and readable in English — see §7.

---

## Photography

The site uses exactly one photograph: `assets/img/finished-interior.jpg`.

| | |
| --- | --- |
| Subject | A finished vehicle interior — wraparound diamond-stitched bench seating in grey and black, with a floor pole, ceiling lighting and a mounted screen. It reads as a party-bus or limo-bus interior. |
| Source | The cover photo on the business's own Google Business Profile, posted by AJD Custom Upholstery, LLC |
| Hosting | **Local asset.** Downloaded and committed to `assets/img/`. Nothing is hot-linked to Google, so the page does not depend on a Maps URL that can rotate or expire, and no referrer is sent to Google on page load. |
| Resolution | 1500&times;2000 (the largest size Google serves for this photo; requesting `s2000` returns the same bytes) |
| Cropping | Done entirely in CSS with `object-fit: cover`. The file on disk is the untouched original. 4:5 beside the headline at &ge;981px, 3:2 stacked below it on tablet, 16:10 on phones under 560px. `object-position` is tuned per breakpoint so the stitched seating stays in frame. |
| Placement | Hero only, in the right-hand column of `.hero__in`. It never sits behind text, so no scrim is needed and no contrast is lost. |
| `width`/`height` | Set on the `<img>` so the browser reserves space and the hero does not shift as it loads. `fetchpriority="high"` because it is the LCP element. |

**It is not used as the Boats image.** The photo shows a road vehicle, not a boat. Labelling it as marine work would be a claim the image does not support, so the Boats section on `services.html` stays text-only.

Alt text is translated: `home.hero.photoAlt` exists in both the `en` and `es` dictionaries in `assets/js/i18n.js`, and describes only what is visible.

Whether the shop may publish this image, and what the vehicle actually is, are open questions for the owner — see `OWNER-QUESTIONS.md` &sect;F0.
