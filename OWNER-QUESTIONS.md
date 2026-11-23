# Owner interview — AJD Custom Interior Upholstery

**Internal working document. Not part of the website, not linked from any page, not for publication.**

The public site now states only what is already supported. Every question below is a detail the site deliberately leaves out.

Business: AJD Custom Interior Upholstery · 601 N Belt Line Rd Suite 180, Irving, TX 75061 · (214) 489-1200

---

## A · Resolve before anything else

| # | Question | Why it matters | Answer |
| --- | --- | --- | --- |
| A1 | **Do you already own `ajdupholstery.com`?** | A live site exists at that domain carrying your phone number and suite address. If it is yours, this project is a redesign, not a first site — and that changes the whole pitch. | |
| A2 | If it is yours, what is wrong with it, and what should carry over? | Decides scope entirely | |
| A3 | If it is **not** yours, who put it up? | Someone is publishing under your name | |

Settle A1 before presenting anything else.

---

## B · Contact details — three numbers are in circulation

| # | Question | Found where | Answer |
| --- | --- | --- | --- |
| B1 | Which number should the site publish? | (214) 489-1200 on Facebook and the live site | |
| B2 | Is (972) 887-3341 yours? | Yahoo Local, MapQuest, a Dallas directory | |
| B3 | Is (817) 986-8227 yours? | Chamber of Commerce listing | |
| B4 | Which email should appear publicly? | `ajd.upholstery@gmail.com` | |
| B5 | Is the email monitored day to day, or is the phone the real route? | Changes how the contact page is worded | |
| B6 | Any stale listings you want corrected? | Wrong numbers send work elsewhere | |

---

## C · Hours and location

- [ ] **C1** Are the hours right — Mon–Fri 8:00 AM–5:00 PM, Sat 12:00–5:00 PM, Sun closed?
- [ ] **C2** Any holiday or seasonal variation?
- [ ] **C3** Is the suite genuinely on the back side of Glam Furniture? How should customers be directed?
- [ ] **C4** Is there customer parking, and where?
- [ ] **C5** Drop-off and collection — vehicle, or pieces brought in?

---

## D · Services — confirm and expand

Cars, boats and furniture are named in your own description. Confirm the detail underneath.

**Cars**
- [ ] Seats and seat covers
- [ ] Seat rebuilds and foam
- [ ] Headliners
- [ ] Sunroof shades
- [ ] Door panels
- [ ] Carpet
- [ ] Convertible tops
- [ ] Vinyl repair
- [ ] Steering wheels, consoles, armrests
- [ ] Katzkin or other branded leather kits
- [ ] Classic, hot rod, truck or commercial interiors

**Boats** — D1 What kinds of craft, and which pieces? Is marine-grade material supplied?

**Furniture** — D2 What is taken on, and can customers supply their own fabric?

**D3** Anything on this list you do *not* do?

**D4** Do customers come to you, or do you collect?

---

## E · Trust — what the site currently cannot say

| # | Question | Unlocks |
| --- | --- | --- |
| E1 | How many years, exactly? | Facebook says "more than 30 years" — confirm before it goes on a page |
| E2 | Who runs the shop, and who works there? | A team section — there is none |
| E3 | Any guarantee on workmanship or materials? | A trust block customers look for |
| E4 | Typical turnaround for a common job? | The most-asked question in upholstery |
| E5 | How is a job priced — inspection first, photographs, flat quote? | Sets expectations before the call |
| E6 | Any price or starting-from figure you will publish? | Pricing is the most-discussed topic in your reviews |
| E7 | Payment methods accepted? | Not currently stated |
| E8 | Should the site show a star rating, and from where? | Ratings drift; a frozen number goes stale |

---

## F · Assets to collect

- [ ] **F0** **The hero photograph.** The site now uses one image: the cover photo from the business's own Google Business Profile, saved locally as `assets/img/finished-interior.jpg`. Two things to settle:
  - Is it OK to use on the website? (It is the business's own listing photo, but that is not the same as permission to publish it here.)
  - **What is the vehicle?** It reads as a party-bus or limo-bus interior — wraparound diamond-stitched grey and black bench seating, a floor pole, ceiling lights and a mounted screen. The site deliberately does not name it, because naming it wrong would be worse than saying nothing. If the owner confirms what it is, the alt text and a caption can say so.
- [ ] **F1** Photographs — there are 225 on the Google listing. Which may be used on the site, and are there higher-resolution originals? (The hero image is the largest Google serves: 1500&times;2000.)
- [ ] **F2** Before-and-after pairs. The single most persuasive thing an upholstery site can show, and none are on the site today.
- [ ] **F3** A logo file, to replace the `AJD` monogram and `assets/img/favicon.svg`.
- [ ] **F4** Material and colour samples worth photographing.
- [ ] **F5** Any print material or signage to match the site to.

---

## Where answers get applied

| Answer | File |
| --- | --- |
| Hours | the hours tables in `index.html` + `contact.html`, and the `SCHEDULE` in `assets/js/site.js` |
| Phone / email | across all four pages, plus `assets/js/i18n.js` |
| Service detail | `services.html` |
| Photographs | `work.html` — the gallery is the page's whole purpose |
| History, team, guarantee | new sections; none exist yet |

**Note on translations:** this site is bilingual. Any copy change must be made in **both** the `en` and `es` dictionaries in `assets/js/i18n.js`, not only in the markup.
