-- CreateTable
CREATE TABLE "FacetimeMeeting" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "FacetimeMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacetimeMeeting_callId_key" ON "FacetimeMeeting"("callId");

-- CreateIndex
CREATE INDEX "FacetimeMeeting_creatorId_startsAt_idx" ON "FacetimeMeeting"("creatorId", "startsAt");

-- AddForeignKey
ALTER TABLE "FacetimeMeeting" ADD CONSTRAINT "FacetimeMeeting_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
