import React from 'react';
import MessageSidebar from "./MessageSidebar";
import { getMessagesByContainer } from "../actions/messageActions"
import MessageTable from "./MessageTable"



export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ container?: string }>;
}) {
  const { container } = await searchParams;
  const normalizedContainer =
    container === "outbox" ? "outbox" : "inbox";


  const {messages, nextCursor} = await getMessagesByContainer(
    normalizedContainer 
  );

 




  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mt-10 mb-10 px-6 pb-6">

      <div className="col-span-2">

        <MessageSidebar />
      </div>

      <div className="col-span-10">

        <MessageTable initialMessages={messages} nextCursor={nextCursor} />
      </div>
    </div>
  );
}
