'use server';

import { prisma } from '@/lib/prisma';
import { Member, Photo } from '@prisma/client';
import { addYears } from 'date-fns';
import { getAuthUserId, getAuthUserIdOrNull } from './authActions';
import { GetMemberParams, PaginatedResponse } from '@/types';

function getAgeRange(ageRange: string): Date[] {
    const [minAge, maxAge] = ageRange.split(',');
    const currentDate = new Date();
    const minDob = addYears(currentDate, -maxAge - 1);
    const maxDob = addYears(currentDate, -minAge);

    return [minDob, maxDob];
}

export async function getMembers({
    ageRange = '18,100',
    gender = 'male,female',
    orderBy = 'updated',
    pageNumber = '1',
    pageSize = '12',
    withPhoto = 'true'
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
    const userId = await getAuthUserId();

    const [minDob, maxDob] = getAgeRange(ageRange);

    const selectedGender = gender.split(',');

    const page = parseInt(pageNumber);
    const limit = parseInt(pageSize);

    const skip = (page - 1) * limit;

    try {
        const membersSelect = {
            where: {
                AND: [
                    { dateOfBirth: { gte: minDob } },
                    { dateOfBirth: { lte: maxDob } },
                    { gender: { in: selectedGender } },
                    ...(withPhoto === 'true'
                        ? [{ image: { not: null } }]
                        : [{ image: null }])
                ],
                NOT: {
                    userId
                }
            },
        }

        const count = await prisma.member.count(membersSelect)

        const members = await prisma.member.findMany({
            ...membersSelect,
            orderBy: { [orderBy]: 'desc' },
            skip,
            take: limit
        });

        return {
            items: members,
            totalCount: count
        }
    } catch (error) {
        console.log(error);
        return {
            items: [],
            totalCount: 0
        };
    }
}

export async function getMemberByUserId(userId: string) {
    try {
        return prisma.member.findUnique({ where: { userId } })
    } catch (error) {
        console.log(error);
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const currentUserId = await getAuthUserId();

    const member = await prisma.member.findUnique({
        where: { userId },
        select: { photos: { where: currentUserId === userId ? {} : { isApproved: true } } }
    });

    if (!member) return null;

    return member.photos.map(p => p) as Photo[];
}

export async function updateLastActive() {
    try {
        const userId = await getAuthUserIdOrNull();

        if (!userId) {
            return null;
        }

        const result = await prisma.member.updateMany({
            where: { userId },
            data: { updated: new Date() }
        });

        if (result.count === 0) {
            return null;
        }

        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}