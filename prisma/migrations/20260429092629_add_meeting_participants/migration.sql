-- CreateTable
CREATE TABLE "FacetimeMeetingParticipant" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacetimeMeetingParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FacetimeMeetingParticipant_userId_meetingId_idx" ON "FacetimeMeetingParticipant"("userId", "meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "FacetimeMeetingParticipant_meetingId_userId_key" ON "FacetimeMeetingParticipant"("meetingId", "userId");

-- AddForeignKey
ALTER TABLE "FacetimeMeetingParticipant" ADD CONSTRAINT "FacetimeMeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "FacetimeMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacetimeMeetingParticipant" ADD CONSTRAINT "FacetimeMeetingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add existing meeting creators as participants
INSERT INTO "FacetimeMeetingParticipant" ("id", "meetingId", "userId", "createdAt")
SELECT 
  gen_random_uuid()::text,
  fm."id",
  fm."creatorId",
  fm."createdAt"
FROM "FacetimeMeeting" fm
WHERE NOT EXISTS (
  SELECT 1 FROM "FacetimeMeetingParticipant" fmp 
  WHERE fmp."meetingId" = fm."id" AND fmp."userId" = fm."creatorId"
);
