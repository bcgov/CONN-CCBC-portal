begin;
select plan(4);

select has_type('ccbc_public', 'keycloak_jwt', 'Type keycloak_jwt should exist');
select has_column('ccbc_public', 'keycloak_jwt', 'sub', 'Type keycloak_jwt should have a sub column');
select col_type_is('ccbc_public', 'keycloak_jwt', 'sub', 'character varying(1000)', 'Type keycloak_jwt should have a sub column with type VARCHAR');
select has_column('ccbc_public', 'keycloak_jwt', 'auth_role', 'Type keycloak_jwt should have a auth_role column');

select finish();

rollback;
