"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { FaVideo } from "react-icons/fa";

type Props = {
    targetUserId: string;
    memberName?: string | null;
};

export default function StartCallWithMember({ targetUserId, memberName }: Props) {
    return (
        <Button
            as={Link}
            href={`/videoCall?with=${encodeURIComponent(targetUserId)}`}
            color="success"
            size="sm"
            radius="full"
            className="min-w-0 gap-2 px-3 font-semibold text-white shadow-sm"
            aria-label={`Start a video call with ${memberName ?? "this member"}`}
        >
            <FaVideo className="text-[12px]" />
            <span className="hidden sm:inline">Call</span>
        </Button>
    );
}