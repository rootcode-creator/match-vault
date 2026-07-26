"use client";

import { MessageDto } from "@/types";
import React, { useRef } from "react";
import clsx from "clsx";
import { useEffect } from "react";
import { timeAgo } from "@/lib/util";
import PresenceAvatar from "@/components/PresenceAvatar";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

type Props = {
  message: MessageDto;
  currentUserId: string;
  showAvatar?: boolean;
};

export default function MessageBox({
  message,
  currentUserId,
  showAvatar = true,
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
    <MessageAvatar>
      <Avatar>
        {message.senderImage ? (
          <AvatarImage src={message.senderImage} alt={message.senderName ?? "avatar"} />
        ) : (
          <AvatarFallback>{(message.senderName || "?").slice(0, 2)}</AvatarFallback>
        )}
      </Avatar>
    </MessageAvatar>
  );

  const messageContentClasses = clsx(
    "flex w-full max-w-[86%] flex-col gap-1 border px-3.5 py-2.5 shadow-[0_3px_10px_rgba(16,31,47,0.05)] sm:max-w-[76%] md:max-w-[64%] lg:max-w-[52%] xl:max-w-[720px] 2xl:max-w-[900px]",
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
        "flex w-full items-center gap-2",
        {
          "justify-end": isCurrentUserSender,
          "justify-start": !isCurrentUserSender,
        }
      )}
    >
      <div
        className={clsx("flex min-w-0 items-center gap-2", {
          "justify-end text-right": isCurrentUserSender,
        })}
      >
        <span
          className={clsx(
            "truncate text-sm font-semibold",
            isCurrentUserSender ? "text-cyan-100" : "text-[#0f2232]"
          )}
        >
          {message.senderName}
        </span>
        <span
          className={clsx(
            "whitespace-nowrap text-xs font-medium",
            isCurrentUserSender ? "text-cyan-200" : "text-[#5e7383]"
          )}
        >
          {message.created}
        </span>
      </div>
    </div>
  );

  const renderMessageContent = () => {
    return (
      <div className={messageContentClasses}>
        {renderMessageHeader()}
        <p className="whitespace-pre-wrap break-words py-1 text-[15px] font-medium leading-relaxed">
          {message.text}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-rows-1">
      <Message align={isCurrentUserSender ? "end" : "start"}>
        {showAvatar ? renderAvatar() : <MessageAvatar className="invisible" />}
        <MessageContent>
          <Bubble variant={isCurrentUserSender ? "default" : "muted"}>
            <BubbleContent>
              {renderMessageHeader()}
              <p className="whitespace-pre-wrap break-words py-1 text-[15px] font-normal leading-relaxed">
                {message.text}
              </p>
            </BubbleContent>
          </Bubble>
          {isCurrentUserSender && message.dateRead && message.recipientId !== currentUserId ? (
            <div className="mt-1 text-right text-[11px] font-medium text-slate-500">
              Read {timeAgo(message.dateRead)}
            </div>
          ) : null}
        </MessageContent>
      </Message>

      <div ref={messageEndRef} />
    </div>
  );
}