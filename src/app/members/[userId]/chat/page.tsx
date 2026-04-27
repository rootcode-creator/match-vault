import CardInnerWrapper from "@/components/CardInnerWrapper";
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
            <div className="relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d7e3e9] bg-white shadow-sm sm:h-11 sm:w-11">
              <img
                src={member?.image || "/images/user.png"}
                alt="Conversation avatar"
                className="h-full w-full object-cover"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#30c86f]"
                aria-label="Online"
              />
            </div>
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