-- Deploy ccbc:views/summary_view from pg

BEGIN;

     drop view if exists ccbc_public.summary_view;

COMMIT;
