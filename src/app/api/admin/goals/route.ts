import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { loadWarMap, saveWarMap } from "@/lib/goals-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2_000_000;

function signedIn() {
  return verifySessionToken(cookies().get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!signedIn()) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  try {
    return NextResponse.json({ map: await loadWarMap() });
  } catch (e) {
    console.error("[goals] load failed", e);
    return NextResponse.json({ error: "Couldn't load your plan." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!signedIn()) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const text = await request.text();
  if (text.length > MAX_BYTES) {
    return NextResponse.json({ error: "Plan is too large to save." }, { status: 413 });
  }
  let body: { map?: unknown };
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }
  if (!body.map || typeof body.map !== "object") {
    return NextResponse.json({ error: "map is required" }, { status: 400 });
  }

  try {
    await saveWarMap(body.map as Parameters<typeof saveWarMap>[0]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[goals] save failed", e);
    return NextResponse.json({ error: "Couldn't save your plan." }, { status: 500 });
  }
}

/* `navigator.sendBeacon` can only POST — it's the save fired as the tab closes. */
export const POST = PUT;
