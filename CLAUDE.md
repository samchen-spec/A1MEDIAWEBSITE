# CLAUDE.md — A1 Media Style Guide

## Brand Identity
- **Brand Name:** A1 Media (site: growingoffers.com)
- **Positioning:** We help, fund & launch creators. We craft an established creator a
  high-ticket offer from start to finish, then pay for the ad spend ourselves to scale it.
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

`src/components/TeamStack.tsx` — the placed sales seats. A seat with `src: null` renders a
monogram, so the card looks finished with no photos in place and the browser never requests
a file that isn't there. See `public/team/README.md`. Only real staff photos go here.

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

Informational only — no VSL, no form, no quiz. Every CTA is a `Book a Call` button opening
the Calendly link in a new tab. Routes: `/`, `/privacy`, `/terms`.

### Home sections, in order

Hero → Statement → How It Works (bento) → Why A1 → Founders → Portfolio → FAQ → Final CTA.

- **Hero** — H1, lead, ring button + ghost button. `.aurora` background.
- **Statement** — gold eyebrow + a 44px two-tone paragraph: the problem clause is dimmed to
  `--text-dim`, the A1 clauses stay white. This is a typographic device, not motion.
- **How It Works** — a bento on a `.plate`: three art-top/text-bottom cards, two wide
  text-only cards, then the `Done-For-You …` pill row.
- **Why A1** — the animated `PipelineLoop`, then Help · Fund · Launch as three columns with
  40px **filled** glyphs. Hairline icons vanish next to a 28px heading; keep them filled.
- **Founders** — photo left / bulleted accomplishments right, one row each.
- **Portfolio** — live client landing pages, **one per row**, capped at 880px so they read as
  a showcase rather than a wall. **Brand name only** underneath, and **no outbound links**:
  sending traffic off the page is the one thing this section shouldn't do. Screenshots live
  in `/public/portfolio/`, captured at 1440×900 with the VSL playing so the creator is on
  screen and consent banners dismissed, then resized to 1600px JPEG. Recapture when a
  client's page changes. No revenue figures anywhere: don't invent them.
- **FAQ** — accordion in the 760px `max-w-prose` column.

The Maths, Launch Roadmap and Who This Is For were cut when the site moved to this
structure, along with `CeilingChart` and `WeekArc`.

### Links

`src/lib/site.ts` is the single source of truth: `CAL_LINK`, `CONTACT_EMAIL`, and `SECTIONS`
(the in-page anchors shared by the header and footer navs).

### Assets

Founder headshots at `/public/founders/`; `FounderPhoto` falls back to a gold monogram when
a file is missing. The brand mark `/public/a1-logo.png` is white on transparency — dark
backgrounds only.

### Header

**Logo only**, top-left, absolutely positioned over the hero. There is no nav bar and no
header CTA: the page is meant to be scrolled, and the section links live in the footer.
Don't reintroduce a nav here without a reason.

## Copy Rules
- **No em or en dashes anywhere in user-facing copy.** Use a full stop, a comma or a colon.
  Hyphens in compounds (high-ticket, long-form, Done-For-You) are fine.
- Lead with the three verbs: **help, fund, launch**.
- Always be explicit that A1 pays the ad spend and takes revenue share — that is the hook.
- Qualify hard: established organic brand only. Say who this is *not* for.
- Never promise guaranteed results; the footer disclaimer stands.
