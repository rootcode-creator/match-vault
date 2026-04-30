const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const tokens = await prisma.token.findMany({ take: 50, orderBy: { expires: 'desc' } });
    console.log('Tokens:', tokens);
    const users = await prisma.user.findMany({ take: 50 });
    console.log('Users:', users.map(u => ({ id: u.id, email: u.email, emailVerified: u.emailVerified }))); 
  } catch (e) {
    console.error('Error querying DB', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
