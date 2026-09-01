import { NextResponse } from "next/server";

/**
 * Application intake.
 *
 * POST /api/apply
 *
 * Body (partner application, sent by the homepage quiz funnel):
 *   {
 *     "formType":  "Partner Application",
 *     "name":      "Jane Smith",
 *     "email":     "jane@yourbrand.com",
 *     "phone":     "+44 7700 900000",
 *     "instagram": "@yourhandle",
 *     "youtube":   "youtube.com/@yourchannel",   // may be ""
 *     "fit":       "why they're a good fit…"
 *   }
 *
 * The careers form posts here too, with formType absent and its own fields.
 *
 * Every submission is fanned out to each configured webhook below, verbatim,
 * plus two added fields: `receivedAt` (ISO 8601) and `source` (hostname).
 * Add destinations with env vars — no redeploy of this file needed:
 *
 *   APPLICATION_WEBHOOK_URL   Zapier / Make / n8n catch-hook
 *   GOOGLE_SHEETS_WEBHOOK_URL Google Apps Script exec URL
 */

const GOOGLE_SHEETS_URL_FALLBACK =
  "https://script.google.com/macros/s/AKfycbydW60qra8EUNSgcWa0MRmKmWqrhZtYn8phv92__w5ARwKuWpXRzppRgz0f9Hjo4SMChw/exec";

function destinations(): { name: string; url: string }[] {
  const list = [
    { name: "automation", url: process.env.APPLICATION_WEBHOOK_URL },
    { name: "sheets", url: process.env.GOOGLE_SHEETS_WEBHOOK_URL || GOOGLE_SHEETS_URL_FALLBACK },
  ];
  return list.filter((d): d is { name: string; url: string } => Boolean(d.url));
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const payload = {
      ...data,
      receivedAt: new Date().toISOString(),
      source: request.headers.get("host") ?? "unknown",
    };

    console.log("═══ APPLICATION ═══\n" + JSON.stringify(payload, null, 2));

    const targets = destinations();
    const results = await Promise.allSettled(
      targets.map((target) =>
        fetch(target.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ),
    );

    const delivered: string[] = [];
    results.forEach((result, i) => {
      const { name } = targets[i];
      if (result.status === "fulfilled" && result.value.ok) {
        delivered.push(name);
      } else {
        const reason = result.status === "rejected" ? result.reason : `HTTP ${result.value.status}`;
        console.error(`Webhook "${name}" failed:`, reason);
      }
    });

    // The applicant is already on the calendar step — never fail their booking
    // because a downstream webhook was down.
    return NextResponse.json({ success: true, delivered });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 });
  }
}
