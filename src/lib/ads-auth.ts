import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { MetaError } from "@/lib/meta-api";

/* The uploader sits behind the same admin session as /admin. It has
   to: a token with ads_management on a client's account is money, and /upload
   is a public URL. */

export function signedIn(): boolean {
  return verifySessionToken(cookies().get(ADMIN_COOKIE)?.value);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Sign in first." }, { status: 401 });
}

/* Meta's own message is the useful one, so it is passed through to the UI
   rather than flattened into "something went wrong". Anything else is logged
   and reported generically, because it is ours and not the user's to read. */
export function failed(context: string, error: unknown): NextResponse {
  if (error instanceof MetaError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status >= 400 && error.status < 500 ? 400 : 502 },
    );
  }
  console.error(`[upload] ${context}`, error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : `Could not ${context}.` },
    { status: 500 },
  );
}

