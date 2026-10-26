/* The onboarding question set, and the single source of truth for it. The form
   component, the validation and the Google Sheet header row are all derived
   from this array, so adding a question here is the whole change.

   Two tracks. The first question forks them: a creator who already sells
   something answers about what exists, a creator building their first offer
   answers about what they could deliver. Questions tagged with both tracks are
   asked either way. Copy follows CLAUDE.md: no em or en dashes, and the help
   line carries the specificity we actually need. */

export type Track = "has-offer" | "building";

export const TRACKS: Track[] = ["has-offer", "building"];

export type QuestionType = "short" | "long" | "choice" | "socials" | "contact";

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

export interface Question {
  id: string;
  section: string;
  label: string;
  help?: string;
  type: QuestionType;
  tracks: Track[];
  required: boolean;
  /* Minimum characters on the answers the build actually depends on. One-word
     answers to these produce a generic funnel, which is the whole reason the
     floor exists. */
  minChars?: number;
  /* Lets a client out of the minimum by typing "none", for the questions where
     having nothing is a legitimate answer rather than laziness. */
  allowNone?: boolean;
  placeholder?: string;
  choices?: Choice[];
}

export interface SocialRow {
  platform: string;
  url: string;
  followers: string;
}

export interface ContactValue {
  name: string;
  email: string;
  phone: string;
}

export type AnswerValue = string | SocialRow[] | ContactValue;

export type Answers = Record<string, AnswerValue>;

export const SOCIAL_PLATFORMS = [
  "Instagram",
  "YouTube",
  "TikTok",
  "X / Twitter",
  "LinkedIn",
  "Facebook",
  "Skool",
  "Discord",
  "Podcast",
  "Email list",
  "Website",
  "Other",
];

export const emptySocialRow = (): SocialRow => ({
  platform: "",
  url: "",
  followers: "",
});

export const TRACK_QUESTION_ID = "track";

const BOTH: Track[] = ["has-offer", "building"];
const HAS: Track[] = ["has-offer"];
const NEW: Track[] = ["building"];

export const QUESTIONS: Question[] = [
  /* ─── The fork ──────────────────────────────────────────────────────────── */
  {
    id: TRACK_QUESTION_ID,
    section: "Where you are",
    label: "Which of these is you?",
    help: "This changes the questions we ask next, so pick the closer one.",
    type: "choice",
    tracks: BOTH,
    required: true,
    choices: [
      {
        value: "has-offer",
        label: "I already have an offer I am selling",
        hint: "A programme, a community, coaching, an agency service, a course.",
      },
      {
        value: "building",
        label: "I am looking to build my first offer",
        hint: "You have an audience and no high-ticket offer behind it yet.",
      },
    ],
  },

  /* ─── You and your audience ─────────────────────────────────────────────── */
  {
    id: "business_name",
    section: "You and your audience",
    label: "What is your business or brand name?",
    type: "short",
    tracks: BOTH,
    required: true,
    placeholder: "The name people know you by",
  },
  {
    id: "sell_to",
    section: "You and your audience",
    label: "Who do you sell to?",
    type: "choice",
    tracks: BOTH,
    required: true,
    choices: [
      { value: "b2b", label: "Businesses (B2B)" },
      { value: "b2c", label: "Consumers (B2C)" },
      { value: "both", label: "Both" },
    ],
  },
  {
    id: "ideal_customer",
    section: "You and your audience",
    label: "Who is your ideal customer?",
    help: "Who they are and what they do, in a sentence or two.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 80,
  },
  {
    id: "customer_situation",
    section: "You and your audience",
    label: "What is your ideal customer's situation right now?",
    help: "What they have already tried, and why they are still stuck. The more real this is, the better the creative gets.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 140,
  },
  {
    id: "audience_asks",
    section: "You and your audience",
    label: "What do people come to you for help with most?",
    help: "The thing your DMs, comments and replies keep asking about.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 80,
  },
  {
    id: "socials",
    section: "You and your audience",
    label: "Where do you get your audience and clients from today?",
    help: "Add a row per platform you are active on. Include the ones that bring in buyers, not just the ones with the biggest numbers.",
    type: "socials",
    tracks: BOTH,
    required: true,
  },

  /* ─── Your offer: already selling ───────────────────────────────────────── */
  {
    id: "current_offer",
    section: "Your offer",
    label: "What do you sell right now, and at what price?",
    help: "List each thing you sell, with its price.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 40,
  },
  {
    id: "revenue_90",
    section: "Your offer",
    label: "How much revenue did you do in the last 90 days?",
    type: "short",
    tracks: HAS,
    required: true,
    placeholder: "For example 40,000 across two offers",
  },
  {
    id: "outcome",
    section: "Your offer",
    label: "What is the one outcome your offer delivers?",
    help: "One sentence. The result a buyer is actually paying for.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 80,
  },
  {
    id: "top_outcomes",
    section: "Your offer",
    label: "What are the top 3 results your best buyers want most?",
    help: "In their words, not yours. These become the headline the whole funnel is built around.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 120,
  },
  {
    id: "deliverables",
    section: "Your offer",
    label: "What exactly do buyers get? List each thing included.",
    help: "Calls, community, templates, done-for-you work, support. Only what is real.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 140,
  },
  {
    id: "method",
    section: "Your offer",
    label: "What is your method, step by step?",
    help: "What each step is and why it matters, not how to do it. Three steps minimum.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 200,
  },
  {
    id: "offer_limits",
    section: "Your offer",
    label: "What can your offer not fix, and who is it not for?",
    help: "Being specific here keeps the wrong buyers out of your calendar.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 80,
  },

  /* ─── Your offer: building the first one ────────────────────────────────── */
  {
    id: "monetise_now",
    section: "Your offer idea",
    label: "How do you monetise your audience today?",
    help: "Brand deals, a Skool community, a low-ticket course, affiliate income, nothing yet.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 40,
  },
  {
    id: "revenue_90_building",
    section: "Your offer idea",
    label: "How much revenue did you do in the last 90 days, from all sources?",
    help: "Including brand deals and sponsorships. A rough split is fine.",
    type: "short",
    tracks: NEW,
    required: true,
    placeholder: "For example 12,000, mostly brand deals",
  },
  {
    id: "own_result",
    section: "Your offer idea",
    label: "What result have you achieved yourself that your audience wants?",
    help: "With numbers and a timeframe. This is usually the foundation of the offer.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 120,
  },
  {
    id: "helped_someone",
    section: "Your offer idea",
    label: "Have you ever helped someone else get that result, paid or unpaid?",
    help: "What did you do with them, and what happened? Type \"none\" if you have not yet.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 120,
    allowNone: true,
  },
  {
    id: "could_deliver",
    section: "Your offer idea",
    label: "What outcome do you believe you could reliably deliver, and in what timeframe?",
    help: "Reliably means for most people who do the work, not for the best case.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 120,
  },
  {
    id: "method_draft",
    section: "Your offer idea",
    label: "If you had to teach it, what would your method be, step by step?",
    help: "Three steps minimum, with why each one matters. It does not need to be tested yet.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 200,
  },
  {
    id: "delivery_limits",
    section: "Your offer idea",
    label: "What are you not willing to do as part of delivery?",
    help: "One-to-one calls, done-for-you work, weekend support, anything else. Say it now and the offer gets built around it.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 60,
  },

  /* ─── Proof ─────────────────────────────────────────────────────────────── */
  {
    id: "testimonials",
    section: "Proof",
    label: "Paste everything you have that works as proof.",
    help: "One per line. For client results: name, what they achieved, over what period. If you are starting out, your own results, DMs from people you have helped and unpaid wins all count. Type \"none\" if you have nothing yet.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 140,
    allowNone: true,
  },
  {
    id: "case_study",
    section: "Proof",
    label: "Walk us through one journey in full.",
    help: "A client if you have one, otherwise your own: where they started, what they did at each step, where they are now.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 200,
  },
  {
    id: "proof_assets",
    section: "Proof",
    label: "What proof do you hold, and do you have permission to use it in ads?",
    help: "Screenshots, DMs, dashboards, reviews, filmed testimonials. Tell us what exists and where it lives.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 80,
    allowNone: true,
  },
  {
    id: "credibility",
    section: "Proof",
    label: "What makes you credible?",
    help: "Years doing this, people helped, certifications, press, awards. Checkable things only.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 80,
  },
  {
    id: "undocumentable",
    section: "Proof",
    label: "Is there anything you claim publicly that you cannot document?",
    help: "Cheaper to drop it now than to lose an ad account over it. \"Nothing\" is a fine answer if it is true.",
    type: "long",
    tracks: BOTH,
    required: true,
  },

  /* ─── Selling: already selling ──────────────────────────────────────────── */
  {
    id: "sell_how",
    section: "Selling",
    label: "How do you sell today?",
    help: "DMs, calls, checkout, in person, or a mix. Walk the steps.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 60,
  },
  {
    id: "call_rates",
    section: "Selling",
    label: "Your show rate and close rate on calls over the last 90 days.",
    help: "If you do not track them, say so rather than guessing.",
    type: "short",
    tracks: HAS,
    required: true,
    placeholder: "For example 70% show, 25% close",
  },
  {
    id: "who_closes",
    section: "Selling",
    label: "Who takes the sales calls, and will that continue?",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 40,
  },
  {
    id: "objections",
    section: "Selling",
    label: "The top 5 objections you hear, in the prospect's words.",
    help: "Their phrasing, not a tidied-up version of it.",
    type: "long",
    tracks: HAS,
    required: true,
    minChars: 140,
  },

  /* ─── Selling: building the first offer ─────────────────────────────────── */
  {
    id: "sold_before",
    section: "Selling",
    label: "What is the most you have ever sold something for, and how did you sell it?",
    help: "Any product, service or brand deal. Include how the conversation happened.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 80,
  },
  {
    id: "will_close",
    section: "Selling",
    label: "Are you willing to take sales calls yourself to start?",
    help: "Most first launches need the founder on the calls for the first few weeks.",
    type: "choice",
    tracks: NEW,
    required: true,
    choices: [
      { value: "yes", label: "Yes, I will take the calls" },
      { value: "some", label: "Some of them, with help" },
      { value: "no", label: "No, I need someone else to close" },
    ],
  },
  {
    id: "objections_expected",
    section: "Selling",
    label: "What do you expect people's top objections to be?",
    help: "Think about what your audience already says when you mention paying for help.",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 120,
  },

  /* ─── Delivery and capacity ─────────────────────────────────────────────── */
  {
    id: "who_delivers",
    section: "Delivery and capacity",
    label: "Who would deliver the offer, and how many hours a month can each person give?",
    help: "Name everyone involved, including yourself.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 60,
  },
  {
    id: "capacity",
    section: "Delivery and capacity",
    label: "How many clients can you serve at once before quality drops?",
    help: "The real number, not the hopeful one. We build the launch around it.",
    type: "short",
    tracks: BOTH,
    required: true,
    placeholder: "For example 15",
  },
  {
    id: "churn",
    section: "Delivery and capacity",
    label: "Your refund rate and churn over the last 6 months.",
    type: "short",
    tracks: HAS,
    required: true,
    placeholder: "For example 4% refunds, 10% monthly churn",
  },
  {
    id: "delivery_gap",
    section: "Delivery and capacity",
    label: "What is the first thing you would need help with once clients start arriving?",
    type: "long",
    tracks: NEW,
    required: true,
    minChars: 40,
  },

  /* ─── Money and tracking ────────────────────────────────────────────────── */
  {
    id: "ads_history",
    section: "Money and tracking",
    label: "Have you run paid ads?",
    help: "Platforms, total spend, the best cost per acquisition you reached, and any account restrictions or bans, ever. A flagged account changes the launch plan, so include it even if it was years ago.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 40,
  },
  {
    id: "payments",
    section: "Money and tracking",
    label: "Where do payments land, and has a processor ever held your funds or closed your account?",
    help: "Which processor you use, and anything that has gone wrong with it.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 40,
  },
  {
    id: "tracking",
    section: "Money and tracking",
    label: "What are you tracking with today?",
    help: "A pixel, GA4, a CRM, a spreadsheet, or nothing. Tell us what is already installed.",
    type: "long",
    tracks: BOTH,
    required: true,
  },
  {
    id: "revenue_scope",
    section: "Money and tracking",
    label: "Is there any revenue you would consider outside the revenue share?",
    help: "Define it now, specifically. Existing clients, brand deals, other businesses. Settling this before launch is cheaper than settling it after a good month.",
    type: "long",
    tracks: BOTH,
    required: true,
  },

  /* ─── Creative ──────────────────────────────────────────────────────────── */
  {
    id: "best_content",
    section: "Creative",
    label: "Link your 5 best-performing posts or videos, with their numbers.",
    help: "One per line, with views or engagement. These tell us which angles already work on your audience.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 60,
  },
  {
    id: "filming",
    section: "Creative",
    label: "How much can you film per week, and can you work to a script?",
    help: "Creative volume is what decides how far the spend scales, so give the realistic number.",
    type: "long",
    tracks: BOTH,
    required: true,
    minChars: 40,
  },
  {
    id: "camera_limits",
    section: "Creative",
    label: "What will you not say or do on camera?",
    help: "Topics, claims, framings, anything involving income or family. Hard no's are useful.",
    type: "long",
    tracks: BOTH,
    required: true,
  },

  /* ─── Goals ─────────────────────────────────────────────────────────────── */
  {
    id: "target",
    section: "Goals",
    label: "What is your revenue target in 90 days, and how many clients is that?",
    type: "short",
    tracks: BOTH,
    required: true,
    placeholder: "For example 100,000 a month, about 20 clients",
  },
  {
    id: "hours",
    section: "Goals",
    label: "How many hours a week can you give this?",
    help: "The honest number. We would rather build around 6 real hours than 20 imaginary ones.",
    type: "short",
    tracks: BOTH,
    required: true,
    placeholder: "For example 8",
  },

  /* ─── Contact ───────────────────────────────────────────────────────────── */
  {
    id: "contact",
    section: "Where to send things",
    label: "Where should we reach you?",
    help: "This goes to the person who will be in the build with us day to day.",
    type: "contact",
    tracks: BOTH,
    required: true,
  },
  {
    id: "anything_else",
    section: "Where to send things",
    label: "Anything we have not asked that we should know?",
    help: "Including the thing you were not sure whether to mention. Optional.",
    type: "long",
    tracks: BOTH,
    required: false,
  },
];

/* The questions a given track actually sees. Before the fork is answered the
   form shows the fork alone, which is what makes the progress count honest. */
export function questionsFor(track: Track | null): Question[] {
  if (!track) return QUESTIONS.filter((q) => q.id === TRACK_QUESTION_ID);
  return QUESTIONS.filter(
    (q) => q.id === TRACK_QUESTION_ID || q.tracks.includes(track),
  );
}

export const NONE_ANSWERS = ["none", "n/a", "na", "nothing", "no"];

function isNone(value: string): boolean {
  return NONE_ANSWERS.includes(value.trim().toLowerCase());
}

export function isSocialRowFilled(row: SocialRow): boolean {
  return row.platform.trim() !== "" && row.url.trim() !== "";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Returns an error string, or null when the answer passes. Used by the form on
   every step and again by the API route, so a client with scripting quirks
   cannot post an empty record. */
export function validateAnswer(
  question: Question,
  value: AnswerValue | undefined,
): string | null {
  if (question.type === "socials") {
    const rows = Array.isArray(value) ? (value as SocialRow[]) : [];
    const filled = rows.filter(isSocialRowFilled);
    if (filled.length === 0) {
      return "Add at least one platform, with a link.";
    }
    return null;
  }

  if (question.type === "contact") {
    const contact = (value ?? {}) as ContactValue;
    if (!contact.name?.trim()) return "We need a name.";
    if (!contact.email?.trim()) return "We need an email address.";
    if (!EMAIL_RE.test(contact.email.trim())) {
      return "That email address does not look right.";
    }
    return null;
  }

  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    return question.required ? "This one is required." : null;
  }

  if (question.id === TRACK_QUESTION_ID || question.type === "choice") {
    const valid = (question.choices ?? []).some((c) => c.value === text);
    return valid ? null : "Pick one of the options.";
  }

  if (question.minChars && text.length < question.minChars) {
    if (question.allowNone && isNone(text)) return null;
    const short = question.minChars - text.length;
    return `A bit more detail please: ${short} more character${short === 1 ? "" : "s"}. Short answers here produce generic creative.`;
  }

  return null;
}

export function firstInvalidIndex(
  questions: Question[],
  answers: Answers,
): number {
  return questions.findIndex((q) => validateAnswer(q, answers[q.id]) !== null);
}

/* ─── Flattening, for the sheet ───────────────────────────────────────────── */

/* The sheet keeps one stable column set covering both tracks, so a has-offer
   row and a building row land in the same shape and the columns never shift
   under existing data. Derived from QUESTIONS, which means the header and the
   row can never disagree. */
export interface SheetColumn {
  key: string;
  label: string;
}

/* One tab per track, so each sheet carries only its own questions and nobody
   scrolls past eleven empty columns belonging to the other track. The tab names
   are what a person sees on the tab strip, so they read as English. */
export const TAB_NAMES: Record<Track, string> = {
  "has-offer": "Has an offer",
  building: "Building first offer",
};

function columnsForQuestions(questions: Question[]): SheetColumn[] {
  const columns: SheetColumn[] = [];

  for (const q of questions) {
    if (q.id === TRACK_QUESTION_ID) continue;
    if (q.type === "contact") {
      columns.push(
        { key: "contact_name", label: "Name" },
        { key: "contact_email", label: "Email" },
        { key: "contact_phone", label: "Phone" },
      );
      continue;
    }
    columns.push({ key: q.id, label: q.label });
  }

  return columns;
}

/* A single track's tab. No Track column: the tab it sits on already says. */
export function sheetColumns(track: Track): SheetColumn[] {
  return [
    { key: "submitted_at", label: "Submitted at" },
    ...columnsForQuestions(questionsFor(track)),
  ];
}

/* Both tracks in one column set, for the dashboard's CSV export, where a
   filtered list can hold rows from either tab. */
export function allSheetColumns(): SheetColumn[] {
  return [
    { key: "submitted_at", label: "Submitted at" },
    { key: "track", label: "Track" },
    ...columnsForQuestions(QUESTIONS),
  ];
}

export function formatSocials(rows: SocialRow[]): string {
  return rows
    .filter(isSocialRowFilled)
    .map((r) =>
      [r.platform, r.url, r.followers].filter((part) => part.trim()).join(" | "),
    )
    .join("\n");
}

const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

/* Choice answers are stored as their machine value, so they get resolved back
   to the label before anything human reads them in the sheet or in Discord. */
export function answerToCell(id: string, value: AnswerValue | undefined): string {
  if (value == null) return "";
  if (Array.isArray(value)) return formatSocials(value);
  if (typeof value !== "string") return "";

  const question = QUESTION_BY_ID.get(id);
  if (question?.type === "choice") {
    return question.choices?.find((c) => c.value === value)?.label ?? value;
  }
  return value;
}

export function toSheetRow(answers: Answers, submittedAt: string): string[] {
  const track = (answers[TRACK_QUESTION_ID] as Track | undefined) ?? "has-offer";
  const contact = (answers.contact ?? {}) as ContactValue;

  return sheetColumns(track).map((column) => {
    switch (column.key) {
      case "submitted_at":
        return submittedAt;
      case "contact_name":
        return contact.name ?? "";
      case "contact_email":
        return contact.email ?? "";
      case "contact_phone":
        return contact.phone ?? "";
      default:
        return answerToCell(column.key, answers[column.key]);
    }
  });
}

/* The full transcript, which goes to Discord as an attachment because 35
   answers will not fit in an embed. */
export function toTranscript(answers: Answers, submittedAt: string): string {
  const track = (answers[TRACK_QUESTION_ID] as Track | undefined) ?? null;
  const contact = (answers.contact ?? {}) as ContactValue;
  const lines: string[] = [
    `# Onboarding: ${(answers.business_name as string) || "Unnamed"}`,
    "",
    `Submitted: ${submittedAt}`,
    `Track: ${track === "has-offer" ? "Already has an offer" : "Building first offer"}`,
    `Contact: ${contact.name ?? ""} / ${contact.email ?? ""} / ${contact.phone ?? ""}`,
    "",
  ];

  let section = "";
  for (const q of questionsFor(track)) {
    if (q.id === TRACK_QUESTION_ID || q.type === "contact") continue;
    if (q.section !== section) {
      section = q.section;
      lines.push("", `## ${section}`, "");
    }
    const answer = answerToCell(q.id, answers[q.id]).trim();
    lines.push(`**${q.label}**`, "", answer || "(no answer)", "");
  }

  return lines.join("\n");
}
