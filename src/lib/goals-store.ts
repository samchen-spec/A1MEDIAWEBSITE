import { del, get, list, put } from "@vercel/blob";
import { EMPTY_MAP, normalize, type WarMap } from "@/lib/warMap";

/* The goal tracker is one private JSON document in the same Blob store as the
   onboarding submissions.

   Every save writes a new object (random suffix) and then removes the older
   ones, rather than overwriting one fixed pathname. Overwrites are served
   through a cache with a one-minute floor, so a reload straight after an edit
   could show the previous plan; a fresh URL per save never can. */

const PREFIX = "goals/war-map";

export async function loadWarMap(): Promise<WarMap> {
  const { blobs } = await list({ prefix: PREFIX });
  const latest = [...blobs].sort((a, b) => +b.uploadedAt - +a.uploadedAt)[0];
  if (!latest) return EMPTY_MAP;

  const result = await get(latest.url, { access: "private" });
  if (!result || result.statusCode !== 200) return EMPTY_MAP;
  return normalize(JSON.parse(await new Response(result.stream).text()));
}

export async function saveWarMap(map: WarMap): Promise<void> {
  const saved = await put(`${PREFIX}.json`, JSON.stringify(normalize(map)), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
  });

  /* Best effort: a leftover old version is harmless, because reads always
     take the newest. */
  const { blobs } = await list({ prefix: PREFIX });
  const stale = blobs.filter((b) => b.url !== saved.url).map((b) => b.url);
  if (stale.length) await del(stale).catch(() => {});
}
