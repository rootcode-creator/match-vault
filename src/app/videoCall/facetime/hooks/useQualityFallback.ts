"use client";
import { useEffect, useRef } from "react";
import { useCall } from "@stream-io/video-react-bindings";

const LOW_RESOLUTION = { width: 480, height: 270 };
const CALLING_STATE_JOINED = "joined";
const CONNECTION_QUALITY = {
  UNSPECIFIED: 0,
  POOR: 1,
  GOOD: 2,
  EXCELLENT: 3,
} as const;

// Quality fallback: only apply resolution downgrade on SUSTAINED poor quality
// to avoid frequent video interruptions from constant resolution switching.
export const useQualityFallback = () => {
  const call = useCall() as any;
  const lastQualityBySession = useRef<Map<string, { quality: number; timestamp: number }>>(new Map());
  const POOR_QUALITY_THRESHOLD_MS = 2000; // Wait 2s of sustained poor quality before downgrading

  useEffect(() => {
    if (!call || typeof call.on !== "function") return;

    const handler = (e: any) => {
      if (typeof document !== "undefined" && document.hidden) return;
      if (call?.state?.callingState !== CALLING_STATE_JOINED) return;

      const updates = e?.connectionQualityUpdates || [];
      const now = Date.now();

      for (const u of updates) {
        const sessionId = u?.sessionId;
        const quality = u?.connectionQuality;
        if (!sessionId || quality == null) continue;

        const lastEntry = lastQualityBySession.current.get(sessionId);
        const qualityChanged = !lastEntry || lastEntry.quality !== quality;

        if (qualityChanged) {
          lastQualityBySession.current.set(sessionId, { quality, timestamp: now });
          continue; // Reset timer on quality change
        }

        // Only apply resolution change if quality has been consistently poor for threshold
        const timeSincePoor = now - (lastEntry?.timestamp || 0);
        const shouldDowngrade = quality === CONNECTION_QUALITY.POOR && timeSincePoor > POOR_QUALITY_THRESHOLD_MS;
        const shouldUpgrade = quality !== CONNECTION_QUALITY.POOR && lastEntry?.quality === CONNECTION_QUALITY.POOR;

        try {
          if (shouldDowngrade) {
            call.setPreferredIncomingVideoResolution(LOW_RESOLUTION, [sessionId]);
          } else if (shouldUpgrade) {
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
