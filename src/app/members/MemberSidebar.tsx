"use client";

import { Member } from "@prisma/client";
import { calculateAge } from "@/lib/util";
import Link from "next/link";

type Props = { member: Member };

export default function MemberSidebar({ member }: Props) {
  return (
    <div className="rounded-2xl border border-default-200 bg-white shadow-sm p-4 sm:p-5 h-full">
      <div className="flex flex-col items-center text-center">
        <img
          src={member.image || "/images/user.png"}
          alt={member.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow"
          draggable={false}
        />
        <div className="mt-3">
          <div className="font-semibold">
            {member.name}, {calculateAge(member.dateOfBirth)}
          </div>
          <div className="text-sm text-default-500">
            {member.city || "Unknown"}, Canada
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-3">
        <Link
          href={`/members/${member.userId}`}
          className="block text-sm font-medium text-primary"
        >
          Profile
        </Link>
        <Link
          href={`/members/${member.userId}/photos`}
          className="block text-sm text-default-600 hover:text-foreground"
        >
          Photos
        </Link>
        <Link
          href={`/members/${member.userId}/chat`}
          className="block text-sm text-default-600 hover:text-foreground"
        >
          Chat
        </Link>
      </nav>

      <div className="mt-6">
        <Link
          href="/members"
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}