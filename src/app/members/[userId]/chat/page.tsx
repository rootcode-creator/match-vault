
import React from "react";
import { getMessageThread } from "@/app/actions/messageActions";
import { getAuthUserId } from "@/app/actions/authActions";
import ChatClient from "./ChatClient";

type ChatPageProps = {
  params: {
    userId: string;
  };
};

export default async function ChatPage({ params }: ChatPageProps) {
  const currentUserId = await getAuthUserId();
  const messages = await getMessageThread(params.userId);

  return (
    <ChatClient
      messages={messages ?? []}
      currentUserId={currentUserId}
      recipientUserId={params.userId}
    />
  );
}