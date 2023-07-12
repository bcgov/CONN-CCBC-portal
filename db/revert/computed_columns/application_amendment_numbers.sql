-- Revert ccbc:computed_columns/application_amendment_numbers from pg

begin;

drop function ccbc_public.application_amendment_numbers(application ccbc_public.application);

commit;
