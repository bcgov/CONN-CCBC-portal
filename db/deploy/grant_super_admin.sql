-- Deploy ccbc:grant_super_admin to pg

BEGIN;

do
$do$
begin

grant cbc_admin, ccbc_analyst, ccbc_admin to super_admin;

end
$do$;

COMMIT;
