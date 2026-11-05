import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { PublicSettings } from "@/lib/ads";
import AdminLogin from "@/components/admin/AdminLogin";
import StoreMissing from "@/components/ads/StoreMissing";
import UploadWizard from "@/components/ads/UploadWizard";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/lib/admin-auth";
import { NO_SETTINGS, loadSettings, publicSettings, storeConfigured } from "@/lib/ads-store";

/* Behind the same admin password as /admin, and for a better reason
   than either: the saved token can spend a client's ad budget. The gate is in
   the page rather than in middleware so the session check and the settings read
   happen in one request, with nothing unprotected in between.

   Never indexed, and deliberately not linked from anywhere on the site. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bulk Uploader | GrowingOffers",
  robots: { index: false, follow: false },
};

export default async function UploadPage() {
  if (!verifySessionToken(cookies().get(ADMIN_COOKIE)?.value)) {
    return (
      <AdminLogin
        configured={isConfigured()}
        title="Bulk Uploader"
        purpose="open the Meta ads uploader"
      />
    );
  }

  if (!storeConfigured()) return <StoreMissing active="upload" />;

  let settings: PublicSettings = NO_SETTINGS;
  let error: string | null = null;

  try {
    settings = publicSettings(await loadSettings());
  } catch (e) {
    console.error("[upload] Could not read settings", e);
    error = e instanceof Error ? e.message : "The store could not be reached.";
  }

  if (error) return <StoreMissing active="upload" message={error} />;

  return <UploadWizard settings={settings} />;
}
