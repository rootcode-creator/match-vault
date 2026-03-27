import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-14 text-default">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-default-500">
        Find your person
      </p>

      <h1 className="mt-4 text-center text-5xl font-semibold leading-tight tracking-tight text-default-900 md:text-7xl">
        MatchVault
      </h1>

      <p className="mt-4 max-w-3xl text-center text-2xl text-default-800 md:text-4xl">
        Amazing matches. Genuine conversations.
      </p>

      <p className="mt-5 max-w-3xl text-center text-lg text-default-600">
        Meet singles nearby, connect over what matters, and turn great chats into real dates.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {session ? (
          <>
            <Link
              href="/members"
              className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-xl font-medium text-white transition hover:bg-blue-700"
            >
              Start matching
            </Link>
            <Link
              href="/messages"
              className="inline-flex min-w-[130px] items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-xl font-medium text-blue-600 transition hover:bg-blue-50"
            >
              Messages
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/register"
              className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-xl font-medium text-white transition hover:bg-blue-700"
            >
              Join free
            </Link>
            <Link
              href="/login"
              className="inline-flex min-w-[130px] items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-xl font-medium text-blue-600 transition hover:bg-blue-50"
            >
              Sign in
            </Link>
          </>
        )}
      </div>

      <div className="mt-12 w-full max-w-4xl rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center">
            <Image
              src="/images/f1.jpg"
              alt="Match profile"
              width={112}
              height={112}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm md:h-28 md:w-28"
            />
            <Image
              src="/images/m1.jpg"
              alt="Match profile"
              width={112}
              height={112}
              className="-ml-5 h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm md:h-28 md:w-28"
            />
            <Image
              src="/images/f2.jpg"
              alt="Match profile"
              width={112}
              height={112}
              className="-ml-5 h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm md:h-28 md:w-28"
            />
            <Image
              src="/images/m2.jpg"
              alt="Match profile"
              width={112}
              height={112}
              className="-ml-5 h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm md:h-28 md:w-28"
            />
          </div>
          <p className="max-w-2xl text-center text-base text-default-600 md:text-lg">
            Thousands of meaningful introductions start with one hello.
            Your next favorite person could be one swipe away.
          </p>
        </div>
      </div>
    </div>
  );
}