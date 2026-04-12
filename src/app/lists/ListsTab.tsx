"use client";

import { Tab, Tabs } from "@heroui/react";
import { Member } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { Key } from "react";
import MemberCard from "../members/MemberCard";
import LoadingComponent from "@/app/members/[userId]/loading";

type Props = {
  members: Member[];
  likeIds: string[];
};

type TabKey = "source" | "target" | "mutual";

export default function ListsTab({ members, likeIds }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs: { id: TabKey; label: string }[] = [
    { id: "source", label: "Members I have liked" },
    { id: "target", label: "Members that like me" },
    { id: "mutual", label: "Mutual likes" },
  ];

  // Per-tab accents (no dots; unselected stays neutral)
  const accents: Record<
    TabKey,
    { hover: string; selectedText: string; selectedRing: string; selectedBg: string }
  > = {
    source: {
      hover: "data-[hover=true]:bg-sky-50",
      selectedText: "data-[selected=true]:text-sky-800",
      selectedRing: "data-[selected=true]:ring-sky-300",
      selectedBg: "data-[selected=true]:bg-sky-100/70",
    },
    target: {
      hover: "data-[hover=true]:bg-amber-50",
      selectedText: "data-[selected=true]:text-amber-800",
      selectedRing: "data-[selected=true]:ring-amber-300",
      selectedBg: "data-[selected=true]:bg-amber-100/70",
    },
    mutual: {
      hover: "data-[hover=true]:bg-emerald-50",
      selectedText: "data-[selected=true]:text-emerald-800",
      selectedRing: "data-[selected=true]:ring-emerald-300",
      selectedBg: "data-[selected=true]:bg-emerald-100/70",
    },
  };

  const selectedType: TabKey = (searchParams.get("type") as TabKey) || "source";

  function handleTabChange(key: Key) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", String(key));
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col mt-2 gap-5">
      <Tabs
        aria-label="Like tabs"
        items={tabs}
        color="default"
        size="sm"
        radius="full"
        variant="light"
        selectedKey={selectedType}
        onSelectionChange={(key) => handleTabChange(key)}
        className="w-full px-4 sm:px-6 lg:px-8"
        classNames={{
          tabList:
            "mx-auto w-full max-w-full justify-start gap-2 overflow-x-auto p-1 rounded-2xl bg-white/80 backdrop-blur border border-default-200 shadow-lg ring-1 ring-black/5 sm:w-fit sm:justify-center",
          cursor: "hidden",
          tab:
            "h-10 px-4 rounded-xl transition-colors ring-1 ring-black/5 data-[selected=true]:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/10 sm:h-11 sm:px-6",
          tabContent:
            "text-xs font-semibold text-foreground-600 data-[selected=true]:text-foreground sm:text-sm",
        }}
      >
        {(item) => (
          <Tab
            key={item.id}
            title={item.label}
            className={`${accents[item.id].hover} ${accents[item.id].selectedText} ${accents[item.id].selectedRing} ${accents[item.id].selectedBg}`}
          >
            {isPending ? (
              <LoadingComponent />
            ) : members.length > 0 ? (
              <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-6 xl:gap-8">
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} likeIds={likeIds} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
                No members for this filter
              </div>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}