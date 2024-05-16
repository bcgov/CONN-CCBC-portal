begin;

select plan(8);

-- Table exists
select has_table(
  'ccbc_public', 'cbc_data',
  'ccbc_public.cbc should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'cbc_data', 'id','The table cbc_data has column id');
select has_column('ccbc_public', 'cbc_data', 'json_data','The table cbc_data has column json_data');
select has_column('ccbc_public', 'cbc_data', 'project_number','The table cbc_data has column project_number');
select has_column('ccbc_public', 'cbc_data', 'cbc_id','The table cbc_data has column cbc_id');
select has_column('ccbc_public', 'cbc_data', 'sharepoint_timestamp','The table cbc_data has column sharepoint_timestamp');

-- Privileges
select table_privs_are(
  'ccbc_public', 'cbc_data', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from cbc_data table'
);

select table_privs_are(
  'ccbc_public', 'cbc_data', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from cbc_data table'
);

select table_privs_are(
  'ccbc_public', 'cbc_data', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from cbc_data table'
);

select table_privs_are(
  'ccbc_public', 'cbc_data', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select from cbc_data table'
);

select finish();
rollback;
