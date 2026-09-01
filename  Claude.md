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
| Primary Background   | `#0A0A0A`                    | Main page background                         |
| Secondary Background | `#0D0C0B`                    | Alternating section bands                    |
| Card / Panel         | `#121110`                    | Panels, form fields, image wells             |
| Panel Hover          | `#171613`                    | Hover elevation                              |
| Accent (Champagne)   | `#E3C08D`                    | Emphasis words, eyebrows, rules, CTAs        |
| Accent Glow          | `#F2DCB4`                    | Top of the gold gradient, hover              |
| Accent Deep          | `#C79E58`                    | Bottom of the gold gradient                  |
| Accent Light         | `#F7EAD3`                    | Highlight tint                               |
| Primary Text         | `#FAFAFA`                    | Headlines and lead copy                      |
| Body Text            | `#B5B1AC`                    | Paragraphs                                   |
| Muted Text           | `#7A756D`                    | Labels, captions, "not for you" lists        |
| Border / Hairline    | `rgba(255,255,255,0.08)`     | Section rules, panel edges, dividers         |

Gold is applied as a vertical gradient (`--gold-gradient`), not a flat fill: buttons use
`.btn-gold`, gold text uses `.text-gold` (background-clip). Reference: abundanceofwomen.com.

CSS variables live in `src/app/globals.css`. Accent colors are exposed to Tailwind as
`rgb(var(--accent-channels) / <alpha-value>)`, so `text-accent/25` and `bg-accent/60` work.

## Typography

Everything is serif — there is no sans-serif on this site.

### Font Families
- **Display (h1–h3, `font-serif`):** `Playfair Display`, weight 500 (600 for `<strong>`),
  `letter-spacing: -0.022em`. High-contrast serif — italic is used for emphasis phrases.
- **Body / UI (`font-sans`, `font-text`, body default):** `DM Sans`, 300–700, 16px base.
- **Eyebrow labels:** `.eyebrow` — DM Sans 600, 12px, `letter-spacing: 0.2em`, uppercase, gold.

### Headline emphasis (TikTok-Masterclass style)
Three marks, used sparingly — at most two in one headline:
- `.mark-box` — gold gradient block with near-black text, 10px radius.
- `.mark-underline` — 2px gold underline, 6px offset.
- `.text-gold` + `italic` — gradient gold italic.

### Sizes

| Element            | Family            | Size (Desktop)   | Size (Mobile)  |
| :----------------- | :---------------- | :--------------- | :------------- |
| Hero headline      | Playfair Display  | 44px             | 27px           |
| Section headline   | Playfair Display  | 46px             | 32px           |
| Sub-headline       | Playfair Display  | 30–38px          | 26–30px        |
| Lead paragraph     | DM Sans 300       | 18–19px          | 16–17px        |
| Body text          | DM Sans 300       | 17–18px          | 16–17px        |
| Buttons / nav      | DM Sans 500–600   | 13–15px, uppercase on buttons, `tracking-[0.14em]`    |
| Eyebrow / caption  | DM Sans 600       | 12px, uppercase, `tracking-[0.2em]`                   |

The hero headline is deliberately smaller than the section headlines that follow — the VSL,
not the type, is the thing that has to be visible on landing.

### Line Heights
- Display: `1.04–1.12`
- Body: `1.7–1.8`
- UI: `1.4`

## Layout System

- **Max Content Width:** `1200px` (`max-w-content`); prose sections narrow to 820–1000px.
- **Section Padding:** `96–128px` desktop (`py-24 md:py-32`), `64–80px` mobile.
- **Section Separation:** hairline borders and alternating `#0A0A0A` / `#0D0C0B` bands.
- **Panels:** rounded 14px cards (`.panel`) on a hairline border — soft, not sharp-edged.
- **Header:** floating rounded-full bar, `#121110` at 85% with backdrop blur, anchored to
  in-page sections (`#how-it-works`, `#clients`, `#the-maths`, `#roadmap`, `#faq`, `#schedule`).

## Component Styles

### Buttons
- **Primary (`.btn-gold`):** gold gradient, near-black text `#17120A`, `rounded-full`,
  `px-9 py-4`, 14px uppercase, `tracking-[0.16em]`, soft gold outer glow that intensifies on
  hover.
- **Secondary (`.btn-ghost`):** transparent, `border-white/16`. Hover → gold border + text.

### Panels
- `.panel` (aliases: `.card-dark`, `.card-blue-glow`): `#121110`, 1px hairline, 14px radius.
- Hover: background lifts to `#171613`, border to `rgba(227,192,141,0.30)`, `translateY(-2px)`.

### Infographics
- `src/components/Infographics.tsx` — `SystemDiagram`, `FundingFlow`, `CeilingChart`, `WeekArc`.
- Line art only: gold hairlines, no fills heavier than 16% alpha, Newsreader labels at 11–15px.
  Each sits inside a `.panel` so it reads as a plate, not a background.

### Rules & Marks
- `.rule-accent` — 68×2px gold gradient bar under hero and pivot headlines.
- List bullets are 12–16px yellow hairlines, not dots or icons.
- Emphasis inside headlines: `.text-gold`, often italic.

### Motion
- `AnimatedSection` fades content up 30px on scroll into view. Nothing pulses or loops.
- Backgrounds are static; `.silk-bg` is a fixed radial yellow wash at the top of hero/CTA bands.

## Page Structure (home)

Hero + VSL + CTA + Schedule A Call → Some Of Our Current Clients → About The Founders →
How It Works → Where The Money Comes From → The Maths → Launch Roadmap → Who This Is For →
FAQ → Final CTA.

The hero video is the Vidalytics embed (`src/components/VSL.tsx`) — the loader script runs
via `next/script` at `afterInteractive`, and the embed box is 3:2 (66.67% padding), which is
what `.vsl-wrap` sizes against. A gold CTA sits directly under it and anchors to `#schedule`.

Founder headshots live at `/public/founders/sam-chen.jpg` and
`/public/founders/wiktor-domasat.jpg`. `FounderPhoto` falls back to a gold monogram when a
file is missing, so the layout never breaks while assets are outstanding.

The brand mark is `/public/a1-logo.png` — white artwork on transparency, used in the header
(28–32px tall) and footer (44px). It only works on dark backgrounds; never place it on a
light panel without recolouring.

Booking runs on Calendly: `https://calendly.com/samchen-a1media/call-60`, embedded with
Calendly's dark params (`background_color`, `text_color`, `primary_color`) and prefilled
name/email. `/about` and `/how-it-works` CTAs point at `/#schedule` so every booking passes
through the application first.

The application (`src/components/ScheduleCall.tsx`) sits **directly under the hero video** —
there is only one instance on the page; every CTA anchors to `#schedule`. It runs as a quiz
funnel: one question per screen (name → email → phone → Instagram → YouTube → why you're a
good fit) with a gold progress bar, "Question n of 6", a Back link, Enter-to-advance, and a
Skip label on optional steps. On the last step it POSTs to `/api/apply` with
`formType: "Partner Application"`, then swaps in the scheduler embed with name/email
prefilled. `SCHEDULER_URL` at the top of that file is the single place to swap in Calendly.

Never focus a field on mount — it scrolls the hero video out of view and opens the mobile
keyboard on landing.

The submit is **fire-and-forget** (`keepalive: true`, never awaited): the calendar appears
immediately and the webhook fan-out finishes in the background. Do not reintroduce an
`await` here — the Apps Script round-trip is seconds long and the applicant sat looking at
a "Sending…" button.

### Webhooks
`POST /api/apply` fans every submission out to each configured destination, verbatim, plus
`receivedAt` (ISO 8601) and `source` (hostname). Destinations come from env vars, so adding
an automation needs no code change:

- `APPLICATION_WEBHOOK_URL` — Zapier / Make / n8n catch-hook
- `GOOGLE_SHEETS_WEBHOOK_URL` — Apps Script `/exec` URL (falls back to the existing sheet)

Delivery failures are logged and swallowed; the endpoint always returns `{ success: true,
delivered: [...] }` so a downstream outage can never cost a booking. See `.env.example`.

### Hero rhythm
Measured against the reference page and held at: nav bottom → eyebrow 94px, eyebrow →
headline 28px, headline → rule 44px, rule → video 73px. The player is width-capped
(`min(1100px, 100vw - 96px)`), which puts its top around 62% of the viewport — the same
place the reference puts it. Don't reintroduce height-based sizing to force it above the
fold; it shrank the player badly on 13-inch laptops.

## Copy Rules
- Lead with the three verbs: **help, fund, launch**.
- Always be explicit that A1 pays the ad spend and takes revenue share — that is the hook.
- Qualify hard: established organic brand only. Say who this is *not* for.
- Never promise guaranteed results; the footer disclaimer stands.
