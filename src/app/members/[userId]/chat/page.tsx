import CardInnerWrapper from "@/components/CardInnerWrapper";
import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageActions";
import { getAuthUserId } from "@/app/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/util";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: targetUserId } = await params;
  const thread = await getMessageThread(targetUserId);
  const userId = await getAuthUserId();

  const chatId = createChatId(
    userId,
    targetUserId
  );

  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList
          initialMessages={thread}
          currentUserId={userId}
          chatId={chatId}
        />
      }
      footer={<ChatForm />}
    />
  );
}