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
    ? "sticky top-0 z-50 h-14 bg-transparent sm:h-16"
    : "sticky top-0 z-50 h-14 bg-transparent sm:h-16";

  const navbarItemClassName = isHomePage
    ? [
        "text-sm sm:text-base",
        "text-default-700 font-medium",
        "data-[active=true]:text-default-900",
      ]
    : [
        "text-sm sm:text-base",
        "text-default-700 font-medium",
        "data-[active=true]:text-default-900",
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
          wrapper: "mx-auto w-full max-w-6xl gap-3 bg-transparent px-4 sm:px-6",
          item: navbarItemClassName,
        }}
      >
        <NavbarBrand
          as={Link}
          href="/"
          className="min-w-0 flex-none sm:flex-1"
        >
          <GiSelfLove
            size={24}
            className={brandIconClassName}
          />
          <div className="flex font-bold text-lg sm:text-2xl">
            <span className={brandTextClassName}>
              MatchVault
            </span>
          </div>
        </NavbarBrand>
        <NavbarContent
          justify="center"
          className="min-w-0 flex-1 max-w-[52vw] justify-start overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:max-w-[45vw] sm:justify-center [&::-webkit-scrollbar]:hidden"
        >
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
          className="flex flex-none items-center"
        >
          {isLoggedIn ? (
            <div className="ml-auto">
              <UserMenu userInfo={userInfo} />
            </div>
          ) : !isHomePage ? (
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Button
                as={Link}
                href="/login"
                variant="light"
                className="h-8 min-w-[72px] rounded-full px-3 text-xs font-semibold text-slate-900 transition hover:bg-black/5 sm:h-10 sm:min-w-[96px] sm:px-5 sm:text-sm"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="solid"
                className="h-8 min-w-[84px] rounded-full border border-black bg-black px-3 text-xs font-semibold text-white transition hover:bg-zinc-800 sm:h-10 sm:min-w-[112px] sm:px-6 sm:text-sm"
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