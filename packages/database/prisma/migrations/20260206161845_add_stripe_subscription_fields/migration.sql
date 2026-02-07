-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "yjs_binary_state" SET DEFAULT '\x00'::bytea;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "current_period_end" TIMESTAMPTZ,
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "subscription_plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "subscription_status" TEXT NOT NULL DEFAULT 'free';
