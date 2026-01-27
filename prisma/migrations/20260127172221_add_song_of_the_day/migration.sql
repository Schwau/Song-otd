-- CreateTable
CREATE TABLE "SongOfTheDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "spotifyTrackId" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongOfTheDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SongOfTheDay_date_idx" ON "SongOfTheDay"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SongOfTheDay_userId_date_key" ON "SongOfTheDay"("userId", "date");

-- AddForeignKey
ALTER TABLE "SongOfTheDay" ADD CONSTRAINT "SongOfTheDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
