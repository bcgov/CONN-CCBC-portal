-- Deploy ccbc:clean_pre_cut_over_cbc_history to pg

BEGIN;

DELETE FROM ccbc_public.record_version WHERE (table_name = 'cbc_data' OR table_name = 'cbc_data_change_reason') AND ts < '2024-10-01 07:00:00+00';

COMMIT;
