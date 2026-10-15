-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('MEETING_ROOM', 'EQUIPMENT', 'WORKSPACE');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "category" "ResourceCategory" NOT NULL DEFAULT 'WORKSPACE';
