import { getMemberByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import React from "react";

export default async function MemberDetailedPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-foreground">Profile</h2>
      <div className="my-3 h-px bg-default-200" />
      <div className="text-sm text-default-600 whitespace-pre-line">
        {member.description || "No description provided."}
      </div>
    </div>
  );
}