import { get, list, put } from "@vercel/blob";
import { TRACKS, type Answers, type Track } from "@/lib/onboarding";

/* Submissions live in Vercel Blob, one private JSON object each. Private
   matters: these hold a client's revenue, capacity and contact details, so the
   objects are not readable without the store's token. */

const PREFIX = "onboarding/";

export interface Submission {
  id: string;
  track: Track;
  submittedAt: string;
  answers: Answers;
}

export function storeConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN,
  );
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "client"
  );
}

export async function saveSubmission(
  track: Track,
  answers: Answers,
  submittedAt: string,
): Promise<void> {
  const business = slugify((answers.business_name as string) ?? "");
  /* The timestamp leads the name so a plain listing is in order. */
  const pathname = `${PREFIX}${submittedAt}-${business}.json`;

  await put(pathname, JSON.stringify({ track, submittedAt, answers }), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
  });
}

export async function listSubmissions(): Promise<Submission[]> {
  const { blobs } = await list({ prefix: PREFIX });

  const submissions = await Promise.all(
    blobs.map(async (blob): Promise<Submission | null> => {
      try {
        const result = await get(blob.url, { access: "private" });
        if (!result || result.statusCode !== 200) return null;

        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text) as {
          track?: Track;
          submittedAt?: string;
          answers?: Answers;
        };

        if (!parsed.answers || !parsed.track) return null;
        if (!TRACKS.includes(parsed.track)) return null;

        return {
          id: blob.pathname,
          track: parsed.track,
          submittedAt: parsed.submittedAt ?? blob.uploadedAt.toISOString(),
          answers: parsed.answers,
        };
      } catch {
        /* One unreadable object must not blank the whole dashboard. */
        return null;
      }
    }),
  );

  return submissions
    .filter((s): s is Submission => s !== null)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}
