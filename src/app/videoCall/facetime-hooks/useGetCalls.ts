import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCalls = () => {
    const client = useStreamVideoClient();
    const [calls, setCalls] = useState<Call[]>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCalls = async () => {
            if (!client) return;
            setIsLoading(true);
            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: "starts_at", direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                    },
                });

                setCalls(calls);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCalls();
    }, [client]);

    const now = new Date();

    //👇🏻 gets only calls that are yet to start
    const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
        return startsAt && new Date(startsAt) > now;
    });

    return { upcomingCalls, isLoading };
};