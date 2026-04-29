"use client";
import React, { useState } from "react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { FaVideo } from "react-icons/fa";

export default function StartCallWithMember({
  targetUserId,
  memberName,
}: {
  targetUserId: string;
  memberName?: string | null;
}) {
  const client = useStreamVideoClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartCall = async () => {
    if (!client) return alert("Video client not ready");
    try {
      setLoading(true);
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");

      const startsAt = new Date().toISOString();
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description: `Call with ${memberName ?? "member"}` },
        },
      });

      // Persist meeting and include recipient so "Meeting with" shows up
      await fetch("/api/facetime/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          callId: call.id,
          description: `Call with ${memberName ?? "member"}`,
          startsAt,
          recipientUserIds: [targetUserId],
        }),
      }).catch((e) => console.warn("Failed to save meeting", e));

      router.push(`/videoCall/facetime/${call.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start call");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartCall}
      aria-label="Open video call"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c7dce8] bg-white text-[#35576b] shadow-sm transition hover:bg-[#eef6fb] hover:text-[#173042]"
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <FaVideo className="text-[15px]" />
      )}
    </button>
  );
}
