-- Revert ccbc:extensions/audit_sow.sql from pg

begin;

select audit.disable_tracking('ccbc_public.application_sow_data'::regclass);

commit;
