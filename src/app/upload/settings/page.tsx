import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { PublicSettings } from "@/lib/ads";
import AdminLogin from "@/components/admin/AdminLogin";
import SettingsView from "@/components/ads/SettingsView";
import StoreMissing from "@/components/ads/StoreMissing";
import { ADMIN_COOKIE, isConfigured, verifySessionToken } from "@/lib/admin-auth";
import { NO_SETTINGS, loadSettings, publicSettings, storeConfigured } from "@/lib/ads-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uploader settings | GrowingOffers",
  robots: { index: false, follow: false },
};

export default async function UploadSettingsPage() {
  if (!verifySessionToken(cookies().get(ADMIN_COOKIE)?.value)) {
    return (
      <AdminLogin
        configured={isConfigured()}
        title="Bulk Uploader"
        purpose="open the Meta ads uploader"
      />
    );
  }

  if (!storeConfigured()) return <StoreMissing active="settings" />;

  let settings: PublicSettings = NO_SETTINGS;
  let error: string | null = null;

  try {
    settings = publicSettings(await loadSettings());
  } catch (e) {
    console.error("[upload] Could not read settings", e);
    error = e instanceof Error ? e.message : "The store could not be reached.";
  }

  if (error) return <StoreMissing active="settings" message={error} />;

  return <SettingsView initial={settings} />;
}
