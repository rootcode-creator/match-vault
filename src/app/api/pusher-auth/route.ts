import { auth } from "@/auth";
import { getPusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.formData();
        const socketId = body.get('socket_id') as string;
        const channel = body.get('channel_name') as string;

        if (!socketId || !channel) {
            return NextResponse.json({ error: "Missing socket_id or channel_name" }, { status: 400 });
        }

        const data = {
            user_id: session.user.id,

        }

    const pusherServer = getPusherServer();
    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
        return NextResponse.json(authResponse);

    } catch (error) {
        console.log('error', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}