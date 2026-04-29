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

  // Keep the main grid dedicated to remote participants.
  // When there are no remotes, fall back to the local self-view.
  const memoizedParticipants = useMemo(() => {
    // Basic array of all valid participants
    const allValid = participants.filter(Boolean);
    
    // Deduplicate by userId, preferring the one with a video track or the local one
    const uniqueParticipantsMap = new Map();
    for (const p of allValid) {
      if (!uniqueParticipantsMap.has(p.userId)) {
        uniqueParticipantsMap.set(p.userId, p);
      } else {
        const existing = uniqueParticipantsMap.get(p.userId);
        if (p.isLocalParticipant && !existing.isLocalParticipant) {
          uniqueParticipantsMap.set(p.userId, p);
        }
      }
    }
    
    const uniqueParticipants = Array.from(uniqueParticipantsMap.values());
    const remoteParticipants = uniqueParticipants.filter(
      (participant) => !participant.isLocalParticipant
    );

    if (remoteParticipants.length > 0) {
      return remoteParticipants;
    }

    return localParticipant ? [localParticipant] : [];
  }, [participants, localParticipant?.sessionId]);

  if (!call) return null;

  const participantCount = memoizedParticipants.length;

  const isSingle = participantCount <= 1;

  // Determine grid layout based on participant count.
  // - Mobile (<sm): stack tiles (1 column)
  // - >=sm: 2 columns for 2+ participants
  // - >=lg: 3 columns for 3+ participants
  // - >=xl: 4 columns for 5+ participants
  let gridCols = "grid-cols-1";
  if (participantCount >= 2) gridCols = "sm:grid-cols-2";
  if (participantCount >= 3) gridCols = "sm:grid-cols-2 lg:grid-cols-3";
  if (participantCount >= 5) gridCols = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const gridSpacing = isSingle
    ? "gap-0 p-0"
    : "gap-1.5 sm:gap-2 p-1 sm:p-2";

  const tileRadius = isSingle ? "rounded-none" : "rounded-lg";

  return (
    <div
      className={`stable-video-grid relative grid h-full w-full auto-rows-fr grid-cols-1 ${gridCols} ${gridSpacing}`}
    >
      {participantCount === 0 && (
        <div className="flex items-center justify-center col-span-full text-slate-500 text-sm">
          Waiting for participants...
        </div>
      )}
      {memoizedParticipants.map((participant) => (
        <div
          key={`participant-${participant.sessionId}`}
          className={`stable-video-tile relative h-full w-full min-h-0 overflow-hidden ${tileRadius} bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-300`}
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
