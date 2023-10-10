-- Revert ccbc:mutations/create_application_internal_description from pg

begin;

drop function if exists ccbc_public.create_application_internal_description;

commit;
