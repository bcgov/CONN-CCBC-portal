begin;

select plan(14);

-- Table exists
select has_table(
  'ccbc_public', 'cbc_data_change_reason',
  'ccbc_public.cbc_data_change_reason should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'cbc_data_change_reason', 'id', 'The table cbc_data_change_reason has column id');
select has_column('ccbc_public', 'cbc_data_change_reason', 'cbc_data_id', 'The table cbc_data_change_reason has column cbc_data_id');
select has_column('ccbc_public', 'cbc_data_change_reason', 'description', 'The table cbc_data_change_reason has column description');
select has_column('ccbc_public', 'cbc_data_change_reason', 'created_at', 'The table cbc_data_change_reason has column created_at');
select has_column('ccbc_public', 'cbc_data_change_reason', 'updated_at', 'The table cbc_data_change_reason has column updated_at');

-- Privileges
select table_privs_are(
  'ccbc_public', 'cbc_data_change_reason', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges on cbc_data_change_reason table'
);

select table_privs_are(
  'ccbc_public', 'cbc_data_change_reason', 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user has no privileges on cbc_data_change_reason table'
);

select table_privs_are(
  'ccbc_public', 'cbc_data_change_reason', 'cbc_admin', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'cbc_admin can select, insert, and update on cbc_data_change_reason table'
);

select table_privs_are(
  'ccbc_public', 'cbc_data_change_reason', 'ccbc_analyst', ARRAY['SELECT'],
  'ccbc_analyst can select on cbc_data_change_reason table'
);


-- Comments

select is(
  col_description('ccbc_public.cbc_data_change_reason'::regclass, 1),
  'Unique ID for the cbc_data_change_reason',
  'The column id has the correct comment'
);

select is(
  col_description('ccbc_public.cbc_data_change_reason'::regclass, 2),
  'ID of the cbc_data this cbc_data_change_reason belongs to',
  'The column cbc_data_id has the correct comment'
);

select is(
  col_description('ccbc_public.cbc_data_change_reason'::regclass, 3),
  'The reason for the change to the cbc_data',
  'The column description has the correct comment'
);

select is(
  obj_description('ccbc_public.cbc_data_change_reason'::regclass),
  'Table containing the reasons for changes to cbc_data',
  'The table cbc_data_change_reason has the correct comment'
);


select finish();
rollback;
