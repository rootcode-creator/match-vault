import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendScheduledMeetingEmail } from "@/lib/mail";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_SECRET_KEY ?? process.env.STREAM_SECRET;

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const callId = body?.callId as string;
    const description = body?.description as string;
    const startsAt = body?.startsAt as string;

    if (!callId || !description || !startsAt) {
      return NextResponse.json(
        { error: "Missing required fields: callId, description, startsAt" },
        { status: 400 }
      );
    }

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Stream is not configured" },
        { status: 500 }
      );
    }

    // Initialize Stream client server-side (no media access needed)
    const client = new StreamClient(apiKey, apiSecret);

    // Create the call object
    const call = client.video.call("default", callId);
    await call.getOrCreate({
      data: {
        created_by_id: userId,
        starts_at: new Date(startsAt),
        custom: {
          description,
        },
      },
    });

    // Send email notification to the user
    if (existingUser.email) {
      await sendScheduledMeetingEmail(existingUser.email, description, callId).catch((error) => {
        console.error("Failed to send scheduled meeting email:", error);
      });
    }

    return NextResponse.json({
      success: true,
      callId: call.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create call";
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
