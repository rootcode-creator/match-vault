const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const userCount = await prisma.user.count();
  const meetingCount = await prisma.facetimeMeeting.count();
  const upcomingCount = await prisma.facetimeMeeting.count({
    where: { startsAt: { gt: now } },
  });

  const latest = await prisma.facetimeMeeting.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      callId: true,
      description: true,
      startsAt: true,
      creatorId: true,
      createdAt: true,
      creator: {
        select: { email: true, name: true },
      },
    },
  });

  console.log('now:', now.toISOString());
  console.log('users:', userCount);
  console.log('meetings:', meetingCount);
  console.log('upcoming:', upcomingCount);
  console.log('latest:', latest.map((m) => ({
    ...m,
    startsAt: m.startsAt.toISOString(),
    createdAt: m.createdAt.toISOString(),
  })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
