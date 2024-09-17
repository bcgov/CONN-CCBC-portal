-- Deploy ccbc:tables/cbc_data_003_include_change_reason to pg

BEGIN;

alter table ccbc_public.cbc_data add column change_reason text default null;

COMMIT;
