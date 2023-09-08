begin;

select plan(9);

-- Table exists
select has_table(
  'ccbc_public', 'application_milestone_data',
  'ccbc_public.application_milestone_data should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_milestone_data', 'id','The table application_milestone_data has column id');
select has_column('ccbc_public', 'application_milestone_data', 'application_id','The table application_milestone_data has column application_id');
select has_column('ccbc_public', 'application_milestone_data', 'json_data','The table application_milestone_data has column json_data');
select has_column('ccbc_public', 'application_milestone_data', 'excel_data_id','The table application_milestone_data has column excel_data_id');

-- Privileges
select table_privs_are(
  'ccbc_public', 'application_milestone_data', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from application_milestone_data table'
);

select table_privs_are(
  'ccbc_public', 'application_milestone_data', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges from application_milestone_data table'
);

select table_privs_are(
  'ccbc_public', 'application_milestone_data', 'ccbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_admin can select, insert and update from application_milestone_data table'
);

select table_privs_are(
  'ccbc_public', 'application_milestone_data', 'ccbc_analyst', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_analyst can select, insert and update from application_milestone_data table'
);

select finish();
rollback;
