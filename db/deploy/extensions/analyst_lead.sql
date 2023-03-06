-- Deploy ccbc:extensions/analyst_lead to pg

BEGIN;

select audit.enable_tracking('ccbc_public.application_analyst_lead'::regclass);
select audit.enable_tracking('ccbc_public.application_package'::regclass);

COMMIT;
