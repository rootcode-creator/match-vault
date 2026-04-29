import { PrismaClient } from '@prisma/client';
import { membersData } from './membersData';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function clearSeedData() {
    await prisma.facetimeMeetingParticipant.deleteMany();
    await prisma.facetimeMeeting.deleteMany();
    await prisma.message.deleteMany();
    await prisma.like.deleteMany();
    await prisma.photo.deleteMany();
    await prisma.member.deleteMany();
    await prisma.account.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
}

async function seedMembers() {
    return Promise.all(membersData.map(async member => prisma.user.create({
        data: {
            email: member.email,
            emailVerified: new Date(),
            name: member.name,
            passwordHash: await hash('password', 10),
            image: member.image,
            profileComplete: true,
            member: {
                create: {
                    dateOfBirth: new Date(member.dateOfBirth),
                    gender: member.gender,
                    name: member.name,
                    created: new Date(member.created),
                    updated: new Date(member.lastActive),
                    description: member.description,
                    city: member.city,
                    country: member.country,
                    image: member.image,
                    photos: {
                        create: {
                            url: member.image,
                            isApproved: true
                        }
                    }
                }
            }
        }
    })))
}

async function seedAdmin() {
    return prisma.user.create({
        data: {
            email: 'admin@test.com',
            emailVerified: new Date(),
            name: 'Admin',
            passwordHash: await hash('password', 10),
            role: 'ADMIN'
        }
    })
}

async function seedFacetimeMeetings() {
    // Get users for testing
    const sarah = await prisma.user.findUnique({
        where: { email: 'sarah.jameson@test.com' }
    });
    const karen = await prisma.user.findUnique({
        where: { email: 'karen.robertson@test.com' }
    });
    const todd = await prisma.user.findUnique({
        where: { email: 'todd.bennett@test.com' }
    });
    const davis = await prisma.user.findUnique({
        where: { email: 'davis.harrison@test.com' }
    });

    if (!sarah || !karen || !todd || !davis) {
        console.log('Users not found for creating meetings');
        return;
    }

    // Create test meetings with participants
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    // Meeting 1: Sarah creates meeting with Karen
    await prisma.facetimeMeeting.create({
        data: {
            callId: 'meeting-sarah-karen-' + Date.now(),
            description: 'Discuss project updates',
            startsAt: futureTime,
            creatorId: sarah.id,
            participants: {
                create: [
                    { userId: sarah.id },
                    { userId: karen.id }
                ]
            }
        }
    });

    // Meeting 2: Todd creates meeting with Davis
    const futureTime2 = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
    await prisma.facetimeMeeting.create({
        data: {
            callId: 'meeting-todd-davis-' + Date.now(),
            description: 'Weekly team standup',
            startsAt: futureTime2,
            creatorId: todd.id,
            participants: {
                create: [
                    { userId: todd.id },
                    { userId: davis.id }
                ]
            }
        }
    });

    // Meeting 3: Karen creates meeting with Sarah and Todd
    const futureTime3 = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours from now
    await prisma.facetimeMeeting.create({
        data: {
            callId: 'meeting-karen-group-' + Date.now(),
            description: 'Planning session',
            startsAt: futureTime3,
            creatorId: karen.id,
            participants: {
                create: [
                    { userId: karen.id },
                    { userId: sarah.id },
                    { userId: todd.id }
                ]
            }
        }
    });

    console.log('Test FaceTime meetings created!');
}

async function main() {
    await clearSeedData();
    await seedMembers();
    await seedAdmin();
    await seedFacetimeMeetings();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})