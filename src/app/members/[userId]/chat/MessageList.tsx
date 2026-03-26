"use client";
import { MessageDto } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/util";
import useMessageStore from "@/hooks/useMessageStore";

type Props = {
    initialMessages: {
        messages: MessageDto[];
        readCount: number;
    }
    currentUserId: string;
    chatId: string;
};


export default function MessageList({
    initialMessages,
    currentUserId,
    chatId
}: Props) {
    const [messages, setMessages] = useState<MessageDto[]>(initialMessages?.messages ?? []);

    const setReadCount =useRef(false);

    const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

    useEffect(() => {
        if (!setReadCount.current) {
            const readCount = Number.isFinite(initialMessages?.readCount)
                ? initialMessages.readCount
                : 0;
            if (readCount > 0) updateUnreadCount(-readCount);
            setReadCount.current = true;
            
        }
    }, [initialMessages.readCount, updateUnreadCount]);

    const handleNewMessage = useCallback(
        (message: MessageDto) => {
            setMessages((prevState) => {
                return [...prevState, message];
            });

        },
        []
    )

    const handleReadMessages = useCallback(
        (messagesIds: string[]) => {
            setMessages((prevState) =>
                prevState.map((message) =>
                    messagesIds.includes(message.id)
                        ? {
                            ...message,
                            dateRead: formatShortDateTime(
                                new Date()
                            ),
                        }
                        : message
                )
            );
        },
        []
    );



useEffect(() => {
    const client = pusherClient;
    if (!client) return;
    const channelName = `private-chat-${chatId}`;
    const channel = client.subscribe(channelName);
    channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);
    channel.bind("pusher:subscription_error", (status: number) => {
        console.error("Pusher chat subscription error", { status, channelName });
    });

    return () => {
        channel.unbind("message:new", handleNewMessage);
        channel.unbind("messages:read", handleReadMessages);
        channel.unbind("pusher:subscription_error");
        channel.unsubscribe();
    };
}, [chatId, handleNewMessage, handleReadMessages]);


return (
    <div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden max-h-[70vh] pr-2">

        {messages.length === 0 ? (
            "No messages yet"
        ) : (
            <>
                {messages.map((message) => (
                    <MessageBox
                        key={message.id}
                        message={message}
                        currentUserId={currentUserId}
                    />
                ))}
            </>
        )}
    </div>
);
}