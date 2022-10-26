-- Revert ccbc:views/summary_view from pg

BEGIN;

    drop ccbc_public.summary_view;

COMMIT;
