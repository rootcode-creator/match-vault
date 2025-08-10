"use client";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import type { Session } from "next-auth";

type Props = {
  user: Session["user"] | null;
};

export default function TopNav({ user }: Props) {
  return (
    <Navbar
      maxWidth="full"
      position="sticky"
      className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-600 flex items-center h-20 top-0 z-50"
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-yellow-200",
        ],
      }}
    >
     
      <NavbarBrand as={Link} href="/" className="flex items-center gap-2 min-w-max">
        <GiSelfLove size={40} className="text-gray-200" />
        
          <span className="text-gray-200 font-bold text-3xl">MatchMe</span>
      </NavbarBrand>
     
      
      <NavbarContent className="flex-1 flex justify-center">
        <NavLink href="/members" label="Matches" />
        <NavLink href="/lists" label="Lists" />
        <NavLink href="/messages" label="Messages" />
      </NavbarContent>

  <NavbarContent  className="min-w-max flex gap-4 items-center mr-4 md:mr-6">


      {user ? (
        <UserMenu user={user} />
      ):(

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
  );
}
