-- Revert ccbc:mutations/update_application_form_data from pg

begin;

drop function ccbc_public.update_application_form;

commit;
