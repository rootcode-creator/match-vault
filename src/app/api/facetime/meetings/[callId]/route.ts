import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/app/actions/authActions";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ callId: string }> }
) {
  try {
    const userId = await getAuthUserId();
    const { callId } = await context.params;

    if (!callId) {
      return NextResponse.json({ error: "Missing callId" }, { status: 400 });
    }

    const result = await prisma.facetimeMeeting.deleteMany({
      where: {
        callId,
        creatorId: userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
