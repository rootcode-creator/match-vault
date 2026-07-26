"use client";

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    targetUserId: string;
    memberName?: string | null;
}

export default function StartVideoCallButton({ targetUserId, memberName }: Props) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/videoCall?with=${encodeURIComponent(targetUserId)}`}
                        aria-label={`Start a video call with ${memberName ?? "this member"}`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c7dce8] bg-white text-[#35576b] shadow-sm transition hover:bg-[#eef6fb] hover:text-[#173042]"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                    Start video call
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
