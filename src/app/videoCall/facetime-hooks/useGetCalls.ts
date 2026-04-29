import { useEffect, useState } from "react";
import { FacetimeMeetingDto } from "@/app/actions/facetimeActions";

export const useGetCalls = () => {
    const [calls, setCalls] = useState<FacetimeMeetingDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCalls = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/facetime/meetings", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    cache: "no-store",
                });

                const payload = await res.json().catch(() => ({} as any));
                if (!res.ok) {
                    console.error(payload?.error ?? "Failed to load meetings");
                    setCalls([]);
                    return;
                }

                setCalls(Array.isArray(payload?.meetings) ? payload.meetings : []);
            } catch (error) {
                console.error(error);
                setCalls([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCalls();
    }, []);

    const removeUpcomingCall = (callId: string) => {
        setCalls((current) => current.filter((c) => c.callId !== callId));
    };

    const upcomingCalls = calls;

    return { upcomingCalls, isLoading, removeUpcomingCall };
};