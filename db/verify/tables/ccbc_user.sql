-- Verify ccbc:tables/ccbc_user on pg

begin;

select pg_catalog.has_table_privilege('ccbc_public.ccbc_user', 'select');

-- ccbc_auth_user grants
select ccbc_private.verify_grant('select', 'ccbc_user', 'ccbc_auth_user');
select ccbc_private.verify_grant('insert', 'ccbc_user', 'ccbc_auth_user');
select ccbc_private.verify_grant('update', 'ccbc_user', 'ccbc_auth_user',
  ARRAY['given_name', 'family_name', 'email_address', 'created_by', 'created_at', 'updated_by', 'updated_at', 'archived_by', 'archived_at']);

-- ccbc_guest grants
select ccbc_private.verify_grant('select', 'ccbc_user', 'ccbc_guest'); 

rollback;
