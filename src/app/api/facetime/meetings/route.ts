import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendScheduledMeetingEmail } from '@/lib/mail';
import { getAuthUserId } from "@/app/actions/authActions";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    // Get meetings created by the user
    const createdMeetings = await prisma.facetimeMeeting.findMany({
      where: {
        creatorId: userId,
      },
      orderBy: { startsAt: "asc" },
      select: {
        id: true,
        callId: true,
        description: true,
        startsAt: true,
        creatorId: true,
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
        participants: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          where: {
            userId: {
              not: userId,
            },
          },
        },
      },
      take: 50,
    });

    // Get meetings where user is a participant (but not the creator)
    const participantMeetings = await prisma.facetimeMeeting.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
        creatorId: {
          not: userId,
        },
      },
      orderBy: { startsAt: "asc" },
      select: {
        id: true,
        callId: true,
        description: true,
        startsAt: true,
        creatorId: true,
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
        participants: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          where: {
            userId: {
              not: userId,
            },
          },
        },
      },
      take: 50,
    });

    // Combine and format all meetings
    const allMeetings = [...createdMeetings, ...participantMeetings].map((m) => ({
      id: m.id,
      callId: m.callId,
      description: m.description,
      startsAt: m.startsAt.toISOString(),
      creatorId: m.creatorId,
      creatorName: m.creator?.name,
      creatorImage: m.creator?.image,
      isCreator: m.creatorId === userId,
      recipients: m.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        image: p.user.image,
      })),
    }));

    return NextResponse.json({
      meetings: allMeetings.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
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
    const recipientUserIds = Array.isArray(body?.recipientUserIds) ? body.recipientUserIds : [];

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
        participants: {
          create: [
            { userId },
            ...recipientUserIds.map((id: string) => ({ userId: id })),
          ],
        },
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
        creatorId: true,
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    // Send scheduled meeting emails to recipients (best-effort)
    try {
      if (recipientUserIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { id: { in: recipientUserIds } },
          select: { email: true }
        });

        await Promise.all(
          users.map((u) => {
            if (!u.email) return Promise.resolve();
            return sendScheduledMeetingEmail(u.email, description, callId).catch((err) => {
              console.warn('Failed to send scheduled meeting email to', u.email, err);
            });
          })
        );
      }
    } catch (err) {
      console.warn('Error while sending scheduled meeting emails', err);
    }

    return NextResponse.json({
      meeting: {
        id: meeting.id,
        callId: meeting.callId,
        description: meeting.description,
        startsAt: meeting.startsAt.toISOString(),
        creatorId: meeting.creatorId,
        creatorName: meeting.creator?.name,
        creatorImage: meeting.creator?.image,
        isCreator: true,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
