import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { MAX_UPLOAD_BYTES, uploadPrefix } from "@/lib/ads";
import { signedIn, unauthorized } from "@/lib/ads-auth";
import { validBatchId } from "@/lib/ads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Creative files go from the browser straight to Blob storage, which this route
   only signs for. Routing a 300MB video through a serverless function would hit
   the request body limit long before it reached Meta.

   The signed token is scoped to one batch's folder, so a token handed out for
   one upload cannot be replayed to write anywhere else in the store. */
export async function POST(request: Request) {
  if (!signedIn()) return unauthorized();

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Could not read that request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const batchId = clientPayload ?? "";
        if (!validBatchId(batchId)) {
          throw new Error("That upload is not attached to a batch.");
        }
        if (!pathname.startsWith(uploadPrefix(batchId))) {
          throw new Error("That upload is aimed outside its batch.");
        }

        return {
          allowedContentTypes: ["image/*", "video/*"],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          tokenPayload: batchId,
        };
      },
      /* Nothing to do on completion: the browser reports the finished URLs to
         /api/upload/creatives, which is also what makes this work in local
         development, where Vercel cannot call back into localhost. */
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "That upload was refused." },
      { status: 400 },
    );
  }
}
