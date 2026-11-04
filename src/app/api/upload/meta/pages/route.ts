import { NextResponse } from "next/server";
import { failed, signedIn, unauthorized } from "@/lib/ads-auth";
import { loadSettings } from "@/lib/ads-store";
import { getPages } from "@/lib/meta-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!signedIn()) return unauthorized();

  try {
    const { accessToken } = await loadSettings();
    if (!accessToken) {
      return NextResponse.json({ pages: [], setup: true });
    }
    return NextResponse.json({ pages: await getPages(accessToken) });
  } catch (e) {
    return failed("load your Facebook pages", e);
  }
}
