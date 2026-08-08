
"use client";
import { signOutUser } from "@/app/actions/authActions";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import Image from "next/image";
import { Session } from "next-auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  userInfo:{
    name: string | null;
    image: string | null;
  }| null;
};

type Props = {
  userInfo: {
    name: string | null;
    image: string | null;
  } | null;
  isAdmin?: boolean;
};

export default function UserMenu({
  userInfo,
  isAdmin = false,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  const getDisplayName = (name: string | null | undefined) => {
    if (!name) return "";
    const trimmed = name.trim();
    return trimmed.length > 5 ? `${trimmed.slice(0, 5)}…` : trimmed;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="nav-avatar nav-avatar--shift relative">
        <Image
          src={userInfo?.image || "/images/user.png"}
          alt={userInfo?.name || "user avatar"}
          width={34}
          height={34}
          className="rounded-full"
        />
      </div>
    );
  }

   
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button className="nav-avatar nav-avatar--shift relative cursor-pointer">
          <Image
            src={userInfo?.image || "/images/user.png"}
            alt={userInfo?.name || "user avatar"}
            width={34}
            height={34}
            className="rounded-full"
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        aria-label="User actions menu"
        className="user-menu"
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="username"
            isReadOnly
            as="span"
            className="user-menu__header"
            aria-label="username"
          >
            Welcome, {getDisplayName(userInfo?.name)}
          </DropdownItem>
        </DropdownSection>
        {!isAdmin && (
          <DropdownItem
            key="2"
            as={Link}
            href="/members/edit"
            className="user-menu__item"
          >
            Edit profile
          </DropdownItem>
        )}
        <DropdownItem key="3"
          color="danger"
          onClick={async () => signOutUser()}
          className="user-menu__item user-menu__item--danger"
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}