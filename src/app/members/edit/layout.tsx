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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10">
      <div className="grid grid-cols-12 gap-6 items-stretch min-h-[72vh]">
        <aside className="col-span-12 lg:col-span-3 h-full">
          <MemberSidebar member={member} navLinks = {navLinks} />
        </aside>

        <main className="col-span-12 lg:col-span-9 h-full">
          <div className="rounded-2xl border border-default-200 bg-white shadow-sm h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
