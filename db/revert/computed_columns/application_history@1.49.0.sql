-- Deploy ccbc:computed_columns/application_history to pg

begin;

drop function ccbc_public.application_history(ccbc_public.application);

commit;