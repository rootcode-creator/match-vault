"use client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, ReactNode, useEffect } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

                setVideoClient(client);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        setupClient();
    }, []);

    useEffect(() => {
        return () => {
            videoClient?.disconnectUser();
        };
    }, [videoClient]);

    if (isLoading || !videoClient) return null;

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};