import { getMemberByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import React, { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { getAuthUserId } from "@/app/actions/authActions";
import Link from "next/dist/client/link";

export default async function Layout({
  children,
}: {
  children: ReactNode;
  
}) {
  const userId  = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();


   const basePath = `/members/edit`;





  const navLinks = [


    { name: "Edit Profile", href: `${basePath}` },


    {


      name: "Update Photos",


      href: `${basePath}/photos`,


    },


  ];


  return (
    <div className="container mx-auto mt-4 mb-8 px-3 sm:mt-6 sm:mb-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 items-stretch gap-4 sm:gap-6 sm:min-h-[72vh]">
        <aside className="col-span-12 lg:col-span-3 lg:h-full">
          <MemberSidebar member={member} navLinks = {navLinks} />
        </aside>

        <main className="col-span-12 lg:col-span-9 lg:h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
