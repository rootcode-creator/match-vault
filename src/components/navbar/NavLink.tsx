"use client";

import useMessageStore from "@/hooks/useMessageStore";
import { NavbarItem } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  label: string;
};

export default function NavLink({
  href,
  label,
}: Props) {
  const pathname = usePathname();
  const unreadCount = useMessageStore(
    (state) => state.unreadCount
  );

  const safeUnreadCount = Number.isFinite(unreadCount)
    ? unreadCount
    : 0;

  return (
    <NavbarItem
      isActive={pathname === href}
      as={Link}
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 sm:text-base ${
        pathname === href
          ? "bg-black text-white"
          : "text-default-700 hover:bg-black/5"
      }`}
    >
      <span>{label}</span>
      {href === "/messages" &&
        safeUnreadCount > 0 && (
          <span className="ml-1">
            ({safeUnreadCount})
          </span>
      )}
    </NavbarItem>
  );
}