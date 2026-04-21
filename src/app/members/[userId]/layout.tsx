import { getMemberByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
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
    <div className="container mx-auto mt-4 mb-8 px-3 sm:mt-6 sm:mb-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 items-stretch gap-4 sm:gap-6 sm:min-h-[72vh]">
        <aside className="col-span-12 lg:col-span-3 lg:h-full">
          <MemberSidebar member={member} navLinks={navLinks}/>
        </aside>

        <main className="col-span-12 lg:col-span-9 lg:h-full">
          <div className="h-full rounded-2xl border border-default-200 bg-white shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
