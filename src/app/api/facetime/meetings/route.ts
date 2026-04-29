import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/app/actions/authActions";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    const meetings = await prisma.facetimeMeeting.findMany({
      where: {
        creatorId: userId,
      },
      orderBy: { startsAt: "asc" },
      select: {
        id: true,
        callId: true,
        description: true,
        startsAt: true,
      },
      take: 50,
    });

    return NextResponse.json({
      meetings: meetings.map((m) => ({
        id: m.id,
        callId: m.callId,
        description: m.description,
        startsAt: m.startsAt.toISOString(),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await request.json();

    const callId = String(body?.callId ?? "");
    const description = String(body?.description ?? "");
    const startsAtRaw = String(body?.startsAt ?? "");

    if (!callId) {
      return NextResponse.json({ error: "Missing callId" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Missing description" }, { status: 400 });
    }
    if (!startsAtRaw) {
      return NextResponse.json({ error: "Missing startsAt" }, { status: 400 });
    }

    const startsAt = new Date(startsAtRaw);
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: "Invalid startsAt" }, { status: 400 });
    }

    const meeting = await prisma.facetimeMeeting.upsert({
      where: { callId },
      create: {
        callId,
        description,
        startsAt,
        creatorId: userId,
      },
      update: {
        description,
        startsAt,
      },
      select: {
        id: true,
        callId: true,
        description: true,
        startsAt: true,
      },
    });

    return NextResponse.json({
      meeting: {
        id: meeting.id,
        callId: meeting.callId,
        description: meeting.description,
        startsAt: meeting.startsAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
