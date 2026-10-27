"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CTAButton from "@/components/CTAButton";

export default function AdminLogin({
  configured,
  title = "Admin",
  purpose = "see form submissions",
}: {
  configured: boolean;
  title?: string;
  purpose?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    if (busy || !password) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "That did not work.");
        setBusy(false);
        return;
      }

      setPassword("");
      /* The page is a server component, so the session cookie only takes effect
         once the route is re-fetched. */
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[440px] flex-col justify-center px-6 py-32">
      <p className="eyebrow">GrowingOffers</p>
      <h1 className="mt-4 text-[34px] font-semibold leading-[1.2] text-[#FAFAFA]">
        {title}
      </h1>

      {configured ? (
        <>
          <p className="mt-4 text-muted">
            Enter the admin password to {purpose}.
          </p>
          <div className="mt-7">
            <input
              type="password"
              className="field"
              placeholder="Password"
              autoComplete="current-password"
              aria-label="Admin password"
              aria-invalid={error !== null}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void signIn();
                }
              }}
            />
          </div>

          <div aria-live="polite" className="min-h-[28px]">
            {error && <p className="mt-4 text-[16px] text-[#E05C5C]">{error}</p>}
          </div>

          <div className="mt-4">
            <CTAButton onClick={() => void signIn()}>
              {busy ? "Checking" : "Sign in"}
            </CTAButton>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-[20px] bg-[#151413] p-5">
          <p className="text-[17px] text-[#E05C5C]">
            No admin password is set on the server.
          </p>
          <p className="mt-2 text-[16px] text-muted">
            Add <code className="text-accent">ADMIN_PASSWORD</code> to the
            environment, at least 8 characters, then reload this page. Until it is
            set, nobody can sign in.
          </p>
        </div>
      )}
    </div>
  );
}
