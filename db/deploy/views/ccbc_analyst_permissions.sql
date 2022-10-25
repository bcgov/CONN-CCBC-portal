-- Deploy ccbc:views/ccbc_analyst_permissions to pg

begin;

grant execute on function ccbc_public.application_status to ccbc_analyst;

commit;
