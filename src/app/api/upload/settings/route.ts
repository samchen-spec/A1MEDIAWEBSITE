import { NextResponse } from "next/server";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import {
  loadSettings,
  publicSettings,
  saveSettings,
  storeConfigured,
  type StoredSettings,
} from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore(): NextResponse {
  return NextResponse.json(
    { error: "No Blob store is connected, so settings cannot be saved." },
    { status: 503 },
  );
}

export async function GET() {
  if (!signedIn()) return unauthorized();
  if (!storeConfigured()) return noStore();

  try {
    return NextResponse.json({ settings: publicSettings(await loadSettings()) });
  } catch (e) {
    return failed("read your settings", e);
  }
}

export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();
  if (!storeConfigured()) return noStore();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const str = (value: unknown): string | null =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

  try {
    const current = await loadSettings();

    /* An omitted or blank token leaves the saved one alone, so changing the ad
       account does not mean pasting the token again. */
    const incoming = str(body.accessToken);

    const next: StoredSettings = {
      accessToken: incoming ?? current.accessToken,
      adAccountId: "adAccountId" in body ? str(body.adAccountId) : current.adAccountId,
      adAccountName:
        "adAccountName" in body ? str(body.adAccountName) : current.adAccountName,
      pageId: "pageId" in body ? str(body.pageId) : current.pageId,
      pageName: "pageName" in body ? str(body.pageName) : current.pageName,
    };

    await saveSettings(next);
    return NextResponse.json({ settings: publicSettings(next) });
  } catch (e) {
    return failed("save your settings", e);
  }
}
