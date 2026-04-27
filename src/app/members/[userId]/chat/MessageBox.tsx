"use client";

import { MessageDto } from "@/types";
import React, { useRef } from "react";
import clsx from "clsx";
import { useEffect } from "react";
import { timeAgo } from "@/lib/util";
import PresenceAvatar from "@/components/PresenceAvatar";

type Props = {
  message: MessageDto;
  currentUserId: string;
};

export default function MessageBox({
  message,
  currentUserId,
}: Props) {
  const isCurrentUserSender =
    message.senderId === currentUserId;

  const messageEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
  }, [messageEndRef]);

  const renderAvatar = () => (
    <div className="self-end pb-1">
      <PresenceAvatar
        src={message.senderImage}
        userId={message.senderId}
      />
    </div>
  );

  const messageContentClasses = clsx(
    "flex max-w-[86%] flex-col gap-1 border px-3.5 py-2.5 shadow-[0_3px_10px_rgba(16,31,47,0.05)] sm:max-w-[76%] md:max-w-[64%] lg:max-w-[52%]",
    {
      "rounded-[18px_18px_6px_18px] border-[#cdd9d1] bg-[linear-gradient(180deg,#eef5f1_0%,#dae6de_100%)] text-[#152823]":
        isCurrentUserSender,
      "rounded-[18px_18px_18px_6px] border-[#d2dee6] bg-[linear-gradient(180deg,#f6fbff_0%,#e2ebf3_100%)] text-[#182a38]":
        !isCurrentUserSender,
    }
  );

  const renderMessageHeader = () => (
    <div
      className={clsx(
        "flex w-full items-center justify-between gap-3",
        {
          "flex-row-reverse": isCurrentUserSender,
        }
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-semibold text-[#0f2232]">
          {message.senderName}
        </span>
        <span className="whitespace-nowrap text-xs font-medium text-[#5e7383]">
          {message.created}
        </span>
      </div>
      {message.dateRead && message.recipientId !== currentUserId ? (
        <span className="whitespace-nowrap text-[11px] font-medium text-[#5f7461]">
          Read {timeAgo(message.dateRead)}
        </span>
      ) : (
        <span className="text-[11px] text-transparent">.</span>
      )}
    </div>
  );

  const renderMessageContent = () => {
    return (
      <div className={messageContentClasses}>
        {renderMessageHeader()}
        <p className="whitespace-pre-wrap break-words py-1 text-[15px] font-medium leading-relaxed [overflow-wrap:anywhere]">
          {message.text}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-rows-1">
      <div
        className={clsx("mb-1 flex gap-2", {
          "justify-end text-right":
            isCurrentUserSender,
          "justify-start": !isCurrentUserSender,
        })}
      >
        {!isCurrentUserSender && renderAvatar()}
        {renderMessageContent()}
        {isCurrentUserSender && renderAvatar()}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
}