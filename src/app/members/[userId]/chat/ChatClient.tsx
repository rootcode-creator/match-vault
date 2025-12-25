"use client";

import React from "react";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import ChatForm from "./ChatForm";
import MessageBox from "./MessageBox";
import { MessageDto } from "@/types";

interface ChatClientProps {
  messages: MessageDto[];
  currentUserId: string;
  recipientUserId: string;
}

export default function ChatClient({
  messages,
  currentUserId,
  recipientUserId,
}: ChatClientProps) {
  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-4">
          {messages.length === 0 ? (
            <p className="text-center text-default-500">
              Start the conversation by sending a message.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBox
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      }
      footer={<ChatForm recipientUserId={recipientUserId} />}
    />
  );
}
