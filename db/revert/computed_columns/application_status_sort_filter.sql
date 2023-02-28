-- Revert ccbc:computed_columns/application_status_sort_filter from pg

begin;

drop function ccbc_public.application_status_sort_filter;

commit;
