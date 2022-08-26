-- Revert ccbc:tables/applications/remove_unique_owner from pg

BEGIN;

-- commented out becuase it causes errors on `sqitch revert`
-- ALTER TABLE ccbc_public.application ADD CONSTRAINT applications_owner_key UNIQUE(owner);

COMMIT;
