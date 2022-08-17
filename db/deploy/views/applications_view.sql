-- Deploy ccbc:views/applications_view to pg
-- requires: tables/applications

begin;

CREATE OR REPLACE VIEW ccbc_public.applications_view AS SELECT * FROM ccbc_public.applications;

commit;
