import UploaderTabs, { type UploaderTab } from "@/components/ads/UploaderTabs";

/* The uploader keeps its state in Vercel Blob, same store as the onboarding
   submissions. Without it there is nowhere to put a token or a batch, so the
   screens say so rather than failing on the first save. */
export default function StoreMissing({
  active,
  message,
}: {
  active: UploaderTab;
  message?: string | null;
}) {
  return (
    <div className="mx-auto max-w-prose px-6 py-28 md:px-10">
      <UploaderTabs active={active} />
      <div className="panel p-7">
        <h2 className="text-[22px] font-medium text-[#FAFAFA]">No store connected</h2>
        <p className="mt-3 text-[16px] text-muted">
          {message ??
            "Connect a Vercel Blob store to this project. The uploader keeps its token, batches and creative files there, which is why there is no database."}
        </p>
      </div>
    </div>
  );
}
