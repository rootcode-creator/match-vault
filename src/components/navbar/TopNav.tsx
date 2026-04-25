"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
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

  const navbarClassName = "sticky top-0 z-50 h-14 border-b border-neutral-200 bg-white sm:h-16";

  return (
    <>
      <Navbar
        maxWidth="full"
        className={navbarClassName}
        classNames={{
          base: "z-50",
          wrapper: "mx-auto w-full max-w-6xl gap-3 bg-transparent px-4 sm:px-6",
          item: [
            "text-sm sm:text-base",
            "text-neutral-700 font-normal",
            "data-[active=true]:text-black",
          ],
        }}
      >
        <NavbarBrand
          as={Link}
          href="/"
          className="min-w-0 flex-none sm:flex-1"
        >
          <GiSelfLove
            size={24}
            className="text-black"
          />
          <div className="flex text-lg font-medium text-black sm:text-2xl">
            <span>
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
                className="h-8 min-w-[72px] rounded-full border border-neutral-300 bg-white px-5 text-xs font-normal text-neutral-700 sm:h-10 sm:min-w-[96px] sm:text-sm"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="solid"
                className="h-8 min-w-[84px] rounded-full border border-black bg-black px-6 text-xs font-normal text-white sm:h-10 sm:min-w-[112px] sm:text-sm"
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