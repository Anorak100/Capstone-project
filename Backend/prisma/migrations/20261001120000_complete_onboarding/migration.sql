ALTER TABLE "users"
ADD COLUMN "bvn" VARCHAR(11);

CREATE UNIQUE INDEX "users_bvn_key" ON "users"("bvn");

ALTER TABLE "users"
ALTER COLUMN "isActive" SET DEFAULT false;
