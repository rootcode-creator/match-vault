"use client";

import PresenceAvatar from "@/components/PresenceAvatar";
import { truncateString } from "@/lib/util";
import { MessageDto } from "@/types";
import { Button } from "@heroui/react";
import React from "react";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  item: MessageDto;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (message: MessageDto) => void;
  isDeleting: boolean;
};

export default function MessageTableCell({
  item,
  columnKey,
  isOutbox,
  deleteMessage,
  isDeleting,
}: Props) {
  const cellValue =
    item[columnKey as keyof MessageDto];

  switch (columnKey) {
    case "recipientName":
    case "senderName":
      return (
        <div className="flex min-w-0 items-center gap-2 cursor-pointer">
          <PresenceAvatar
            userId={
              isOutbox
                ? item.recipientId
                : item.senderId
            }
            src={
              isOutbox
                ? item.recipientImage
                : item.senderImage
            }
          />
          <span className="truncate">{cellValue}</span>
        </div>
      );
    case "text":
      return (
        <div className="max-w-[220px] truncate sm:max-w-[360px]">{truncateString(cellValue, 80)}</div>
      );
    case "created":
      return cellValue;
    default:
      return (
        <Button
          isIconOnly
          variant="light"
          onClick={() => deleteMessage(item)}
          isLoading={isDeleting}
        >
          <AiFillDelete
            size={24}
            className="text-danger"
          />
        </Button>
      );
  }
}