"use client";

import { useState } from "react";
import { FaVideo } from "react-icons/fa";
import InstantMeeting from "@/app/videoCall/facetime-modals/InstantMeeting";

interface Props {
    targetUserId: string;
    memberName?: string | null;
}

export default function StartVideoCallButton({ targetUserId, memberName }: Props) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                aria-label={`Start a video call with ${memberName ?? "this member"}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c7dce8] bg-white text-[#35576b] shadow-sm transition hover:bg-[#eef6fb] hover:text-[#173042]"
            >
                <FaVideo className="text-[15px]" />
            </button>
            {showModal && (
                <InstantMeeting
                    enable={showModal}
                    setEnable={setShowModal}
                    recipientUserIds={[targetUserId]}
                />
            )}
        </>
    );
}
