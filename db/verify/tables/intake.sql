-- Verify ccbc:tables/add_intake_table on pg

BEGIN;

select id, ccbc_intake_number, open_timestamp, close_timestamp from ccbc_public.intake where false;

ROLLBACK;
