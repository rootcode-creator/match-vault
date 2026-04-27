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
    <div className="max-h-[62vh] overflow-y-auto overflow-x-hidden rounded-[24px] border border-[#d6e5eb] bg-[linear-gradient(180deg,#fbfefe_0%,#f1f7fb_100%)] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:max-h-[66vh] sm:px-4">

        {messages.length === 0 ? (
            <div className="flex min-h-[36vh] items-center justify-center text-sm font-medium text-[#67808f]">
                No messages yet
            </div>
        ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
                {messages.map((message) => (
                    <MessageBox
                        key={message.id}
                        message={message}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        )}
    </div>
);
}