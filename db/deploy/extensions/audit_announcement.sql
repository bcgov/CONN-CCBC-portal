-- Deploy ccbc:extensions/audit_announcement to pg

begin;

select audit.enable_tracking('ccbc_public.application_announcement'::regclass);

commit;
