"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import FiltersWrapper from "./FiltersWrapper";
import { usePathname } from "next/navigation";

type Props = {
  userInfo: {
    name: string | null;
    image: string | null;
  } | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export default function TopNav({
  userInfo,
  isLoggedIn,
  isAdmin,
}: Props) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const memberLinks = [
    { href: "/members", label: "Matches" },
    { href: "/lists", label: "Lists" },
    { href: "/messages", label: "Messages" },
  ];

  const adminLinks = [
    {
      href: "/admin/moderation",
      label: "Photo Moderation",
    },
  ];

  const links =
    isAdmin ? adminLinks : memberLinks;
  return (
    <>
      <Navbar
        maxWidth="full"
        className="h-20 bg-gradient-to-r from-pink-400 via-red-400 to-pink-600"
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
          className="flex-1"
        >
          <GiSelfLove
            size={40}
            className="text-gray-200"
          />
          <div className="font-bold text-3xl flex">
            <span className="text-gray-200">
              MatchVault
            </span>
          </div>
        </NavbarBrand>
        <NavbarContent justify="center">
          {isLoggedIn &&
            links.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="flex-1"
        >
          {isLoggedIn ? (
            <div className="ml-auto">
              <UserMenu userInfo={userInfo} />
            </div>
          ) : !isHomePage ? (
            <div className="ml-auto flex items-center gap-3">
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                className="min-w-[96px] h-10 rounded-xl border border-white/80 px-6 text-base font-semibold text-slate-900 bg-white/95 hover:bg-white/90 transition"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="bordered"
                className="min-w-[112px] h-10 rounded-xl border border-white/80 px-6 text-base font-semibold text-slate-900 bg-white/95 hover:bg-white/90 transition"
              >
                Register
              </Button>
            </div>
          ) : null
          }
        </NavbarContent>
      </Navbar>
      <FiltersWrapper />
    </>
  );
}