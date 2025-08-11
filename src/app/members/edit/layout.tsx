import { getMemberByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@heroui/react";
import { getAuthUserId } from "@/app/actions/authActions";

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const userId = await getAuthUserId();

  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  const basePath = `/members/${member.userId}`;

  const navLinks = [
    { name: "Profile", href: `${basePath}` },
    {
      name: "Photos",
      href: `${basePath}/photos`,
    },
    { name: "Chat", href: `${basePath}/chat` },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <MemberSidebar member={member} navLinks={navLinks} />
        </aside>

        <main className="col-span-12 lg:col-span-9">
          <div className="rounded-2xl border border-default-200 bg-white shadow-sm min-h-[70vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function MemberEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-4 py-6">{children}</div>;
}
