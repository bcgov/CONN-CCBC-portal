set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
SELECT * FROM no_plan();

-- Table exists
select has_table(
  'ccbc_public', 'application_status',
  'ccbc_public.application_status should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_status', 'id','The table application has column id');
select has_column('ccbc_public', 'application_status', 'name','The table application has column name');
select has_column('ccbc_public', 'application_status', 'description','The table application has column description');

select finish();
rollback;
