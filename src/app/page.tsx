import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-6 text-default">
      <h1 className="text-4xl font-bold">
        Welcome to Match Vault
      </h1>
      {session ? (
        <Link
          href="/members"
          className="inline-flex items-center justify-center rounded-xl border border-black/20 px-6 py-2 text-lg font-medium hover:bg-black/5"
        >
          Continue
        </Link>
      ) : (
        <div className="flex flex-row gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-black/20 px-6 py-2 text-lg font-medium hover:bg-black/5"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl border border-black/20 px-6 py-2 text-lg font-medium hover:bg-black/5"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}