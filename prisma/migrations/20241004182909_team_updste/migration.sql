-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_projectManagerUserId_fkey" FOREIGN KEY ("projectManagerUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
