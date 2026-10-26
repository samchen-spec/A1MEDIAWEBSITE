import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminLogin from "@/components/admin/AdminLogin";
import SubmissionsView from "@/components/admin/SubmissionsView";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/lib/admin-auth";
import { listSubmissions, storeConfigured, type Submission } from "@/lib/store";

/* Never cached and never indexed: it reads live data and it is behind a
   password. The gate is here rather than in middleware so the session check and
   the data fetch happen in the same request, with nothing to protect in
   between. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | GrowingOffers",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const token = cookies().get(ADMIN_COOKIE)?.value;

  if (!verifySessionToken(token)) {
    return <AdminLogin configured={isConfigured()} />;
  }

  const configured = storeConfigured();
  let submissions: Submission[] = [];
  let error: string | null = null;

  if (configured) {
    try {
      submissions = await listSubmissions();
    } catch (e) {
      console.error("[admin] Could not read submissions", e);
      error =
        e instanceof Error
          ? e.message
          : "The store could not be reached.";
    }
  }

  return (
    <SubmissionsView
      submissions={submissions}
      configured={configured}
      error={error}
    />
  );
}
