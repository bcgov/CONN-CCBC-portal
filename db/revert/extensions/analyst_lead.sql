-- Revert ccbc:extensions/analyst_lead from pg

BEGIN;

select audit.disable_tracking('ccbc_public.application_analyst_lead'::regclass);
select audit.disable_tracking('ccbc_public.application_package'::regclass);

COMMIT;
