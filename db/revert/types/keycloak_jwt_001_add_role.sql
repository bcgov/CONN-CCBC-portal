-- Revert ccbc:types/keycloak_jwt_001_add_role from pg

begin;

alter type ccbc_public.keycloak_jwt drop attribute auth_role;

commit;
