import React from "react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-foreground">Chat</h2>
      <div className="my-3 h-px bg-default-200" />
      <div className="text-sm text-default-600">
        Chat goes here for {userId}
      </div>
    </div>
  );
}