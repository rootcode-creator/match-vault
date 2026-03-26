-- Backfill schema changes that exist in prisma/schema.prisma but were never migrated.

-- Add User.profileComplete if missing
ALTER TABLE "public"."User"
ADD COLUMN IF NOT EXISTS "profileComplete" BOOLEAN NOT NULL DEFAULT false;

-- Add enum Role if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MEMBER');
    END IF;
END $$;

-- Add User.role if missing
ALTER TABLE "public"."User"
ADD COLUMN IF NOT EXISTS "role" "public"."Role" NOT NULL DEFAULT 'MEMBER';

-- Add Photo.isApproved if missing
ALTER TABLE "public"."Photo"
ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- Add enum TokenType if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TokenType') THEN
        CREATE TYPE "public"."TokenType" AS ENUM ('VERIFICATION', 'PASSWORD_RESET');
    END IF;
END $$;

-- Add Token table if missing
CREATE TABLE IF NOT EXISTS "public"."Token" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "type" "public"."TokenType" NOT NULL,
    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- Add unique index used by Prisma model
CREATE UNIQUE INDEX IF NOT EXISTS "Token_email_token_key"
ON "public"."Token" ("email", "token");
