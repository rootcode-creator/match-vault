import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
    try {
        const meetings = await prisma.facetimeMeeting.findMany({
            include: {
                creator: {
                    select: { name: true }
                },
                participants: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        console.log('\n📊 FaceTime Meetings in Database:\n');
        meetings.forEach(m => {
            console.log(`📅 ${m.description}`);
            console.log(`   Creator: ${m.creator?.name}`);
            console.log(`   Time: ${m.startsAt}`);
            console.log(`   Participants:`);
            m.participants.forEach(p => {
                console.log(`     - ${p.user?.name}`);
            });
            console.log();
        });

        console.log(`\n✅ Total meetings: ${meetings.length}`);

        // Test the API response format
        const sarah = await prisma.user.findUnique({
            where: { email: 'sarah.jameson@test.com' }
        });

        if (sarah) {
            console.log(`\n👤 Testing as Sarah (${sarah.email}):\n`);

            // Get Sarah's created meetings
            const createdMeetings = await prisma.facetimeMeeting.findMany({
                where: { creatorId: sarah.id },
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
                                not: sarah.id,
                            },
                        },
                    },
                },
            });

            console.log('📤 Created meetings:', createdMeetings.length);
            createdMeetings.forEach(m => {
                console.log(`   - ${m.description} (recipients: ${m.participants.map(p => p.user.name).join(', ')})`);
            });

            // Get Sarah's participant meetings
            const participantMeetings = await prisma.facetimeMeeting.findMany({
                where: {
                    participants: {
                        some: {
                            userId: sarah.id,
                        },
                    },
                    creatorId: {
                        not: sarah.id,
                    },
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
                                not: sarah.id,
                            },
                        },
                    },
                },
            });

            console.log('📥 Invited to meetings:', participantMeetings.length);
            participantMeetings.forEach(m => {
                console.log(`   - ${m.description} (from ${m.creator?.name})`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyData();
