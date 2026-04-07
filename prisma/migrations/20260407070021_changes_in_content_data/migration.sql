-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
