begin;

select plan(8);

-- Table exists
select has_table(
  'ccbc_public', 'application_internal_description',
  'ccbc_public.application_internal_description should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_internal_description', 'id','The table application_internal_description has column id');
select has_column('ccbc_public', 'application_internal_description', 'application_id','The table application_internal_description has column application_id');
select has_column('ccbc_public', 'application_internal_description', 'description','The table application_internal_description has column description');

-- Privileges
select table_privs_are(
  'ccbc_public', 'application_internal_description', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from application_internal_description table'
);

select table_privs_are(
  'ccbc_public', 'application_internal_description', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from application_internal_description table'
);

select table_privs_are(
  'ccbc_public', 'application_internal_description', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from application_internal_description table'
);

select table_privs_are(
  'ccbc_public', 'application_internal_description', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select, insert and update from application_internal_description table'
);

select finish();
rollback;
