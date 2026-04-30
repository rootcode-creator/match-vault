import { NextResponse } from "next/server";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { getAuthUserId } from "@/app/actions/authActions";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
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

    // Initialize Stream client server-side (no media access needed)
    const client = new StreamVideoClient({
      apiKey,
      apiSecret,
    });

    // Create the call object
    const call = client.call("default", callId);
    await call.getOrCreate({
      data: {
        starts_at: new Date(startsAt).toISOString(),
        custom: {
          description,
        },
      },
    });

    return NextResponse.json({
      success: true,
      callId: call.id,
    });
  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}
