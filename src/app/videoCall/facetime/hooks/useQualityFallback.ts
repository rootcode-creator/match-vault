"use client";
import { useEffect, useRef } from "react";
import { useCall } from "@stream-io/video-react-bindings";
import { CallingState, ConnectionQuality } from "@stream-io/video-client";

const LOW_RESOLUTION = { width: 320, height: 180 };

// Quality fallback: when a participant reports POOR connectionQuality,
// request a low incoming resolution for that participant. Only update when
// the quality actually changes and the call is JOINED.
export const useQualityFallback = () => {
  const call = useCall() as any;
  const lastQualityBySession = useRef<Map<string, ConnectionQuality>>(new Map());

  useEffect(() => {
    if (!call || typeof call.on !== "function") return;

    const handler = (e: any) => {
      if (typeof document !== "undefined" && document.hidden) return;
      if (call?.state?.callingState !== CallingState.JOINED) return;

      const updates = e?.connectionQualityUpdates || [];
      for (const u of updates) {
        const sessionId = u?.sessionId;
        const quality = u?.connectionQuality;
        if (!sessionId || quality == null) continue;

        const last = lastQualityBySession.current.get(sessionId);
        if (last === quality) continue;
        lastQualityBySession.current.set(sessionId, quality);

        try {
          if (quality === ConnectionQuality.POOR) {
            call.setPreferredIncomingVideoResolution(LOW_RESOLUTION, [sessionId]);
          } else {
            call.setPreferredIncomingVideoResolution(undefined, [sessionId]);
          }
        } catch (err) {
          console.warn("Quality fallback error", err);
        }
      }
    };

    const off = call.on("connectionQualityChanged", handler);
    return () => {
      try {
        if (typeof off === "function") off();
        else if (call.off) call.off("connectionQualityChanged", handler);
      } catch (e) {
        // ignore
      }
    };
  }, [call]);
};

export default useQualityFallback;
