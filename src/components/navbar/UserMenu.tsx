
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

export default function UserMenu({
  userInfo,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

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
            Signed in as {userInfo?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem
        key="2"
          as={Link}
          href="/members/edit"
          className="user-menu__item"
        >
          Edit profile
        </DropdownItem>
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