import { useEffect, useState } from "react";
import {
    FacetimeMeetingDto,
    getUpcomingFacetimeMeetings,
} from "@/app/actions/facetimeActions";

export const useGetCalls = () => {
    const [calls, setCalls] = useState<FacetimeMeetingDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCalls = async () => {
            setIsLoading(true);
            try {
                const result = await getUpcomingFacetimeMeetings();
                if (result.status === "success") {
                    setCalls(result.data);
                } else {
                    console.error(result.error);
                    setCalls([]);
                }
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