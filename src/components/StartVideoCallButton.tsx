"use client";

import Link from "next/link";

interface Props {
    targetUserId: string;
    memberName?: string | null;
}

export default function StartVideoCallButton({ targetUserId, memberName }: Props) {
    return (
        <Link
            href={`/videoCall?with=${encodeURIComponent(targetUserId)}`}
            aria-label={`Start a video call with ${memberName ?? "this member"}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c7dce8] bg-white text-[#35576b] shadow-sm transition hover:bg-[#eef6fb] hover:text-[#173042]"
        >
            <svg className="text-[15px] w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
            </svg>
        </Link>
    );
}
