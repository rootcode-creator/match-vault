"use client";
import React, { useMemo } from "react";
import {
  ParticipantView,
  useCallStateHooks,
  DefaultParticipantViewUI,
} from "@stream-io/video-react-sdk";
import { useCall } from "@stream-io/video-react-bindings";

interface StableVideoGridProps {
  ParticipantViewUI?: React.ComponentType<any>;
}

/**
 * Custom stable video grid that prevents aggressive remounting of participant views.
 * Key differences from PaginatedGridLayout:
 * - Maintains stable participant order to prevent DOM thrashing
 * - Only re-renders when participants actually join/leave
 * - Ensures video elements are reused, not recreated
 * - Prevents Dynascale stream abort errors from element detachment
 */
export const StableVideoGrid: React.FC<StableVideoGridProps> = ({
  ParticipantViewUI = DefaultParticipantViewUI,
}) => {
  const call = useCall();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  // Create an ordered participant list with local participant first
  const memoizedParticipants = useMemo(() => {
    if (!localParticipant) return participants;

    // Always keep local participant first for stability
    const remote = participants.filter(
      (p) => p.sessionId !== localParticipant.sessionId
    );
    return [localParticipant, ...remote];
  }, [participants.length, localParticipant]);

  if (!call) return null;

  const participantCount = memoizedParticipants.length;

  // Determine grid layout based on participant count
  let gridCols = "grid-cols-1";
  if (participantCount >= 2) gridCols = "md:grid-cols-2";
  if (participantCount >= 3) gridCols = "lg:grid-cols-3";
  if (participantCount >= 5) gridCols = "xl:grid-cols-4";

  return (
    <div
      className={`stable-video-grid grid w-full h-full gap-1.5 sm:gap-2 p-1 sm:p-2 auto-rows-fr grid-cols-1 ${gridCols}`}
    >
      {participantCount === 0 && (
        <div className="flex items-center justify-center col-span-full text-slate-500 text-sm">
          Waiting for participants...
        </div>
      )}
      {memoizedParticipants.map((participant) => (
        <div
          key={`participant-${participant.sessionId}`}
          className="relative w-full h-full min-h-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300"
          data-testid={`participant-${participant.sessionId}`}
        >
          <ParticipantView
            participant={participant}
            ParticipantViewUI={ParticipantViewUI}
          />
        </div>
      ))}
    </div>
  );
};

export default StableVideoGrid;
