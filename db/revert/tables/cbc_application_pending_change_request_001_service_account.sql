-- Revert ccbc:tables/cbc_application_pending_change_request_001_service_account from pg

BEGIN;

  revoke select on ccbc_public.cbc_application_pending_change_request from ccbc_service_account;
  revoke update on ccbc_public.cbc_application_pending_change_request from ccbc_service_account;
  revoke insert on ccbc_public.cbc_application_pending_change_request from ccbc_service_account;

COMMIT;
