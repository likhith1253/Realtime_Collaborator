/*
  Warnings:

  - You are about to drop the column `project_id` on the `slides` table. All the data in the column will be lost.
  - Added the required column `presentation_id` to the `slides` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "slides" DROP CONSTRAINT "slides_project_id_fkey";

-- DropIndex
DROP INDEX "slides_project_id_idx";

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "yjs_binary_state" SET DEFAULT '\x00'::bytea;

-- AlterTable
ALTER TABLE "slides" DROP COLUMN "project_id",
ADD COLUMN     "presentation_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "presentations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "template" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canvas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "presentations_project_id_idx" ON "presentations"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "canvas_project_id_key" ON "canvas"("project_id");

-- CreateIndex
CREATE INDEX "canvas_project_id_idx" ON "canvas"("project_id");

-- CreateIndex
CREATE INDEX "slides_presentation_id_idx" ON "slides"("presentation_id");

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slides" ADD CONSTRAINT "slides_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "presentations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas" ADD CONSTRAINT "canvas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
