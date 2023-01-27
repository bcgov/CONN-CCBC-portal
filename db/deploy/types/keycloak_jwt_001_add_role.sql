-- Deploy ccbc:types/keycloak_jwt_001_add_role to pg

begin;

alter type ccbc_public.keycloak_jwt add attribute auth_role text;

comment on column ccbc_public.keycloak_jwt.auth_role is
  'Role of the user from the login provider';

commit;
