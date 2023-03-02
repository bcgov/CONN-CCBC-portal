-- Deploy ccbc:extenstions/audit_form_data to pg

BEGIN;

select audit.disable_tracking('ccbc_public.form_data'::regclass);

COMMIT;
