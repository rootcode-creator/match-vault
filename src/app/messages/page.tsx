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
    <div className="mx-auto mb-8 mt-4 grid w-full max-w-7xl grid-cols-1 gap-4 px-3 pb-3 sm:mb-10 sm:mt-6 sm:gap-5 sm:px-6 sm:pb-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:px-8 lg:pb-6">

      <div className="lg:sticky lg:top-24">

        <MessageSidebar />
      </div>

      <div className="min-w-0">

        <MessageTable
          initialMessages={messages}
          nextCursor={nextCursor}
          loadMoreLimit={LOAD_MORE_MESSAGES_LIMIT}
        />
      </div>
    </div>
  );
}
