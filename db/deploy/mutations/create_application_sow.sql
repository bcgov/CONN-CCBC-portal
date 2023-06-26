-- Deploy ccbc:mutations/create_application_sow to pg

begin;

drop function if exists ccbc_public.create_application_sow;

commit;
