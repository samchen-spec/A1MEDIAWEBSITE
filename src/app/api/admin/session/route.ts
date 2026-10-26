import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  adminPassword,
  createSessionToken,
  passwordMatches,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Deliberately slow on a wrong password. Serverless gives no shared counter to
   rate limit against, so a fixed delay is what is available: it costs an honest
   admin half a second once and makes guessing impractical at any volume. */
const WRONG_PASSWORD_DELAY_MS = 500;

export async function POST(request: Request) {
  if (!adminPassword()) {
    return NextResponse.json(
      {
        error:
          "No admin password is set on the server. Add ADMIN_PASSWORD to the environment.",
      },
      { status: 503 },
    );
  }

  let body: { password?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  const candidate = typeof body.password === "string" ? body.password : "";

  if (!passwordMatches(candidate)) {
    await new Promise((resolve) => setTimeout(resolve, WRONG_PASSWORD_DELAY_MS));
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
