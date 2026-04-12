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

  const navbarClassName = isHomePage
    ? "sticky top-0 z-50 h-16 sm:h-20 border-b border-default-200 bg-white"
    : "sticky top-0 z-50 h-16 sm:h-20 border-b border-default-200 bg-white";

  const navbarItemClassName = isHomePage
    ? [
        "text-sm sm:text-base",
        "text-default-700",
        "uppercase",
        "data-[active=true]:text-indigo-700",
      ]
    : [
        "text-sm sm:text-base md:text-lg",
        "text-default-700",
        "uppercase",
        "data-[active=true]:text-indigo-700",
      ];

  const brandIconClassName = isHomePage
    ? "text-default-800"
    : "text-default-800";

  const brandTextClassName = isHomePage
    ? "text-default-900"
    : "text-default-900";

  return (
    <>
      <Navbar
        maxWidth="full"
        className={navbarClassName}
        classNames={{
          base: "z-50",
          wrapper: "bg-white",
          item: navbarItemClassName,
        }}
      >
        <NavbarBrand
          as={Link}
          href="/"
          className="flex-1"
        >
          <GiSelfLove
            size={32}
            className={brandIconClassName}
          />
          <div className="flex font-bold text-xl sm:text-2xl md:text-3xl">
            <span className={brandTextClassName}>
              MatchVault
            </span>
          </div>
        </NavbarBrand>
        <NavbarContent justify="center" className="max-w-[45vw] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
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
                className="h-9 min-w-[84px] rounded-xl border border-default-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-default-100 sm:h-10 sm:min-w-[96px] sm:px-6 sm:text-base"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="bordered"
                className="h-9 min-w-[98px] rounded-xl border border-indigo-600 bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:h-10 sm:min-w-[112px] sm:px-6 sm:text-base"
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