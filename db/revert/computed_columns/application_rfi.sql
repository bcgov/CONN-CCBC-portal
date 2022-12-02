-- Revert ccbc:computed_columns/application_rfi from pg

begin;

drop function ccbc_public.application_rfi;

commit;
