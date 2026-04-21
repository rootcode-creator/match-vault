"use client";

import useMessageStore from "@/hooks/useMessageStore";
import { Chip } from "@heroui/react";
import clsx from "clsx";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";
import { GoInbox } from "react-icons/go";
import { MdOutlineOutbox } from "react-icons/md";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selected = searchParams.get("container") || "inbox";

  const items = [
    {
      key: "inbox",
      label: "Inbox",
      icon: GoInbox,
      chip: true,
    },
    {
      key: "outbox",
      label: "Outbox",
      icon: MdOutlineOutbox,
      chip: false,
    },
  ];

  const handleSelect = (key: string) => {
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  };

  const unreadCount = useMessageStore(
    (state) => state.unreadCount
  );

  const safeUnreadCount = Number.isFinite(unreadCount)
    ? unreadCount
    : 0;

  return (
    <div className="flex flex-row flex-nowrap items-center gap-2 overflow-x-auto rounded-2xl border border-default-200 bg-white/90 p-2 shadow-lg backdrop-blur [scrollbar-width:none] md:flex-col md:items-stretch md:gap-0 md:overflow-visible [&::-webkit-scrollbar]:hidden">
      <div className="shrink-0 px-3 pt-2 pb-1 md:w-full md:pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-default-500">
          Messages
        </p>
      </div>
      {items.map(
        ({ key, icon: Icon, label, chip }) => (
          <div
            key={key}
            className={clsx(
              "flex min-w-[140px] flex-1 items-center gap-2 rounded-xl border px-3 py-2 transition-colors md:min-w-0 md:flex-none md:gap-3",
              "shrink-0",
              {
                "border-primary/30 bg-primary/5 text-primary font-semibold":
                  selected === key,
                "border-transparent text-default-700 hover:bg-default-100/70":
                  selected !== key,
              }
            )}
            onClick={() => handleSelect(key)}
          >
            <div
              className={clsx(
                "h-6 w-1 rounded-full",
                selected === key ? "bg-primary" : "bg-transparent"
              )}
            />
            <Icon size={20} />
            <div className="flex items-center justify-between flex-grow">
              <span>{label}</span>
              {chip && <Chip>{safeUnreadCount}</Chip>}
              {/* Demo Purpose: will change the incoming messages count in upcoming commits */}
            </div>
          </div>
        )
      )}
    </div>
  );
}