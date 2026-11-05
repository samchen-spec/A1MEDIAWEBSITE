import { NextResponse } from "next/server";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import { loadSettings } from "@/lib/ads-store";
import { getCampaigns } from "@/lib/meta-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!signedIn()) return unauthorized();

  try {
    const { accessToken, adAccountId } = await loadSettings();
    if (!accessToken || !adAccountId) {
      return NextResponse.json(
        { error: "Connect a Meta token and pick an ad account first.", setup: true },
        { status: 409 },
      );
    }
    return NextResponse.json({
      campaigns: await getCampaigns(adAccountId, accessToken),
    });
  } catch (e) {
    return failed("load your campaigns", e);
  }
}
