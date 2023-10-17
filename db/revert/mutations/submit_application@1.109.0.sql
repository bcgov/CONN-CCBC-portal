-- Deploy ccbc:mutations/submit_application to pg

begin;

drop function if exists ccbc_public.submit_application(application_row_id int, _form_schema_id int);

commit;
