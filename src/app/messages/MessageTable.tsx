
"use client";

import { MessageDto } from "@/types";

import {
    Avatar, Button,
    Card, Table,
    TableBody, TableCell,
    TableColumn,
    TableHeader, TableRow,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";


import React, { Key, useCallback, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { deleteMessage } from "../actions/messageActions";
import { truncateString } from "@/lib/util";
import PresenceAvatar from "@/components/PresenceAvatar";
import { useMessages } from "@/hooks/useMessages";
import MessageTableCell from "./MessageTableCell";

type Props = {
    initialMessages: MessageDto[];
    nextCursor?: string;
  loadMoreLimit?: number;
};

const outboxColumns = [
    { key: "recipientName", label: "Recipient" },
    { key: "text", label: "Message" },
    { key: "created", label: "Date sent" },
    { key: "actions", label: "Actions" },
];

const inboxColumns = [
    { key: "senderName", label: "Sender" },
    { key: "text", label: "Message" },
    { key: "created", label: "Date received" },
    { key: "actions", label: "Actions" },
];

export default function MessageTable({ initialMessages,
     nextCursor,
  loadMoreLimit,
}: Props) {


    const {columns, isOutbox, isDeleting, deleteMessage, selectRow, messages, loadMore, loadingMore, hasMore}= useMessages(initialMessages, nextCursor, loadMoreLimit);

   
    


    return (
    <div className="flex min-h-[60vh] min-w-0 flex-col lg:h-[80vh]">
      <Card className="h-full min-w-0 overflow-hidden">
        <Table
          aria-label="Table with messages"
          selectionMode="single"
          onRowAction={(key: React.Key) =>
            selectRow(key)
          }
          shadow="none"
          className="flex h-[58vh] min-w-full flex-col gap-3 overflow-auto sm:h-[60vh] md:h-[68vh] lg:h-[80vh]"
          removeWrapper={false}
          classNames={{
            wrapper: "overflow-x-auto",
            table: "min-w-[640px] sm:min-w-full",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
                <TableColumn
                key={column.key}
                width={
                  column.key === "text"
                    ? "50%"
                    : undefined
                }
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={messages}
            emptyContent="No messages for this container"
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
              >
                {(columnKey) => (
                  <TableCell
                    className={`${
                      !item.dateRead && !isOutbox
                        ? "font-semibold"
                        : ""
                    }`}
                  >
                    <MessageTableCell
                      item={item}
                      columnKey={
                        columnKey as string
                      }
                      isOutbox={isOutbox}
                      deleteMessage={
                        deleteMessage
                      }
                      isDeleting={
                        isDeleting.loading &&
                        isDeleting.id === item.id
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="sticky bottom-0 flex justify-stretch px-3 pb-3 sm:justify-end">
          <Button
            color="default"
            variant="bordered"
            radius="md"
            className="w-full rounded-xl border border-black/20 bg-default-50 px-5 py-2 text-sm font-semibold text-black hover:bg-black/5 sm:w-auto sm:min-w-36 sm:px-6 sm:text-base disabled:bg-default-100 disabled:border-black/10 disabled:text-default-400"
            isLoading={loadingMore}
            isDisabled={!hasMore}
            onClick={loadMore}
          >
            {hasMore
              ? "Load more"
              : "No more messages"}
          </Button>
        </div>
      </Card>
    </div>
    );
}