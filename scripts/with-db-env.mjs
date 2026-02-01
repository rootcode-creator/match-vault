import { spawnSync } from 'node:child_process';

const [, , ...cmd] = process.argv;

if (cmd.length === 0) {
  console.error('Usage: node scripts/with-db-env.mjs <command> [...args]');
  process.exit(1);
}

const env = { ...process.env };

// Vercel + Neon integrations often provide POSTGRES_* env vars instead of DATABASE_URL.
// Prisma schema in this repo expects DATABASE_URL + DIRECT_URL.
env.DATABASE_URL ??=
  env.POSTGRES_PRISMA_URL ||
  env.POSTGRES_URL ||
  env.NEON_DATABASE_URL ||
  env.NEON_POSTGRES_URL;

env.DIRECT_URL ??=
  env.POSTGRES_URL_NON_POOLING ||
  env.POSTGRES_URL ||
  env.DATABASE_URL;

const command = cmd[0];
const args = cmd.slice(1);

const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 1);