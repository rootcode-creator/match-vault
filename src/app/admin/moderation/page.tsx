import { getUnapprovedPhotos } from "@/app/actions/adminActions";
import MemberPhotos from "@/components/MemberPhotos";

export const dynamic = "force-dynamic";

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-default-200 bg-white/95 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-default-900 sm:text-4xl">
                Photos awaiting moderation
              </h1>
              <p className="max-w-xl text-sm leading-7 text-default-600 sm:text-base">
                Review and approve or reject photos. Use the controls on each image — this view is optimized for quick scanning and decision making.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-default-200 bg-default-50 px-4 py-2 text-sm font-semibold text-default-700 shadow-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-black" />
              {photos?.length ?? 0} pending photo{photos?.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="h-px bg-default-200/70" />

          <div className="w-full">
            <MemberPhotos photos={photos} />
          </div>
        </div>
      </div>
    </div>
  );
}