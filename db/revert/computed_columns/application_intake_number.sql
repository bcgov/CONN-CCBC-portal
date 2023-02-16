-- revert ccbc:computed_columns/application_intake_number from pg

begin;

drop function ccbc_public.application_intake_number;

commit;
