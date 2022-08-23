set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
SELECT * FROM no_plan();

-- Table exists
select has_table(
  'ccbc_public', 'applications',
  'ccbc_public.applications should exist and be a table'
);


-- Columns
select has_column('ccbc_public', 'applications', 'id','The table applications has column id');
select has_column('ccbc_public', 'applications', 'ccbc_number','The table applications has column ccbc_number');
select has_column('ccbc_public', 'applications', 'owner','The table applications has column owner');
select has_column('ccbc_public', 'applications', 'form_data','The table applications has column form_data');
select has_column('ccbc_public', 'applications', 'status','The table applications has column status');
select has_column('ccbc_public', 'applications', 'last_edited_page','The table applications has column last_edited_page');

select finish();
rollback;
