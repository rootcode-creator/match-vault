
"use client";
import { signOutUser } from "@/app/actions/authActions";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import Link from "next/link";
import React from "react";

type Props = {
  userInfo:{
    name: string | null;
    image: string | null;
  }| null;
};

export default function UserMenu({
  userInfo,
}: Props) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          className="nav-avatar nav-avatar--shift"
          color="default"
          name={userInfo?.name || "user avatar"}
          size="sm"
          src={userInfo?.image || "/images/user.png"}
        />
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        aria-label="User actions menu"
        className="user-menu"
        itemClasses={{
          base: "rounded-full",
        }}
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
          onClick={async () => signOutUser()}
          className="user-menu__item user-menu__item--danger"
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}