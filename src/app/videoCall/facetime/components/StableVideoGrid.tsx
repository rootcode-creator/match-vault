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
 * - Memoizes participant list to avoid re-renders on call state changes
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

  // Memoize the participant list to prevent re-ordering/remounting
  const memoizedParticipants = useMemo(() => {
    if (!localParticipant) return participants;
    
    // Always keep local participant first for stability
    const remote = participants.filter(
      (p) => p.sessionId !== localParticipant.sessionId
    );
    return [localParticipant, ...remote];
  }, [participants, localParticipant?.sessionId]);

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
      {memoizedParticipants.map((participant) => (
        <div
          key={`participant-${participant.sessionId}`}
          className="relative w-full h-full min-h-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300"
        >
          <ParticipantView
            participant={participant}
            ParticipantViewUI={ParticipantViewUI}
            muteAudio={false}
            disableVideo={false}
          />
        </div>
      ))}
    </div>
  );
};

export default StableVideoGrid;
