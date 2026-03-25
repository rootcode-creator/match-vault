-- Make password hash optional so OAuth users can be created without local credentials
ALTER TABLE "public"."User"
ALTER COLUMN "passwordHash" DROP NOT NULL;
