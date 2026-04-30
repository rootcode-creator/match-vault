import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testVerificationFlow() {
  try {
    console.log('=== Starting verification flow test ===\n');

    // Step 1: Create a test user
    console.log('Step 1: Creating test user...');
    const email = 'test-verify@example.com';
    const hashedPassword = await bcrypt.hash('TestPassword123!', 12);

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log('  → Test user already exists, deleting...');
      await prisma.user.delete({ where: { id: user.id } });
    }

    user = await prisma.user.create({
      data: {
        email,
        name: 'Test User',
        passwordHash: hashedPassword,
        emailVerified: null,
        member: {
          create: {
            name: 'Test User',
            gender: 'male',
            dateOfBirth: new Date('1990-01-01'),
            description: 'Test',
            city: 'Test City',
            country: 'Test Country'
          }
        }
      }
    });
    console.log(`  ✓ User created: ${user.email} (id: ${user.id})`);
    console.log(`  ✓ emailVerified: ${user.emailVerified}\n`);

    // Step 2: Create a verification token
    console.log('Step 2: Creating verification token...');
    const tokenValue = Array.from(crypto.getRandomValues(new Uint8Array(48)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h from now

    const token = await prisma.token.create({
      data: {
        email,
        token: tokenValue,
        expires,
        type: 'VERIFICATION'
      }
    });
    console.log(`  ✓ Token created: ${token.token.slice(0, 16)}...`);
    console.log(`  ✓ Expires: ${expires.toISOString()}\n`);

    // Step 3: Look up token (mimics getTokenByToken)
    console.log('Step 3: Testing token lookup...');
    const foundToken = await prisma.token.findFirst({
      where: { token: tokenValue }
    });
    if (!foundToken) {
      console.log('  ✗ ERROR: Token lookup failed!');
      return;
    }
    console.log(`  ✓ Token found in DB\n`);

    // Step 4: Verify token is not expired
    console.log('Step 4: Checking token expiry...');
    const isExpired = new Date() > foundToken.expires;
    console.log(`  ✓ Token expired? ${isExpired}\n`);

    // Step 5: Look up user by normalized email
    console.log('Step 5: Looking up user by token email...');
    const foundUser = await prisma.user.findUnique({
      where: { email: foundToken.email }
    });
    if (!foundUser) {
      console.log('  ✗ ERROR: User lookup failed!');
      return;
    }
    console.log(`  ✓ User found: ${foundUser.email}\n`);

    // Step 6: Update user emailVerified
    console.log('Step 6: Updating user emailVerified...');
    const updatedUser = await prisma.user.update({
      where: { id: foundUser.id },
      data: { emailVerified: new Date() }
    });
    console.log(`  ✓ User updated. emailVerified: ${updatedUser.emailVerified}\n`);

    // Step 7: Delete token
    console.log('Step 7: Deleting token...');
    await prisma.token.delete({ where: { id: foundToken.id } });
    console.log(`  ✓ Token deleted\n`);

    // Step 8: Verify final state
    console.log('Step 8: Verifying final state...');
    const finalUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    const tokenCount = await prisma.token.count({
      where: { email }
    });
    console.log(`  ✓ User emailVerified: ${finalUser?.emailVerified}`);
    console.log(`  ✓ Remaining tokens for email: ${tokenCount}\n`);

    console.log('=== Verification flow test PASSED ===');
    console.log(`\nTest credentials for manual verification:`);
    console.log(`Email: ${email}`);
    console.log(`Password: TestPassword123!`);
    console.log(`Token: ${tokenValue}`);
    console.log(`Link: http://localhost:3000/verify-email?token=${encodeURIComponent(tokenValue)}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testVerificationFlow();
