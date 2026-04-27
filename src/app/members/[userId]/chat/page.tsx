import CardInnerWrapper from "@/components/CardInnerWrapper";
import PresenceAvatar from "@/components/PresenceAvatar";
import { getMemberByUserId } from "@/app/actions/memberActions";
import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageActions";
import { getAuthUserId } from "@/app/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/util";
import { IoInformationCircleOutline } from "react-icons/io5";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: targetUserId } = await params;
  const thread = await getMessageThread(targetUserId);
  const member = await getMemberByUserId(targetUserId);
  const userId = await getAuthUserId();

  const chatId = createChatId(
    userId,
    targetUserId
  );

  return (
    <CardInnerWrapper
      header={
        <div className="flex w-full items-center justify-between rounded-2xl border border-[#dce7eb] bg-[linear-gradient(180deg,#f9fdfd_0%,#edf5f8_100%)] px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2.5">
            <PresenceAvatar
              userId={targetUserId}
              src={member?.image}
            />
            <div className="leading-tight">
              <p className="text-base font-semibold text-[#101f2f] sm:text-lg">
                {member?.name || "Conversation"}
              </p>
              <p className="text-xs font-medium text-[#5f7484] sm:text-sm">
                Direct message
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Conversation info"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cdd9df] bg-white/90 text-[#344a5a] transition hover:bg-[#f2f7fa]"
          >
            <IoInformationCircleOutline size={18} />
          </button>
        </div>
      }
      body={
        <MessageList
          initialMessages={thread}
          currentUserId={userId}
          chatId={chatId}
        />
      }
      compactFooter
      footer={<ChatForm />}
    />
  );
}