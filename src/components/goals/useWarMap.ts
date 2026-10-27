"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_MAP, normalize, type WarMap } from "@/lib/warMap";

export type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_DELAY_MS = 700;

/**
 * Loads the signed-in admin's war map and saves every change shortly after it
 * stops changing. Edits are applied locally first, so typing never waits on
 * the network; a failed save is surfaced, and the next edit retries it.
 */
export function useWarMap() {
  const [map, setMap] = useState<WarMap>(EMPTY_MAP);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const latest = useRef(map);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/goals")
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error ?? "Couldn't load your plan");
        if (live) {
          latest.current = normalize(body.map);
          setMap(latest.current);
        }
      })
      .catch((e) => live && setLoadError(e.message))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const flush = useCallback(async () => {
    timer.current = undefined;
    setSave("saving");
    try {
      const r = await fetch("/api/admin/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ map: latest.current }),
      });
      setSave(r.ok ? "saved" : "error");
    } catch {
      setSave("error");
    }
  }, []);

  const update = useCallback(
    (fn: (m: WarMap) => WarMap) => {
      setMap((prev) => {
        const next = fn(prev);
        latest.current = next;
        return next;
      });
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, SAVE_DELAY_MS);
    },
    [flush]
  );

  // Don't lose the last edit to a tab closed inside the debounce window.
  useEffect(() => {
    const onHide = () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      navigator.sendBeacon?.(
        "/api/admin/goals",
        new Blob([JSON.stringify({ map: latest.current })], { type: "application/json" })
      );
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  return { map, update, loading, loadError, save };
}
