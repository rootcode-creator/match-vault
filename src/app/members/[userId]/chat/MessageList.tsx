"use client";
import { MessageDto } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/util";
import useMessageStore from "@/hooks/useMessageStore";

type TypingIndicator = {
  senderId: string;
  senderName: string;
  isTyping: boolean;
};

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

    const [typing, setTyping] = useState<TypingIndicator | null>(null);
    const typingRef = useRef<HTMLDivElement | null>(null);

    const handleTypingUpdated = useCallback((data: TypingIndicator) => {
        setTyping(data.senderId === currentUserId ? null : data.isTyping ? data : null);
    }, [currentUserId]);

    useEffect(() => {
        if (typing && typingRef.current) {
            typingRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [typing]);


useEffect(() => {
    const client = pusherClient;
    if (!client) return;
    const channelName = `private-chat-${chatId}`;
    const channel = client.subscribe(channelName);
    channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);
    channel.bind("typing:updated", handleTypingUpdated);
    channel.bind("pusher:subscription_error", (status: number) => {
        console.error("Pusher chat subscription error", { status, channelName });
    });

    return () => {
        channel.unbind("message:new", handleNewMessage);
        channel.unbind("messages:read", handleReadMessages);
        channel.unbind("typing:updated", handleTypingUpdated);
        channel.unbind("pusher:subscription_error");
        channel.unsubscribe();
    };
}, [chatId, handleNewMessage, handleReadMessages, handleTypingUpdated]);


return (
    <div className="min-h-[24vh] max-h-[48vh] h-auto overflow-y-auto overflow-x-hidden rounded-[24px] border border-[#d6e5eb] bg-[linear-gradient(180deg,#fbfefe_0%,#f1f7fb_100%)] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:max-h-[48vh] sm:px-4">

        {messages.length === 0 ? (
            <div className="flex min-h-[32vh] flex-col items-center justify-center gap-3 text-sm font-medium text-[#67808f]">
                <div>No messages yet</div>
                {typing ? (
                    <div
                        ref={typingRef}
                        className="typing-indicator rounded-[18px] border border-[#d2dee6] bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-[0_3px_10px_rgba(16,31,47,0.05)]"
                    >
                        <span>{typing.senderName} is typing</span>
                        <span className="typing-indicator-dots inline-flex items-center gap-1">
                            <span className="typing-indicator-dot" />
                            <span className="typing-indicator-dot" />
                            <span className="typing-indicator-dot" />
                        </span>
                    </div>
                ) : null}
            </div>
        ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
                {messages.map((message, index) => {
                    const nextMessage = messages[index + 1];
                    const showAvatar = !nextMessage || nextMessage.senderId !== message.senderId;

                    return (
                        <MessageBox
                            key={message.id}
                            message={message}
                            currentUserId={currentUserId}
                            showAvatar={showAvatar}
                        />
                    );
                })}
                {typing ? (
                    <div
                        ref={typingRef}
                        className="typing-indicator rounded-[18px] border border-[#d2dee6] bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-[0_3px_10px_rgba(16,31,47,0.05)]"
                    >
                        <span>{typing.senderName} is typing</span>
                        <span className="typing-indicator-dots inline-flex items-center gap-1">
                            <span className="typing-indicator-dot" />
                            <span className="typing-indicator-dot" />
                            <span className="typing-indicator-dot" />
                        </span>
                    </div>
                ) : null}
            </div>
        )}
    </div>
);
}