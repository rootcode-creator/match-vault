'use server';

import { prisma } from '@/lib/prisma';
import { getAuthUserId } from './authActions';

export type FacetimeMeetingDto = {
  id: string;
  callId: string;
  description: string;
  startsAt: string; // ISO
};

const shouldExposeError =
  process.env.DEBUG_ERRORS === 'true' || process.env.NODE_ENV !== 'production';

export async function saveFacetimeMeeting(input: {
  callId: string;
  description: string;
  startsAt: string; // ISO
}) {
  try {
    const userId = await getAuthUserId();

    if (!input.callId) throw new Error('Missing callId');
    if (!input.description) throw new Error('Missing description');
    if (!input.startsAt) throw new Error('Missing startsAt');

    const startsAt = new Date(input.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      throw new Error('Invalid startsAt');
    }

    const meeting = await prisma.facetimeMeeting.upsert({
      where: { callId: input.callId },
      create: {
        callId: input.callId,
        description: input.description,
        startsAt,
        creatorId: userId,
      },
      update: {
        description: input.description,
        startsAt,
      },
      select: {
        id: true,
        callId: true,
        description: true,
        startsAt: true,
      },
    });

    return {
      status: 'success' as const,
      data: {
        ...meeting,
        startsAt: meeting.startsAt.toISOString(),
      } satisfies FacetimeMeetingDto,
    };
  } catch (error) {
    console.error('saveFacetimeMeeting failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error' as const,
      error: shouldExposeError ? message : 'Something went wrong',
    };
  }
}

export async function getUpcomingFacetimeMeetings(): Promise<{
  status: 'success';
  data: FacetimeMeetingDto[];
} | {
  status: 'error';
  error: string;
}> {
  try {
    const userId = await getAuthUserId();

    const meetings = await prisma.facetimeMeeting.findMany({
      where: {
        creatorId: userId,
      },
      orderBy: { startsAt: 'asc' },
      select: {
        id: true,
        callId: true,
        description: true,
        startsAt: true,
      },
      take: 50,
    });

    return {
      status: 'success',
      data: meetings.map((m) => ({
        id: m.id,
        callId: m.callId,
        description: m.description,
        startsAt: m.startsAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('getUpcomingFacetimeMeetings failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      error: shouldExposeError ? message : 'Something went wrong',
    };
  }
}

export async function completeFacetimeMeeting(callId: string): Promise<
  | { status: 'success'; data: { deleted: true } }
  | { status: 'error'; error: string }
> {
  try {
    const userId = await getAuthUserId();

    if (!callId) throw new Error('Missing callId');

    const result = await prisma.facetimeMeeting.deleteMany({
      where: {
        callId,
        creatorId: userId,
      },
    });

    if (result.count === 0) {
      // Either it doesn't exist, or user isn't the creator.
      throw new Error('Meeting not found');
    }

    return { status: 'success', data: { deleted: true } };
  } catch (error) {
    console.error('completeFacetimeMeeting failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      error: shouldExposeError ? message : 'Something went wrong',
    };
  }
}
