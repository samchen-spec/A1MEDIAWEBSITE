import { NextResponse } from "next/server";
import { saveSubmission, storeConfigured } from "@/lib/store";
import {
  TRACK_QUESTION_ID,
  TRACKS,
  questionsFor,
  answerToCell,
  toTranscript,
  validateAnswer,
  type Answers,
  type ContactValue,
  type Track,
} from "@/lib/onboarding";

/* google-auth-library signs the service account assertion with node crypto, so
   this cannot run on the edge runtime. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256 * 1024;

/* ─── Discord ─────────────────────────────────────────────────────────────── */

function truncate(value: string, limit: number): string {
  const text = value.trim();
  if (!text) return "Not given";
  return text.length > limit ? `${text.slice(0, limit - 3)}...` : text;
}

/* A short embed for the channel, with the full transcript attached. 35 answers
   will not fit in an embed: Discord caps a field at 1024 characters and an
   embed at 6000, and silently rejects the whole payload when either is passed. */
async function notifyDiscord(
  answers: Answers,
  track: Track,
  submittedAt: string,
): Promise<"sent" | "skipped"> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    console.warn("[onboarding] Discord webhook is not configured; no alert sent");
    return "skipped";
  }

  const contact = (answers.contact ?? {}) as ContactValue;
  const business = truncate((answers.business_name as string) ?? "", 240);
  const revenue =
    (answers.revenue_90 as string) ?? (answers.revenue_90_building as string) ?? "";

  const embed = {
    title: `New onboarding: ${business}`,
    color: 0xe3c08d,
    fields: [
      {
        name: "Track",
        value:
          track === "has-offer"
            ? "Already selling an offer"
            : "Building their first offer",
        inline: true,
      },
      {
        name: "Sells to",
        value: truncate(answerToCell("sell_to", answers.sell_to), 60),
        inline: true,
      },
      { name: "Revenue, last 90 days", value: truncate(revenue, 200), inline: true },
      { name: "90 day target", value: truncate((answers.target as string) ?? "", 300), inline: true },
      { name: "Capacity", value: truncate((answers.capacity as string) ?? "", 200), inline: true },
      { name: "Hours a week", value: truncate((answers.hours as string) ?? "", 100), inline: true },
      {
        name: "Contact",
        value: truncate(
          [contact.name, contact.email, contact.phone].filter(Boolean).join(" / "),
          500,
        ),
      },
      {
        name: "What they are known for",
        value: truncate((answers.audience_asks as string) ?? "", 900),
      },
    ],
    footer: { text: `Submitted ${submittedAt}` },
  };

  const slug =
    business.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
    "client";

  const form = new FormData();
  form.append("payload_json", JSON.stringify({ embeds: [embed] }));
  form.append(
    "files[0]",
    new Blob([toTranscript(answers, submittedAt)], { type: "text/markdown" }),
    `onboarding-${slug}.md`,
  );

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    throw new Error(
      `Discord webhook ${res.status}: ${(await res.text()).slice(0, 300)}`,
    );
  }
  return "sent";
}

/* ─── Handler ─────────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "That submission is too large." }, { status: 413 });
  }

  let payload: { track?: unknown; answers?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "We could not read that submission." }, { status: 400 });
  }

  const answers = (payload.answers ?? {}) as Answers;
  const track = answers[TRACK_QUESTION_ID] as Track | undefined;

  if (!track || !TRACKS.includes(track)) {
    return NextResponse.json(
      { error: "Pick whether you already have an offer before submitting." },
      { status: 400 },
    );
  }

  /* Revalidated here against the same rules the form uses, so a submission that
     skipped the client cannot land a half-empty row in the sheet. */
  for (const question of questionsFor(track)) {
    const problem = validateAnswer(question, answers[question.id]);
    if (problem) {
      return NextResponse.json(
        { error: `${question.label} ${problem}`, questionId: question.id },
        { status: 422 },
      );
    }
  }

  const submittedAt = new Date().toISOString();

  /* The blob store is the record, so a failure there fails the request and the
     form keeps the answers for a retry. Discord is only the alert: if it
     breaks, the submission still counts and the problem goes to the logs. */
  if (storeConfigured()) {
    try {
      await saveSubmission(track, answers, submittedAt);
    } catch (e) {
      console.error("[onboarding] Could not save the submission", e);
      return NextResponse.json(
        { error: "We could not save your answers just now. Please try again." },
        { status: 502 },
      );
    }
  } else {
    console.warn("[onboarding] No blob store configured; submission not saved");
  }

  let discord: "sent" | "skipped" | "failed" = "skipped";
  try {
    discord = await notifyDiscord(answers, track, submittedAt);
  } catch (e) {
    discord = "failed";
    console.error("[onboarding] Discord notification failed", e);
  }

  return NextResponse.json({ ok: true, discord });
}
