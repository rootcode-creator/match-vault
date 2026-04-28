"use client";
import React from "react";
import {
  DefaultParticipantViewUI,
  useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { useCall } from "@stream-io/video-react-bindings";

export const ParticipantPinOverlay = () => {
  const { participant } = useParticipantViewContext() as any;
  const call = useCall() as any;

  const isPinned = !!participant?.pin;

  const togglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!call || !participant) return;
    try {
      if (isPinned) await call.unpin(participant.sessionId);
      else await call.pin(participant.sessionId);
    } catch (err) {
      console.warn("Pin toggle failed", err);
    }
  };

  return (
    <div className="relative">
      <DefaultParticipantViewUI />
      <button
        onClick={togglePin}
        aria-label={isPinned ? "Unpin participant" : "Pin participant"}
        className="absolute top-2 right-2 z-20 rounded bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/60"
      >
        {isPinned ? "Unpin" : "Pin"}
      </button>
    </div>
  );
};

export default ParticipantPinOverlay;
