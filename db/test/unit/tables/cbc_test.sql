begin;

select plan(8);

-- Table exists
select has_table(
  'ccbc_public', 'cbc',
  'ccbc_public.cbc should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'cbc', 'id','The table cbc has column id');
select has_column('ccbc_public', 'cbc', 'project_number','The table cbc has column project_number');
select has_column('ccbc_public', 'cbc', 'sharepoint_timestamp','The table cbc has column sharepoint_timestamp');

-- Privileges
select table_privs_are(
  'ccbc_public', 'cbc', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from cbc table'
);

select table_privs_are(
  'ccbc_public', 'cbc', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from cbc table'
);

select table_privs_are(
  'ccbc_public', 'cbc', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from cbc table'
);

select table_privs_are(
  'ccbc_public', 'cbc', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select from cbc table'
);

select finish();
rollback;
