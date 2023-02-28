-- Revert ccbc:import/attachment from pg

BEGIN;

drop function ccbc_public.import_attachments;

COMMIT;
