"use client";
import { tokenProvider } from "../facetime-actions/stream.actions";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, ReactNode, useEffect } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const [guestUserId, setGuestUserId] = useState<string>();
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const existingGuestId = window.localStorage.getItem("facetime_guest_id");
        if (existingGuestId) {
            setGuestUserId(existingGuestId);
            return;
        }

        const newGuestId = `guest-${crypto.randomUUID()}`;
        window.localStorage.setItem("facetime_guest_id", newGuestId);
        setGuestUserId(newGuestId);
    }, []);

    useEffect(() => {
        if (!guestUserId || !apiKey) return;

        const client = new StreamVideoClient({
            apiKey,
            user: {
                id: guestUserId,
                name: `Guest ${guestUserId.slice(-6)}`,
            },
            tokenProvider: () => tokenProvider(guestUserId),
        });

        setVideoClient(client);

        return () => {
            client.disconnectUser();
            setVideoClient(undefined);
        };
    }, [guestUserId]);

    if (!videoClient) return null;

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};