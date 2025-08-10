
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
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type Props = {
  user: Session["user"];
};

export default function UserMenu({
  user,
}: Props) {
   
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          className="nav-avatar nav-avatar--shift"
          color="default"
          name={user?.name || "user avatar"}
          size="sm"
          src={user?.image || "/images/user.png"}
        />
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
            Signed in as {user?.name}
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