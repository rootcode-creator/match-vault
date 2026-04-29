import { useEffect, useState, useRef } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCallById = (id: string | string[]) => {
    const [call, setCall] = useState<Call>();
    const [isCallLoading, setIsCallLoading] = useState(true);
    const cachedCallRef = useRef<Call | null>(null);

    const client = useStreamVideoClient();

    useEffect(() => {
        if (!client) return;

        const loadCall = async () => {
            try {
                const callId = Array.isArray(id) ? id[0] : id;

                // Reuse cached call if same ID to prevent remounts
                if (cachedCallRef.current?.id === callId) {
                    setCall(cachedCallRef.current);
                    setIsCallLoading(false);
                    return;
                }

                const callToGet = client.call("default", callId);

                // Load call state to fetch current participants
                try {
                    await callToGet.get();
                } catch (err) {
                    // Call might not exist yet, which is fine if we're creating it on join
                    console.debug("Call state not available yet:", err);
                }

                cachedCallRef.current = callToGet;
                setCall(callToGet);
                setIsCallLoading(false);
            } catch (error) {
                console.error(error);
                setIsCallLoading(false);
            }
        };

        loadCall();
    }, [client, id]);

    return { call, isCallLoading };
};