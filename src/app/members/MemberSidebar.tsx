"use client";

import usePresenceStore from "@/hooks/usePresenceStore";
import { calculateAge } from "@/lib/util";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { Member } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

export default function MemberSidebar({
  member,
  navLinks,
}: Props) {
  const pathname = usePathname();
  const membersId = usePresenceStore(
    (state) => state.membersId
  );

  const isOnline =
    membersId.indexOf(member.userId) !== -1;

  return (
    <Card className="w-full overflow-hidden border border-default-200 bg-white shadow-sm lg:sticky lg:top-6">
      <div className="relative h-24 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500">
        <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
          <div className="relative rounded-full bg-white p-1 shadow-sm">
            <Image
              height={120}
              width={120}
              src={member.image || "/images/user.png"}
              alt="User profile main image"
              classNames={{
                wrapper: "rounded-full overflow-hidden",
                img: "rounded-full aspect-square object-cover",
              }}
            />

            <span
              className={clsx(
                "absolute -bottom-5 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full ring-2 ring-white",
                isOnline
                  ? "bg-red-500 animate-pulse"
                  : "bg-default-300"
              )}
              aria-label={isOnline ? "Online" : "Offline"}
            />
          </div>
        </div>
      </div>

      <CardBody className="pt-14 pb-3 px-4">
        <div className="flex flex-col items-center">
          <div className="mt-2 flex items-center gap-2">
            <div className="text-lg font-semibold text-default-900">
              {member.name}, {calculateAge(member.dateOfBirth)}
            </div>
          </div>

          <div className="text-sm text-default-500">
            {member.city}, {member.country}
          </div>
        </div>

        <Divider className="my-4" />

        <nav className="flex flex-col gap-2 mb-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.name}
                className={clsx(
                  "w-full rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-default-100 text-default-900 ring-1 ring-default-200"
                    : "text-default-700 hover:bg-default-100/70"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </CardBody>

      <Divider />

      <CardFooter className="pt-4">
        <Button
          as={Link}
          href="/members"
          fullWidth
          className="font-semibold"
          color="default"
          variant="bordered"
        >
          Go back
        </Button>
      </CardFooter>
    </Card>
  );
}