import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminLogin from "@/components/admin/AdminLogin";
import GoalsView from "@/components/goals/GoalsView";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/lib/admin-auth";

/* Behind the same admin password as /admin. Never cached, never indexed. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Goals | GrowingOffers",
  robots: { index: false, follow: false },
};

export default function GoalsPage() {
  if (!verifySessionToken(cookies().get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin configured={isConfigured()} title="Goals" purpose="open the goal tracker" />;
  }
  return <GoalsView />;
}
