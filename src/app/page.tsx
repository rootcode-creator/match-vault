import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.12),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-default-200" />

      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col items-center justify-center px-5 pb-14 pt-10 text-default sm:px-6 sm:pb-16 sm:pt-12 md:pb-20 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-default-500 md:text-sm">
          Find your person
        </p>

        <h1 className="mt-3 max-w-5xl text-center text-4xl font-semibold leading-[1.04] tracking-tight text-default-900 sm:mt-4 sm:text-5xl md:text-7xl">
          MatchVault
        </h1>

        <p className="mt-4 max-w-3xl text-center text-xl text-default-800 sm:mt-5 sm:text-2xl md:text-4xl">
          Amazing matches. Genuine conversations.
        </p>

        <p className="mt-5 max-w-3xl text-center text-[15px] leading-relaxed text-default-600 sm:text-base md:mt-6 md:text-lg">
          Thousands of meaningful introductions start with one hello. Your next favorite person could be one swipe away.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-wrap items-center justify-center gap-3 sm:mt-9 sm:max-w-none sm:gap-4">
          {session ? (
            <>
              <Link
                href="/members"
                className="inline-flex min-w-[160px] items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 sm:min-w-[170px] sm:px-8 sm:text-lg"
              >
                Start matching
              </Link>
              <Link
                href="/messages"
                className="inline-flex min-w-[145px] items-center justify-center rounded-xl border border-default-300 bg-white px-7 py-3 text-base font-semibold text-default-800 transition hover:bg-default-100 sm:min-w-[150px] sm:px-8 sm:text-lg"
              >
                Messages
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex min-w-[160px] items-center justify-center rounded-xl bg-indigo-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 sm:min-w-[170px] sm:px-8 sm:text-lg"
              >
                Join free
              </Link>
              <Link
                href="/login"
                className="inline-flex min-w-[145px] items-center justify-center rounded-xl border border-default-300 bg-white px-7 py-3 text-base font-semibold text-default-800 transition hover:bg-default-100 sm:min-w-[150px] sm:px-8 sm:text-lg"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 w-full border-t border-default-200 pt-6 sm:mt-14 sm:pt-8">
          <p className="text-center text-sm text-default-500">
            Trusted by fast-growing companies around the world
          </p>
        </div>
      </section>
    </div>
  );
}