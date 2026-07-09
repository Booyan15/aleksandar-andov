-- DropIndex
DROP INDEX IF EXISTS "Submission_deletedAt_idx";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN IF EXISTS "deletedAt";
