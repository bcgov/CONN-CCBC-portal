-- Deploy ccbc:tables/cbc_project_communities_001_enable_tracking to pg

BEGIN;

select audit.enable_tracking('ccbc_public.cbc_project_communities'::regclass);

COMMIT;
