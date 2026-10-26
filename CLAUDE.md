# CLAUDE.md — GrowingOffers Style Guide

## Brand Identity
- **Brand Name:** GrowingOffers (site: growingoffers.com). One word, camel-cased in prose;
  the logo sets it as `GO` over a `GROWINGOFFERS` wordmark. Rebranded from A1 Media in
  October 2026, so treat any surviving "A1" as a bug.
- **Positioning:** We help, fund & launch creators. We craft an established creator a
  high-ticket offer, launch it as a **webinar funnel in 10 to 14 days**, then pay for the
  ad spend ourselves to scale it.
- **Audience:** Creators with an established organic brand who are currently selling a Skool
  community, a low-ticket course, or taking brand deals — not beginners building an audience.
- **Tone:** Editorial, plain-spoken, confident. Short declarative sentences. No hype stack,
  no exclamation marks, no "unlock/supercharge" language. The funding claim carries the pitch.
- **Voice:** Direct and specific about money and risk. British-English spellings (monetise,
  optimise) are used throughout.

## Brand Colors

| Name                 | Hex / Value                  | Usage                                        |
| :------------------- | :--------------------------- | :------------------------------------------- |
| Primary Background   | `#070706`                    | Main page background                         |
| Secondary Background | `#0F0E0D`                    | `.plate` — the inset rounded band            |
| Card / Panel         | `#151413`                    | Borderless panels, pills, image wells        |
| Panel Hover          | `#1B1917`                    | Hover elevation                              |
| Accent (Champagne)   | `#E3C08D`                    | Emphasis words, eyebrows, rules, CTAs        |
| Accent Glow          | `#F2DCB4`                    | Top of the gold gradient, hover              |
| Accent Deep          | `#C79E58`                    | Bottom of the gold gradient                  |
| Accent Light         | `#F7EAD3`                    | Highlight tint                               |
| Primary Text         | `#FAFAFA`                    | Headlines and lead copy                      |
| Body Text            | `#D2CEC9`                    | Paragraphs                                   |
| Muted Text           | `#8A857D`                    | Captions, card bodies, pills                 |
| Dim Text             | `#4D4A46`                    | The dimmed clause in the statement paragraph |
| Border / Hairline    | `rgba(255,255,255,0.07)`     | FAQ dividers and the ghost button only       |

Gold stays the accent — the reference's acid lime was deliberately not adopted. Gold text
uses `.text-gold` (background-clip gradient); the button ring uses a rotating conic gradient.
Hairlines are almost entirely gone: panels separate by fill, not by border.

CSS variables live in `src/app/globals.css`. Accent colors are exposed to Tailwind as
`rgb(var(--accent-channels) / <alpha-value>)`, so `text-accent/25` and `bg-accent/60` work.

## Typography

Two families, doing very different jobs. Reference: offerpartners.co.

- **Inter** (variable, `opsz` axis on) carries everything — body, UI and every headline.
- **Playfair Display 600 italic** is the accent phrase inside a headline, and appears
  **nowhere else**. It is the emphasis mark, not the display face.

Both are loaded by **`next/font`** in `src/app/fonts.ts` and exposed as `--font-inter` /
`--font-playfair`. Do **not** move them to an `@import` in `globals.css` — the import lands
after Tailwind's rules in the compiled sheet, which makes it invalid CSS, and the browser
silently drops it. The whole site falls back to system fonts and nothing errors.

### Scale

| Element        | Size | Weight | Line-height |
| :------------- | :--- | :----- | :---------- |
| H1             | 72px | 600    | 1.2         |
| H2             | 52px | 600    | 1.2         |
| H3             | 28px | 500    | 1.4         |
| H4 / FAQ row   | 24px | 500    | 1.4         |
| Statement      | 44px | 500    | 1.2         |
| Body           | 18px | 400    | 1.6         |
| Eyebrow        | 18px | 400    | 1.4, gold, sentence case |

Headings run `letter-spacing: normal`. **Don't reintroduce negative tracking** — Inter is
drawn for it and the old `-0.022em` makes it look cramped at 72px.

Body is 1.6 rather than the reference's 1.4: A1's paragraphs run six or seven lines where
theirs run three, and 1.4 bricks up.

### Headline emphasis

One device only: wrap the accent phrase in `.accent-italic .text-gold`. At most one per
headline. The old `.mark-box` / `.mark-underline` were tuned against Playfair's proportions
and are gone.

## Layout System

- **Content column:** `max-w-content` = **1248px**; inner grids `max-w-inner` = 1128px;
  the FAQ column is `max-w-prose` = 760px.
- **Section padding:** flat **96px** (`py-24`) top and bottom. Not 128 at `md`.
- **Rhythm:** 48px between blocks, 32px between cards, **16px** headline → body.
- **Bands:** the alternating band is a `.plate` — an inset rounded rectangle at content
  width, radius 30px — **not** a full-bleed stripe.
- **Radius scale:** 10px (buttons), 14px (`sm`, pills), 20px (`md`), 24px (`lg`, cards),
  30px (`xl`, plates).

### Surfaces

Panels are **borderless**. Separation comes from fill against the page, which is why
`--bg-card` (`#151413`) sits ~14 steps above `--bg-primary` (`#070706`). If you darken the
card token, the cards vanish — add contrast, don't add a hairline back.

Component classes (`.panel`, `.plate`, `.pill`, `.btn-ring`, `.btn-quiet`, `.aurora`) live
inside **`@layer components`**. They must stay there: outside it they beat Tailwind
utilities on source order, and `hidden md:inline-block` stops working (this shipped two
CTAs on mobile once already).

## Component Styles

### Buttons

Small and soft-square, not pills. Two nested boxes — the outer's 1.5px padding *is* the ring:

| Layer            | Background | Radius | Padding      |
| :--------------- | :--------- | :----- | :----------- |
| `.btn-ring`      | `#3B3735`  | 11.5px | 1.5px        |
| `.btn-ring__face`| `#0C0C0C`  | 10px   | 7px 18px 9px |

A gold conic gradient rotates around the ring via `@property --ring-angle`. `.btn-quiet` is
the ghost variant at the same footprint. Label is 18px/400.

### Section treatment

Sections are deliberately **not** uniform, but the variety is in **size, alignment and
rhythm, not colour**. Each section gets its own heading size (54 / 46 / 44 / 30px, not one
repeated scale) and its own alignment: Why A1 and the FAQ are left-aligned, the rest centred.
Body copy alternates between `#D2CEC9` and the quieter `#8A857D`.

**Eyebrows are always gold.** Per-section accent colours were tried and pulled: on a gold and
black page, cyan / green / violet eyebrows read as three unrelated palettes rather than as
variety. Don't reintroduce them.

### Card art

`src/components/Infographics.tsx`:

- `GrowthChart`, `StrategyCard`, `RevenueCurve` — the three bento art wells, each drawn for a
  **300×168** viewBox. Don't put a full-width diagram in a card; the editorial ones this
  replaced rendered their labels at about 5px.
- `ToolStack` — the tool roster, as full-colour brand marks in circular chips. Edit `TOOLS`
  when the stack changes.
`src/components/PillarIcons.tsx` — `HelpIcon`, `FundIcon`, `LaunchIcon`. 64px, filled, one
colour each (cyan / gold / green), each animating on its own loop. The Why A1 section has no
diagram: the icons carry the motion.

`src/components/TeamStack.tsx` — the placed sales seats, four real headshots in
`/public/team/`, mirrored from the `sales team photos/` folder at the repo root. A seat whose
file is missing falls back to a monogram. Only real staff photos go here: the card presents
them as our placed staff, so stock portraits would make that claim false.

`src/components/BrandLogos.tsx` holds the brand marks as inline SVG in their own colours.
They are the **only** place on the site that isn't gold, and that is on purpose. Nominative
use only: they identify the products, nothing more.

### Motion

- **Lenis** smooth scroll (`src/components/SmoothScroll.tsx`), destroyed under
  `prefers-reduced-motion`.
- In-page anchors **must be plain `<a>`, never Next `<Link>`**. Link preventDefaults the
  click in its own React handler, so the document-level Lenis listener bails on
  `e.defaultPrevented` and you get a hard hash jump.
- Don't pass an `offset` to `lenis.scrollTo` — it already honours the section's
  `scroll-mt-24`, and passing both lands the heading twice as far down.
- **Verify reveals on a freshly started dev server.** After a Fast Refresh edit,
  framer-motion's `whileInView` can get stuck at `opacity: 0` and the section renders blank
  even though the markup is correct. It is an HMR artifact, not a bug; restart before
  concluding anything is broken.
- `AnimatedSection` takes a `variant` (`up` / `left` / `right` / `scale` / `fade`) and runs
  with **`once: false`**, so sections reveal every time they enter the viewport in either
  scroll direction. That is deliberate: it is what makes the page feel alive going back up.
  It also means a full-page screenshot captures off-screen sections as blank — verify by
  screenshotting viewport-by-viewport down the scroll, not with `fullPage`.
- `.aurora` is the drifting gold wash behind the hero and final CTA.
- `.ico-*` keyframes drive the three Why A1 glyphs; `.tick-path` draws the capability ticks
  in on a cascade, each pill passing its own `--tick-delay`.
- `.aurora` is two blurred pseudo-element blobs drifting on 34s and 47s periods. The periods
  don't divide evenly, which is what stops it reading as a pulse.
- Everything animated is switched off under `prefers-reduced-motion`.

## Site Structure

The marketing pages are informational only — no VSL, no quiz, and no form. Every CTA is a
`Book a Call` button opening the Calendly link in a new tab. Routes: `/`, `/privacy`,
`/terms`, `/onboarding`.

`/onboarding` and `/admin` are the exceptions and are deliberately not linked from anywhere:
one is a private URL sent to clients after they sign, the other is behind a password. Both
carry `robots: noindex`. Don't add either to a nav or a footer.

### Home sections, in order

Hero → Statement → How It Works (bento) → Why us → Founders → FAQ → Final CTA.

- **Hero** — H1, lead, one ring button. `.aurora` background. The H1 names the offer and the
  deadline outright: "We Will Help Launch Your High-Ticket Webinar Funnel **Within 14 Days**",
  with the deadline as the gold italic. `High-Ticket` is wrapped in `whitespace-nowrap` so the
  compound never breaks across lines. It runs 34px on mobile up to 62px at `lg`, below the
  72px H1 in the scale table, because the line is long.
- **Statement** — gold eyebrow + a 44px two-tone paragraph: the problem clause is dimmed to
  `--text-dim`, the A1 clauses stay white. This is a typographic device, not motion.
- **How It Works** — a bento on a `.plate`: three art-top/text-bottom cards, two wide
  text-and-art cards, then the `Done-For-You …` pill row. Card two is the webinar, which is
  the centre of the offer; don't demote it back to a generic "funnel" card.
- **Why us** (`#why-us`) — Help · Fund · Launch as three columns with 64px **filled**,
  animated glyphs. Hairline icons vanish next to a 28px heading; keep them filled. There is
  no diagram here: the icons carry the motion.
- **Founders** — photo left / bulleted accomplishments right, one row each.
- **FAQ** — accordion in the 760px `max-w-prose` column.

The Maths, Launch Roadmap and Who This Is For were cut when the site moved to this
structure, along with `CeilingChart` and `WeekArc`.

**There is no client proof on the page.** The Clients grid became a Portfolio of client
landing pages, and that was removed in October 2026 along with its screenshots and the
orphaned `/public/clients/` headshots. The only third-party faces left are the four sales
seats in `TeamStack`. If proof comes back, it needs real assets and real figures: nothing
on this site invents a client, a logo or a number.

### Links

`src/lib/site.ts` is the single source of truth: `CAL_LINK` and `CONTACT_EMAIL`. There is no
`SECTIONS` list any more, because neither the header nor the footer carries a nav. Section
ids stay on the markup for deep links.

`CONTACT_EMAIL` is still an `@a1media.info` address, left over from the rebrand. It only
appears in the privacy and terms pages. Swap it when the new mailbox exists.

### Onboarding form

`/onboarding` is a one-question-per-screen form, about 36 screens, defined entirely by
`QUESTIONS` in **`src/lib/onboarding.ts`**. Add a question there and the form, the
validation, the Google Sheet header and the Discord transcript all follow. Nothing about the
question set lives in the components.

- **Two tracks.** The first question forks on whether the client already sells an offer.
  Each question carries `tracks`, and `questionsFor(track)` is what the form walks. Questions
  tagged with both are asked either way.
- **`minChars`** is on the answers the build depends on (the method, the objections, the
  audience's own words). It is the one thing stopping a one-word answer becoming generic
  creative, so don't lower it to make the form faster to finish. `allowNone` lets a client
  past it by typing "none" where having nothing is a legitimate answer.
- **One tab per track**, `Has an offer` (39 columns) and `Building first offer` (38), so no
  row carries empty columns belonging to the other track. `sheetColumns(track)` builds both
  the header and the row, which is what keeps them from drifting apart; `allSheetColumns()`
  is the union, used only for the dashboard's CSV export. Neither tab has a Track column:
  the tab it sits on already says, and `readSubmissions` tags each row from the tab it came
  off. Nothing in the spreadsheet is set up by hand. The first submission of each kind
  creates its tab, writes the header and freezes the top row.
- **The sheet is the record, Discord is the alert.** A Sheets failure returns 502 so the
  form can retry with the answers still in localStorage; a Discord failure only logs. Don't
  flip that around.
- Progress is saved to localStorage under `growingoffers.onboarding.v1` and cleared on
  success. A 36-screen form does not get finished in one sitting.
- Discord gets a summary embed plus the full transcript as a `.md` attachment. It cannot get
  the answers as embed fields: Discord caps a field at 1024 characters and an embed at 6000,
  and rejects the whole payload silently when either is passed.
- Env vars are in `.env.example`. With none set, the route logs a warning and still returns
  200, so the form works in development without credentials.

### Admin dashboard

`/admin` reads the submissions back out of the same Google Sheet the form writes to, which
is why there is no database anywhere in this project. `src/lib/sheets.ts` is the one Sheets
client: `appendRow` for the form, `readSubmissions` for the dashboard.

- **Auth is a password and a signed cookie** (`src/lib/admin-auth.ts`), no dependency and no
  user table. The HMAC key is derived from `ADMIN_PASSWORD` itself, so there is no second
  secret to set and changing the password invalidates every live session. Password checks
  are timing-safe and a wrong one costs a fixed 500ms, which is the only rate limiting
  available without shared state.
- **The gate is in the page, not in middleware**, so the session check and the sheet read
  happen in one request with nothing unprotected in between. Verified: no cookie, a garbage
  cookie, a forged signature and a correctly-signed but expired token are all refused.
- **Columns are matched to the sheet by header label, not by position.** Inserting a column
  by hand in Google Sheets shifts nothing; renaming a header drops that one field.
- The detail view renders from `QUESTIONS` rather than from the row, so answers appear in
  the order they were asked, under their own section headings, with empty ones skipped.

### Assets

Founder headshots at `/public/founders/`; `FounderPhoto` falls back to a gold monogram when
a file is missing. The brand mark is `/public/growingoffers-logo.png`: a stacked `GO` over the wordmark, keyed
to transparency from the supplied black-background source, so it sits on any dark band. It
needs more height than a single-line logo because of the stack: below about 44px the
wordmark stops reading, hence `h-12 md:h-14` in the header.

### Header

**Logo only**, top-left, absolutely positioned over the hero. There is no nav bar and no
header CTA: the page is meant to be scrolled, and the section links live in the footer.
Don't reintroduce a nav here without a reason.

## Copy Rules
- **No em or en dashes anywhere in user-facing copy.** Use a full stop, a comma or a colon.
  Hyphens in compounds (high-ticket, long-form, Done-For-You) are fine.
- Lead with the three verbs: **help, fund, launch**.
- Always be explicit that we pay the ad spend and take revenue share: that is the hook.
- The **10 to 14 day** launch window and the **webinar** are the offer. Say both early.
  Spell the range out in words, never as "10-14", so it survives the no-dashes rule.
- Qualify hard: established organic brand only. Say who this is *not* for.
- Never promise guaranteed results. Note the footer disclaimer was removed at the owner's
  direction in October 2026, so the copy itself has to stay measured.
