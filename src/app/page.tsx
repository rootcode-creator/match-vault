import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_34%_at_50%_38%,rgba(34,211,238,0.42),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(36%_24%_at_50%_52%,rgba(125,211,252,0.26),transparent_80%)]" />

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-14 pt-12 text-default sm:px-6 sm:pb-16 sm:pt-14 md:pb-20 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-default-500 md:text-sm">
          Find your person
        </p>

        <h1 className="mt-4 max-w-4xl text-center text-5xl font-semibold leading-[0.98] tracking-tight text-default-900 sm:text-6xl md:text-7xl">
          MatchVault
        </h1>

        <p className="mt-5 max-w-3xl text-center text-2xl text-default-800 sm:text-3xl md:text-4xl">
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
                className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-black px-7 py-3 text-base font-semibold text-white transition hover:bg-zinc-800 sm:min-w-[170px] sm:px-8 sm:text-lg"
              >
                Start matching
              </Link>
              <Link
                href="/messages"
                className="inline-flex min-w-[145px] items-center justify-center rounded-full border border-default-300 bg-white/90 px-7 py-3 text-base font-semibold text-default-800 transition hover:bg-white sm:min-w-[150px] sm:px-8 sm:text-lg"
              >
                Messages
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-black px-7 py-3 text-base font-semibold text-white transition hover:bg-zinc-800 sm:min-w-[170px] sm:px-8 sm:text-lg"
              >
                Join free
              </Link>
              <Link
                href="/login"
                className="inline-flex min-w-[145px] items-center justify-center rounded-full border border-default-300 bg-white/90 px-7 py-3 text-base font-semibold text-default-800 transition hover:bg-white sm:min-w-[150px] sm:px-8 sm:text-lg"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

      </section>

      <footer className="w-full pb-6 sm:pb-8">
        <p className="text-center text-sm text-default-500">
          © Kawser Ahmad, {currentYear}
        </p>
      </footer>
    </div>
  );
}