set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
SELECT plan(4);

-- Table exists
select has_table(
  'ccbc_public', 'application_status',
  'ccbc_public.application_status should exist and be a table'
);

-- Columns
select has_column('ccbc_public', 'application_status', 'id','The table application has column id');
select has_column('ccbc_public', 'application_status', 'application_id','The table application has column application_id');
select has_column('ccbc_public', 'application_status', 'status','The table application has column status');

select finish();
rollback;
