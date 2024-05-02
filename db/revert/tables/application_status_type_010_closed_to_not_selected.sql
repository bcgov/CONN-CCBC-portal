-- revert ccbc:tables/application_status_type_010_closed_to_not_selected from pg
BEGIN;
UPDATE
  ccbc_public.application_status_type
SET
  description = 'Closed'
WHERE
  name = 'closed';
COMMIT;
