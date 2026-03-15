# CLAUDE.md — A1 Media Style Guide

## Brand Identity
- **Brand Name:** A1 Media
- **Tone:** Confident, direct, results-driven. No fluff. Speak to creators and influencers who want to scale — not beginners who need hand-holding.
- **Voice:** Professional but not corporate. Sharp, modern, high-energy.

## Brand Colors

| Name                 | Hex Code   | Usage                                              |
| :------------------- | :--------- | :------------------------------------------------- |
| Primary Background   | `#08090E`  | Main page background                               |
| Secondary Background | `#11131A`  | Cards, sections, footer                            |
| Tertiary Background  | `#1A1D27`  | Hover states, subtle elevation                     |
| Primary Accent       | `#2D7AFF`  | CTAs, key headlines, active states, links           |
| Accent Glow          | `#5B9CFF`  | Hover states on accent, subtle glows, highlights   |
| Accent Light         | `#A3C4FF`  | Subtle text highlights, badge text                 |
| Primary Text         | `#FFFFFF`  | Headlines, primary content                         |
| Secondary Text       | `rgba(255, 255, 255, 0.55)` | Body paragraphs, descriptions         |
| Muted Text           | `rgba(255, 255, 255, 0.35)` | Captions, labels, fine print           |
| Success              | `#4ADE80`  | Positive indicators, checkmarks                    |
| Error                | `#E05C5C`  | Negative indicators, X marks                       |
| Border               | `rgba(255, 255, 255, 0.08)` | Card borders, dividers                 |

## Typography

### Font Families
- **Headings:** `Inter`, sans-serif (weight 700–800)
- **Body/UI:** `Inter`, sans-serif (weight 400–500)
- **Accent/Display (optional):** `Plus Jakarta Sans`, sans-serif — for hero headlines if a slightly different feel is desired

### Font Sizes & Weights

| Element            | Font Family        | Weight   | Size (Desktop)  | Size (Mobile)  |
| :----------------- | :----------------- | :------- | :-------------- | :------------- |
| Hero Headline      | `Inter`            | 800      | 56px–72px       | 32px–40px      |
| Section Headline   | `Inter`            | 700      | 40px–48px       | 28px–32px      |
| Sub-headline       | `Inter`            | 600      | 20px–24px       | 18px–20px      |
| Body Text          | `Inter`            | 400      | 16px–18px       | 15px–16px      |
| UI / Buttons       | `Inter`            | 600      | 14px–16px       | 14px           |
| Captions / Labels  | `Inter`            | 500      | 12px–14px       | 12px           |

### Line Heights
- Headlines: `1.15–1.25`
- Body text: `1.6–1.7`
- UI elements: `1.4`

## Spacing System

- **Max Content Width:** `1200px`
- **Section Vertical Padding:** `100px–120px` desktop, `60px–80px` mobile
- **Card Padding:** `32px–40px`
- **Element Spacing (within sections):** `24px–32px`
- **Component Gap (buttons, badges):** `12px–16px`

## Component Styles

### Buttons
- **Primary CTA:** Background `#2D7AFF`, Text `#FFFFFF`, Padding `14px 28px`, Border-radius `8px`, Font-weight `600`, Font-size `16px`. Hover: Background shifts to `#5B9CFF`, subtle box-shadow glow `0 0 20px rgba(45, 122, 255, 0.3)`.
- **Secondary CTA:** Background `transparent`, Border `1px solid rgba(255, 255, 255, 0.15)`, Text `#FFFFFF`. Hover: Border `1px solid #2D7AFF`, Text `#2D7AFF`.
- **Ghost Button:** Background `transparent`, Text `#2D7AFF`, underline on hover.

### Cards
- Background: `#11131A`
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Border-radius: `12px`
- Padding: `32px`
- Hover: Border shifts to `rgba(45, 122, 255, 0.2)`, subtle elevation

### Navigation
- **Sticky Header:** Fixed top, background `rgba(8, 9, 14, 0.85)` with `backdrop-filter: blur(12px)` on scroll.
- **Links:** `#FFFFFF` at `rgba(255, 255, 255, 0.7)`, hover to full white.
- **Active Link:** `#2D7AFF`
- **CTA in Nav:** Primary button style, slightly smaller padding.

### FAQ Accordions
- Question: `Inter` 600, `#FFFFFF`, clickable full-width row
- Answer: `Inter` 400, secondary text color
- Divider: `1px solid rgba(255, 255, 255, 0.08)` between items
- Open indicator: Rotate chevron icon, accent color when open

### Ticker / Scrolling Bar
- Background: `#11131A` or accent gradient strip
- Text: `Inter` 500, `#FFFFFF` or accent color
- Continuous horizontal scroll animation

### Section Labels
- Uppercase, `Inter` 600, `12px–13px`, letter-spacing `0.1em`, color `#2D7AFF`
- Used above section headlines to categorize content

## General Design Rules

1. **Dark mode only.** No light mode toggle needed.
2. **High contrast.** White text on dark backgrounds. Accent blue for emphasis only — don't overuse it.
3. **Clean and minimal.** Generous whitespace between sections. Let the content breathe.
4. **No stock photography.** Use geometric patterns, subtle gradients, or abstract shapes for visual interest if needed. Real photos only for founder/results.
5. **Responsive first.** Every section must work on mobile. Stack side-by-side layouts vertically on small screens.
6. **Subtle motion.** Scroll-triggered fade-ins, hover state transitions (200–300ms ease). No heavy animations.
7. **Consistent CTAs.** Every major section should end with a clear call to action driving to the application.
8. **Semantic HTML.** Use proper heading hierarchy (h1–h4), landmark elements, and ARIA labels where appropriate.

## File Structure Notes
- Use Next.js with TypeScript and Tailwind CSS
- Shared layout component for header + footer across all pages
- All pages use the same design system — no page should feel like a different site
- Google Fonts: Import `Inter` (400, 500, 600, 700, 800)
