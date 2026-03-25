"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import FiltersWrapper from "./FiltersWrapper";

type UserInfo = {
  name: string | null;
  image: string | null;
} | null;

type Props = {
  userInfo: UserInfo;
};

export default function TopNav({ userInfo }: Props) {
  return (
    <>
    <header className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-600 pl-3 sm:pl-5">
      <Navbar
        maxWidth="full"
        position="sticky"
        className="flex items-center h-20 top-0 z-50"
        classNames={{
          item: [
            "text-xl",
            "text-white",
            "uppercase",
            "data-[active=true]:text-yellow-200",
          ],
        }}
      >
        <NavbarBrand
          as={Link}
          href="/"
          className="flex items-center gap-2 min-w-max"
        >
          <GiSelfLove size={40} className="text-gray-200" />

          <span className="text-gray-200 font-bold text-3xl">MatchVault</span>
        </NavbarBrand>

        <NavbarContent className="flex-1 flex justify-center -translate-x-4 sm:-translate-x-6 md:-translate-x-7 lg:-translate-x-8">
          <NavLink href="/members" label="Matches" />
          <NavLink href="/lists" label="Lists" />
          <NavLink href="/messages" label="Messages" />
        </NavbarContent>

        <NavbarContent className="min-w-max flex gap-4 items-center mr-4 md:mr-6">
          {userInfo ? (
            <UserMenu userInfo={userInfo} />
          ) : (
            <>
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                disableRipple
                className="rounded-lg border border-white px-3 py-0 my-3 bg-transparent text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="bordered"
                disableRipple
                className="rounded-lg border border-white px-1 py-0 my-3 bg-transparent text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Register
              </Button>
            </>
          )}
        </NavbarContent>
      </Navbar>
    </header>
    <FiltersWrapper />
</>
  );
}
