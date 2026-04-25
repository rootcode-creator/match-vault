import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col bg-white">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20">
        <p className="text-xs font-normal uppercase tracking-[0.2em] text-neutral-500 md:text-sm">
          Find your person
        </p>

        <h1 className="mt-5 max-w-4xl text-center text-5xl font-medium leading-[1] tracking-tight text-black sm:text-6xl md:text-7xl">
          MatchVault
        </h1>

        <p className="mt-5 max-w-3xl text-center text-2xl font-normal text-neutral-700 sm:text-3xl md:text-4xl">
          Amazing matches. Genuine conversations.
        </p>

        <p className="mt-6 max-w-3xl text-center text-[15px] leading-relaxed text-neutral-500 sm:text-base md:text-lg">
          Thousands of meaningful introductions start with one hello. Your next favorite person could be one swipe away.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-wrap items-center justify-center gap-3 sm:max-w-none sm:gap-4">
          {session ? (
            <>
              <Link
                href="/members"
                className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-black bg-black px-6 py-2.5 text-base font-medium text-white sm:min-w-[170px] sm:text-lg"
              >
                Start matching
              </Link>
              <Link
                href="/messages"
                className="inline-flex min-w-[145px] items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-base font-medium text-neutral-700 sm:min-w-[150px] sm:text-lg"
              >
                Messages
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-black bg-black px-6 py-2.5 text-base font-medium text-white sm:min-w-[170px] sm:text-lg"
              >
                Join free
              </Link>
              <Link
                href="/login"
                className="inline-flex min-w-[145px] items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-base font-medium text-neutral-700 sm:min-w-[150px] sm:text-lg"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      <footer className="w-full border-t border-neutral-200 pb-8 pt-6">
        <p className="text-center text-sm font-normal text-neutral-500">
          © Kawser Ahmad, {currentYear}
        </p>
      </footer>
    </div>
  );
}