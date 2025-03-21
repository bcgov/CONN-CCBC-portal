-- Revert ccbc:tables/application_form_template_9_data_002_add_auth_user_role_permission from pg

begin;

revoke select on ccbc_public.application_form_template_9_data from ccbc_auth_user;
revoke insert on ccbc_public.application_form_template_9_data from ccbc_auth_user;
revoke update on ccbc_public.application_form_template_9_data from ccbc_auth_user;

commit;
