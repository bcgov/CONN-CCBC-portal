-- Deploy ccbc:extensions/audit_sow.sql to pg

begin;

select audit.enable_tracking('ccbc_public.application_sow_data'::regclass);

commit;
