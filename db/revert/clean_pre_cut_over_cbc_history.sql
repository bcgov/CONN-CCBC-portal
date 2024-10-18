-- Revert ccbc:clean_pre_cut_over_cbc_history from pg

BEGIN;

-- No need to revert the data deletion as it was done to remove obsolete data

COMMIT;
