"use client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, ReactNode, useEffect } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

const isAlreadyLeftError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error ?? "");
    return message.toLowerCase().includes("already been left");
};

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let clientForCleanup: StreamVideoClient | undefined;

        const cleanupClient = async (client: StreamVideoClient) => {
            try {
                const unsafeClient = client as any;
                const possibleCalls = unsafeClient?.state?.calls ?? unsafeClient?.calls ?? [];
                const calls = Array.isArray(possibleCalls) ? possibleCalls : [];

                await Promise.allSettled(
                    calls.map(async (call: any) => {
                        if (!call || typeof call.leave !== "function") return;

                        try {
                            await call.leave();
                        } catch (error) {
                            if (isAlreadyLeftError(error)) return;
                            console.warn("Error leaving call during provider cleanup", error);
                        }
                    })
                );
            } catch (error) {
                console.warn("Error while collecting active calls for cleanup", error);
            } finally {
                try {
                    await client.disconnectUser();
                } catch (error) {
                    console.warn("Error disconnecting Stream user", error);
                }
            }
        };

        const setupClient = async () => {
            try {
                const response = await fetch("/api/stream/token", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Stream token");
                }

                const data: {
                    token: string;
                    user: { id: string; name: string | null; image: string | null };
                } = await response.json();

                const client = new StreamVideoClient({
                    apiKey,
                    user: {
                        id: data.user.id,
                        name: data.user.name ?? undefined,
                        image: data.user.image ?? undefined,
                    },
                    tokenProvider: async () => data.token,
                });

                clientForCleanup = client;

                if (!isMounted) {
                    await cleanupClient(client);
                    return;
                }

                setVideoClient(client);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        setupClient();

        return () => {
            isMounted = false;

            if (!clientForCleanup) return;
            void cleanupClient(clientForCleanup);
        };
    }, []);

    if (isLoading || !videoClient) return null;

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};