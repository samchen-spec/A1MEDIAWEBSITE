import { NextResponse } from "next/server";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import { loadSettings } from "@/lib/ads-store";
import { getAdAccounts } from "@/lib/meta-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!signedIn()) return unauthorized();

  try {
    const { accessToken } = await loadSettings();
    if (!accessToken) {
      return NextResponse.json({ accounts: [], setup: true });
    }
    return NextResponse.json({ accounts: await getAdAccounts(accessToken) });
  } catch (e) {
    return failed("load your ad accounts", e);
  }
}
