DROP TABLE IF EXISTS "verification_codes";
DROP TYPE IF EXISTS "VerificationType";

ALTER TABLE "users" DROP COLUMN IF EXISTS "bvn";
ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true;
UPDATE "users" SET "isActive" = true WHERE "isActive" = false;

DO $$
DECLARE
    existing_user RECORD;
    generated_account_number TEXT;
BEGIN
    FOR existing_user IN
        SELECT user_record."id", user_record."phone"
        FROM "users" AS user_record
        WHERE NOT EXISTS (
            SELECT 1
            FROM "accounts" AS account_record
            WHERE account_record."userId" = user_record."id"
        )
    LOOP
        LOOP
            generated_account_number :=
                RIGHT(REGEXP_REPLACE(existing_user."phone", '\D', '', 'g'), 4)
                || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM "accounts"
                WHERE "accountNumber" = generated_account_number
            );
        END LOOP;

        INSERT INTO "accounts" (
            "id", "userId", "accountNumber", "createdAt", "updatedAt"
        ) VALUES (
            GEN_RANDOM_UUID()::TEXT,
            existing_user."id",
            generated_account_number,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END LOOP;
END $$;
