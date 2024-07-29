-- Revert ccbc:grant_super_admin from pg

BEGIN;

BEGIN;

do
$do$
begin

revoke cbc_admin, ccbc_analyst, ccbc_admin from super_admin;

end
$do$;

COMMIT;

COMMIT;
