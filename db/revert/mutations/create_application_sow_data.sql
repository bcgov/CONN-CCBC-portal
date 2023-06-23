-- Revert ccbc:mutations/create_application_sow_data from pg

begin;

drop function ccbc_public.create_application_sow_data;

commit;
