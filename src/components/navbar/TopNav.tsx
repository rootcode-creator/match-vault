"use client";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";

export default function TopNav() {
  return (
    <Navbar
      maxWidth="full"
      className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-600"
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-yellow-200",
        ],
      }}
    >
      <NavbarBrand as={Link} href="/" className="gap-3">
        <GiSelfLove size={50} className="text-gray-200" />
        <div className="font-bold text-3xl flex">
          <span className="text-gray-200">MatchMe</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center" className="gap-8">
        <NavLink href="/members" label="Matches" />
        <NavLink href="/lists" label="Lists" />
        <NavLink href="/messages" label="Messages" />
      </NavbarContent>
      <NavbarContent justify="end" className="gap-8">
        <Button
          as={Link}
          href="/login"
          variant="bordered"
          className="rounded-lg border border-white px-6 py-0 my-2 bg-transparent text-white font-semibold hover:bg-white/10 transition-colors"
          size="sm"
        >
          Login
        </Button>
        <Button
          as={Link}
          href="/register"
          variant="bordered"
          className="rounded-lg border border-white px-6 py-0 my-2 bg-transparent text-white font-semibold hover:bg-white/10 transition-colors"
          size="sm"
        >
          Register
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
