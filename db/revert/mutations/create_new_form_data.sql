-- Revert ccbc:mutations/create_form_data from pg

begin;

drop function ccbc_public.create_form_data;

commit;
