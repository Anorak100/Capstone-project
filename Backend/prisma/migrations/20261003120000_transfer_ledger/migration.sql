CREATE TYPE "TransactionDirection" AS ENUM ('DEBIT', 'CREDIT');

ALTER TABLE "transactions"
ADD COLUMN "direction" "TransactionDirection",
ADD COLUMN "transferReference" TEXT;

CREATE INDEX "transactions_transferReference_idx"
ON "transactions"("transferReference");
