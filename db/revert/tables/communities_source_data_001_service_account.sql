-- Revert ccbc:tables/communities_source_data_001_service_account from pg

BEGIN;

  revoke select on ccbc_public.communities_source_data from ccbc_service_account;
  revoke update on ccbc_public.communities_source_data from ccbc_service_account;
  revoke insert on ccbc_public.communities_source_data from ccbc_service_account;

COMMIT;
