-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "yjs_binary_state" SET DEFAULT '\x00'::bytea;

-- CreateTable
CREATE TABLE "slides" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slides_project_id_idx" ON "slides"("project_id");

-- AddForeignKey
ALTER TABLE "slides" ADD CONSTRAINT "slides_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
