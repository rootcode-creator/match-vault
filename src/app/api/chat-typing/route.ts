import { auth } from "@/auth";
import { getPusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const recipientUserId = body?.recipientUserId as string;
    const isTyping = body?.isTyping as boolean;

    if (!recipientUserId || typeof isTyping !== "boolean") {
      return NextResponse.json(
        { error: "recipientUserId and isTyping are required" },
        { status: 400 }
      );
    }

    const chatId = createChatId(session.user.id, recipientUserId);
    const pusherServer = getPusherServer();

    await pusherServer.trigger(
      `private-chat-${chatId}`,
      "typing:updated",
      {
        senderId: session.user.id,
        senderName: session.user.name ?? "Someone",
        isTyping,
      }
    );

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("chat-typing failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
