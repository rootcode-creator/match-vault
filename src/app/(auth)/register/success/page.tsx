import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function RegisterSuccessPage() {
  return (
    <div className="flex items-start justify-center pt-14 pb-10 min-h-[calc(100dvh-80px)]">
      <div
        className="relative h-fit w-full max-w-md mx-auto py-5 px-6 rounded-2xl bg-white/95 backdrop-blur
        ring-1 ring-indigo-100 border border-white/60
        shadow-[0_18px_50px_-12px_rgba(79,70,229,0.35),0_25px_55px_-25px_rgba(0,0,0,0.3)]"
      >
        <div className="flex flex-col items-center justify-center mb-1">
          <div className="flex flex-col gap-2 items-center text-default">
            <div className="flex flex-row items-center gap-3">
              <FaCheckCircle size={30} />
              <h1 className="text-2xl font-semibold">
                You have successfully registered
              </h1>
            </div>
            <p className="text-neutral-500 text-center text-sm">
              You can now login to the app
            </p>
          </div>
        </div>

        <div className="pt-5 pb-6">
          <Link
            href="/login"
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:shadow-lg active:translate-y-px"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}