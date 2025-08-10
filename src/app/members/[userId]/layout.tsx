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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <MemberSidebar member={member} />
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
