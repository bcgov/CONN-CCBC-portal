-- Revert ccbc:extensions/audit_announcement from pg

begin;

select audit.disable_tracking('ccbc_public.application_announcement'::regclass);

commit;
