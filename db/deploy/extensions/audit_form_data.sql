-- Deploy ccbc:extenstions/audit_form_data to pg

BEGIN;

select audit.enable_tracking('ccbc_public.form_data'::regclass);

COMMIT;
