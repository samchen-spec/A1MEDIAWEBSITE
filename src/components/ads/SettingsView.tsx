"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdAccount, FbPage, PublicSettings } from "@/lib/ads";
import UploaderTabs from "@/components/ads/UploaderTabs";
import CTAButton from "@/components/CTAButton";

/* The three things the uploader cannot work without: a token, the ad account it
   spends in, and the page the ads are published from.

   The token is write-only from here. It is saved the moment it is pasted,
   because the account and page lists cannot be fetched without it, and after
   that only its last eight characters ever come back. */
export default function SettingsView({ initial }: { initial: PublicSettings }) {
  const [settings, setSettings] = useState(initial);
  const [token, setToken] = useState("");
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [pages, setPages] = useState<FbPage[]>([]);
  const [adAccountId, setAdAccountId] = useState(initial.adAccountId ?? "");
  const [pageId, setPageId] = useState(initial.pageId ?? "");
  const [busy, setBusy] = useState<null | "token" | "save">(null);
  const [loadingLists, setLoadingLists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const loadLists = useCallback(async () => {
    setLoadingLists(true);
    setError(null);
    try {
      const [accountsRes, pagesRes] = await Promise.all([
        fetch("/api/upload/meta/accounts"),
        fetch("/api/upload/meta/pages"),
      ]);

      const accountsBody = (await accountsRes.json()) as {
        accounts?: AdAccount[];
        error?: string;
      };
      const pagesBody = (await pagesRes.json()) as { pages?: FbPage[]; error?: string };

      if (!accountsRes.ok) throw new Error(accountsBody.error ?? "Could not reach Meta.");
      if (!pagesRes.ok) throw new Error(pagesBody.error ?? "Could not reach Meta.");

      setAccounts(accountsBody.accounts ?? []);
      setPages(pagesBody.pages ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach Meta.");
    } finally {
      setLoadingLists(false);
    }
  }, []);

  /* A saved token means the lists can be filled in before anything is touched. */
  useEffect(() => {
    if (initial.hasToken) void loadLists();
  }, [initial.hasToken, loadLists]);

  async function saveToken() {
    if (busy || !token.trim()) return;
    setBusy("token");
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/upload/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token.trim() }),
      });
      const body = (await res.json()) as { settings?: PublicSettings; error?: string };
      if (!res.ok || !body.settings) {
        throw new Error(body.error ?? "That token could not be saved.");
      }

      setSettings(body.settings);
      setToken("");
      await loadLists();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That token could not be saved.");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (busy) return;
    setBusy("save");
    setError(null);
    setSaved(false);

    try {
      const account = accounts.find((a) => a.id === adAccountId);
      const page = pages.find((p) => p.id === pageId);

      const res = await fetch("/api/upload/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adAccountId: adAccountId || null,
          adAccountName: account?.name ?? null,
          pageId: pageId || null,
          pageName: page?.name ?? null,
        }),
      });
      const body = (await res.json()) as { settings?: PublicSettings; error?: string };
      if (!res.ok || !body.settings) {
        throw new Error(body.error ?? "Those settings could not be saved.");
      }

      setSettings(body.settings);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Those settings could not be saved.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-prose px-6 py-28 md:px-10">
      <UploaderTabs active="settings" />

      <section className="panel p-6 md:p-7">
        <h2 className="text-[20px] font-medium text-[#FAFAFA]">Meta access token</h2>
        <p className="mt-2 text-[16px] text-muted">
          A system user token with ads_management, ads_read, business_management and
          pages_show_list. It is stored on the server and never sent back to this page.
        </p>

        {settings.hasToken && (
          <p className="mt-4 text-[15px] text-muted">
            Saved, ending{" "}
            <code className="text-accent">{settings.tokenTail}</code>. Paste a new one to
            replace it.
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <input
            type="password"
            className="field flex-1 basis-[260px]"
            placeholder={settings.hasToken ? "Replace token" : "Paste token"}
            autoComplete="off"
            aria-label="Meta access token"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              if (error) setError(null);
            }}
          />
          <CTAButton onClick={() => void saveToken()}>
            {busy === "token" ? "Saving" : "Save token"}
          </CTAButton>
        </div>
      </section>

      <section className="panel mt-8 p-6 md:p-7">
        <h2 className="text-[20px] font-medium text-[#FAFAFA]">Ad account</h2>
        <p className="mt-2 text-[16px] text-muted">
          Where the ads are created and the budget is spent.
        </p>

        <select
          className="field mt-5"
          aria-label="Ad account"
          value={adAccountId}
          disabled={!settings.hasToken || loadingLists}
          onChange={(e) => setAdAccountId(e.target.value)}
        >
          <option value="">
            {loadingLists ? "Loading" : settings.hasToken ? "Pick an ad account" : "Save a token first"}
          </option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} · {account.account_id}
              {account.currency ? ` · ${account.currency}` : ""}
              {account.account_status !== undefined && account.account_status !== 1
                ? " · not active"
                : ""}
            </option>
          ))}
        </select>

        <h2 className="mt-9 text-[20px] font-medium text-[#FAFAFA]">Facebook page</h2>
        <p className="mt-2 text-[16px] text-muted">
          Every ad in a batch is published from this page.
        </p>

        <select
          className="field mt-5"
          aria-label="Facebook page"
          value={pageId}
          disabled={!settings.hasToken || loadingLists}
          onChange={(e) => setPageId(e.target.value)}
        >
          <option value="">
            {loadingLists ? "Loading" : settings.hasToken ? "Pick a page" : "Save a token first"}
          </option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>

        <div aria-live="polite" className="min-h-[30px]">
          {error && <p className="mt-5 text-[16px] text-[#E05C5C]">{error}</p>}
          {saved && !error && (
            <p className="mt-5 text-[16px] text-[#4ADE80]">Saved.</p>
          )}
        </div>

        <div className="mt-3">
          <CTAButton onClick={() => void save()}>
            {busy === "save" ? "Saving" : "Save settings"}
          </CTAButton>
        </div>
      </section>

      <p className="mt-8 text-[15px] text-text-dim">
        If a list comes back empty, the system user has not been given that
        asset yet. Assign the ad account and the page to it in Business
        settings, with full control, then reload this page.
      </p>
      <p className="mt-3 text-[15px] text-text-dim">
        Development mode does not stop these lists loading. It stops ads being
        created, so publish the Meta app before the first launch.
      </p>
    </div>
  );
}
