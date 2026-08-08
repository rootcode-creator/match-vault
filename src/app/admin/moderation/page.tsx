import { getUnapprovedPhotos } from "@/app/actions/adminActions";
import MemberPhotos from "@/components/MemberPhotos";

export const dynamic = "force-dynamic";

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white/95 border border-default-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-default-900">
              Photos awaiting moderation
            </h1>
            <p className="mt-1 text-sm text-default-600 max-w-xl">
              Review and approve or reject photos. Use the controls on each
              image — this view is optimized for quick scanning and decision making.
            </p>
          </div>
        </div>

        <div className="mt-6 w-full">
          <MemberPhotos photos={photos} />
        </div>
      </div>
    </div>
  );
}