'use server';
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";
import { getPusherServer } from "@/lib/pusher";





export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
    try {
        const userId = await getAuthUserId();
        // Ensure source has a Member record. If missing, create a minimal profile
        // (uses sensible defaults; you may want to prompt the user in the UI later).
        let sourceMember = await prisma.member.findUnique({ where: { userId } });
        if (!sourceMember) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const defaultName = user?.name ?? 'New Member';
            sourceMember = await prisma.member.create({
                data: {
                    userId,
                    name: defaultName,
                    gender: 'unspecified',
                    // default DOB (1970-01-01) — replace with proper flow if you collect DOB from users
                    dateOfBirth: new Date('1970-01-01'),
                    description: '',
                    city: '',
                    country: ''
                }
            });
        }

        // Ensure target has a Member record; if it doesn't exist, abort with a clear error.
        const targetMember = await prisma.member.findUnique({ where: { userId: targetUserId } });
        if (!targetMember) {
            throw new Error('The target member does not exist.');
        }

        if (isLiked) {
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: userId,
                        targetUserId
                    }
                }
            })
        } else {
            const like = await prisma.like.create({
                data: {
                    sourceUserId: userId,
                    targetUserId
                }, 
                select :{
                sourceMember:{
                    select:{
                        name:true,
                        image:true,
                        userId:true
                    }
                }
            }
            });

            const pusherServer = getPusherServer();

            await pusherServer.trigger(`private-${targetUserId}`, 'like:new', {
                name: like.sourceMember.name,
                image: like.sourceMember.image,
                userId: like.sourceMember.userId
            })
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function fetchCurrentUserLikeIds() {

    try {
        const userId = await getAuthUserId();

        const likeIds = await prisma.like.findMany({
            where: {
                sourceUserId: userId
            },
            select: {
                targetUserId: true
            }
        })

        return likeIds.map(like => like.targetUserId);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function fetchLikeMembers(type = 'source') {
    try {
        const userId = await getAuthUserId();

        switch (type) {
            case 'source':

                return await fetchSourceLikes(userId);

            case 'target':
                return await fetchTargetLikes(userId);

            case 'mutual':
                return await fetchMutualLikes(userId);

            default:
                return [];
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function fetchSourceLikes(userId: string) {
    const sourceList = await prisma.like.findMany({
        where: { sourceUserId: userId },
        select: { targetMember: true }
    })
    return sourceList.map(x => x.targetMember);
}

async function fetchTargetLikes(userId: string) {
    const targetList = await prisma.like.findMany({
        where: { targetUserId: userId },
        select: { sourceMember: true }
    })
    return targetList.map(x => x.sourceMember);
}

async function fetchMutualLikes(userId: string) {
    const likedUsers = await prisma.like.findMany({
        where: { sourceUserId: userId },
        select: { targetUserId: true }
    });
    const likedIds = likedUsers.map(x => x.targetUserId);

    const mutualList = await prisma.like.findMany({
        where: {
            AND: [
                { targetUserId: userId },
                { sourceUserId: { in: likedIds } }
            ]
        },
        select: { sourceMember: true }
    });
    return mutualList.map(x => x.sourceMember);
}