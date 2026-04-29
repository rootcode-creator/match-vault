import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFacetimeMeetings() {
    try {
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
            console.log('❌ Users not found for creating meetings');
            return;
        }

        console.log('✅ Found test users');

        // Create test meetings with participants
        const now = new Date();
        const futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

        // Meeting 1: Sarah creates meeting with Karen
        const meeting1 = await prisma.facetimeMeeting.create({
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
        console.log('✅ Created meeting: Sarah with Karen');

        // Meeting 2: Todd creates meeting with Davis
        const futureTime2 = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
        const meeting2 = await prisma.facetimeMeeting.create({
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
        console.log('✅ Created meeting: Todd with Davis');

        // Meeting 3: Karen creates meeting with Sarah and Todd
        const futureTime3 = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours from now
        const meeting3 = await prisma.facetimeMeeting.create({
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
        console.log('✅ Created meeting: Karen with Sarah & Todd');

        console.log('\n✅ Test FaceTime meetings created successfully!');
        console.log(`
Test meeting data:
- Sarah can see: "Discuss project updates" (with Karen)
- Karen can see: "Discuss project updates" (from Sarah) + "Planning session" (creator)
- Todd can see: "Weekly team standup" (with Davis) + "Planning session" (from Karen)
- Davis can see: "Weekly team standup" (from Todd)
        `);
    } catch (error) {
        console.error('❌ Error seeding meetings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedFacetimeMeetings();
