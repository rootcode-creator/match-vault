
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

type Props = {
    messages: MessageDto[];
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

export default function MessageTable({ messages,
}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOutbox = searchParams.get("container") === "outbox";

    const [isDeleting, setDeleting] = useState({
        id: "",
        loading: false,
    });

    const columns = isOutbox ? outboxColumns : inboxColumns;


    const handleDeleteMessage = useCallback(
        async (message: MessageDto) => {
            setDeleting({
                id: message.id,
                loading: true,
            });
            await deleteMessage(message.id, isOutbox);
            router.refresh();
            setDeleting({ id: "", loading: false });
        },
        [isOutbox, router]
    );


    const handleRowSelect = (key: Key) => {
        const message = messages.find(
            (m) => m.id === key
        );
        const url = isOutbox
            ? `/members/${message?.recipientId}`
            : `/members/${message?.senderId}`;
        router.push(url + "/chat");
    };


    const renderCell = useCallback(
        (
            item: MessageDto,
            columnKey: keyof MessageDto) => {
            const cellValue = item[columnKey];

            switch (columnKey) {
                case "recipientName":
                case "senderName": return (
                    <div className="flex items-center gap-2 cursor-pointer">

                        <PresenceAvatar
                            userId={
                                isOutbox
                                    ?item.recipientId
                                    : item.senderId
                            }
                            src={
                                isOutbox
                                    ? item.recipientImage
                                    : item.senderImage
                                
                            }
                        />
                        <span>{cellValue}</span>

                    </div>
                );
                case "text":
                    return (
                        <div>
                            {truncateString(cellValue, 80)}
                        </div>

                    );
                case "created":
                    return cellValue;

                default:
                    return (
                        <Button
                            isIconOnly
                            variant="light"
                            onClick={() =>
                                handleDeleteMessage(item)
                            }

                            isLoading={
                                isDeleting.id === item.id &&
                                isDeleting.loading
                            }
                        >
                            <AiFillDelete size={24}
                                className="text-danger"

                            />
                        </Button>
                    );
            }
        },

        [isOutbox,
            isDeleting.id,
            isDeleting.loading,
            handleDeleteMessage,
        ]

    );



    return (
        <Card className="flex flex-col h-[80vh] overflow-hidden rounded-2xl border border-default-200 bg-white/90 shadow-lg backdrop-blur px-5 pb-5">
            <div className="flex items-center justify-between pt-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-default-500">
                        {isOutbox ? "Sent" : "Received"}
                    </p>
                    <h2 className="text-2xl font-bold text-default-900">
                        {isOutbox ? "Outbox" : "Inbox"}
                    </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {messages.length} {messages.length === 1 ? "message" : "messages"}
                </span>
            </div>
            <div className="mt-3 pb-2 flex-1 overflow-y-auto">
                <Table
                    aria-label="Table with messages"
                    selectionMode="single"
                    onRowAction={(key) =>
                        handleRowSelect(key)
                    }
                    shadow="none"
                    classNames={{
                        table: "border-separate border-spacing-y-6",
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
                                className={`${column.key === "actions" ? "text-right" : ""} text-base font-semibold text-default-500`}
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
                                className="group cursor-pointer"
                            >
                                {(columnKey) => (
                                    <TableCell
                                        className={`${!item.dateRead && !isOutbox
                                            ? "font-semibold"
                                            : ""
                                            } ${columnKey === "actions" ? "text-right" : ""} ${columnKey === (isOutbox ? "recipientName" : "senderName") ? "rounded-l-xl" : ""} ${columnKey === "actions" ? "rounded-r-xl" : ""} bg-white/90 px-4 py-3 shadow-sm ring-1 ring-default-200/70 transition-all group-hover:shadow-md group-hover:bg-white`}
                                    >
                                        {renderCell(
                                            item,
                                            columnKey as keyof MessageDto
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>

    );
}