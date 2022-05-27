-- Revert ccbc:types/keycloak_jwt from pg

begin;

drop type ccbc_public.keycloak_jwt;

commit;
