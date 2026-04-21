import React from 'react';
import MessageSidebar from "./MessageSidebar";
import { getMessagesByContainer } from "../actions/messageActions"
import MessageTable from "./MessageTable"



export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ container?: string }>;
}) {
  const INITIAL_MESSAGES_LIMIT = 5;
  const LOAD_MORE_MESSAGES_LIMIT = 2;

  const { container } = await searchParams;
  const normalizedContainer =
    container === "outbox" ? "outbox" : "inbox";


  const {messages, nextCursor} = await getMessagesByContainer(
    normalizedContainer,
    undefined,
    INITIAL_MESSAGES_LIMIT
  );

 




  return (
    <div className="mt-4 mb-8 grid grid-cols-1 gap-3 px-3 pb-3 sm:mt-6 sm:mb-10 sm:gap-4 sm:px-6 sm:pb-4 lg:mt-10 lg:grid-cols-12 lg:gap-5 lg:px-6 lg:pb-6">

      <div className="lg:col-span-3 xl:col-span-2">

        <MessageSidebar />
      </div>

      <div className="min-w-0 lg:col-span-9 xl:col-span-10">

        <MessageTable
          initialMessages={messages}
          nextCursor={nextCursor}
          loadMoreLimit={LOAD_MORE_MESSAGES_LIMIT}
        />
      </div>
    </div>
  );
}
