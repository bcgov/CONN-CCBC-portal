-- Revert ccbc:extenstions/audit from pg

BEGIN;

select audit.disable_tracking('ccbc_public.application'::regclass);
select audit.disable_tracking('ccbc_public.application_status'::regclass);
select audit.disable_tracking('ccbc_public.attachment'::regclass);
select audit.disable_tracking('ccbc_public.assessment_data'::regclass);
select audit.disable_tracking('ccbc_public.rfi_data'::regclass);

drop table ccbc_public.record_version;
drop schema audit cascade;

COMMIT;
