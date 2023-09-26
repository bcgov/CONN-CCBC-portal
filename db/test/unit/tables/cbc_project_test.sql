begin;

select plan(8);

-- Table exists
select has_table(
  'ccbc_public', 'cbc_project',
  'ccbc_public.cbc_project should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'cbc_project', 'id','The table cbc_project has column id');
select has_column('ccbc_public', 'cbc_project', 'json_data','The table cbc_project has column json_data');
select has_column('ccbc_public', 'cbc_project', 'sharepoint_timestamp','The table cbc_project has column sharepoint_timestamp');

-- Privileges
select table_privs_are(
  'ccbc_public', 'cbc_project', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from cbc_project table'
);

select table_privs_are(
  'ccbc_public', 'cbc_project', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from cbc_project table'
);

select table_privs_are(
  'ccbc_public', 'cbc_project', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from cbc_project table'
);

select table_privs_are(
  'ccbc_public', 'cbc_project', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select, insert and update from cbc_project table'
);

select finish();
rollback;
