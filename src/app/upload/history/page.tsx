import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Batch } from "@/lib/ads";
import AdminLogin from "@/components/admin/AdminLogin";
import HistoryView from "@/components/ads/HistoryView";
import StoreMissing from "@/components/ads/StoreMissing";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/lib/admin-auth";
import { listBatches, storeConfigured } from "@/lib/ads-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uploader history | GrowingOffers",
  robots: { index: false, follow: false },
};

export default async function UploadHistoryPage() {
  if (!verifySessionToken(cookies().get(ADMIN_COOKIE)?.value)) {
    return (
      <AdminLogin
        configured={isConfigured()}
        title="Bulk Uploader"
        purpose="open the Meta ads uploader"
      />
    );
  }

  if (!storeConfigured()) return <StoreMissing active="history" />;

  let batches: Batch[] = [];
  let error: string | null = null;

  try {
    batches = await listBatches();
  } catch (e) {
    console.error("[upload] Could not read batches", e);
    error = e instanceof Error ? e.message : "The store could not be reached.";
  }

  return <HistoryView batches={batches} error={error} />;
}
