set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
SELECT * FROM no_plan();

-- Table exists
select has_table(
  'ccbc_public', 'attachment',
  'ccbc_public.attachment should exist and be a table'
);


-- Columns
select has_column('ccbc_public', 'attachment', 'id','The table applications has column id');
select has_column('ccbc_public', 'attachment', 'file','The table applications has column file');
select has_column('ccbc_public', 'attachment', 'description','The table applications has column description');
select has_column('ccbc_public', 'attachment', 'file_name','The table applications has column file_name');
select has_column('ccbc_public', 'attachment', 'file_type','The table applications has column file_type');
select has_column('ccbc_public', 'attachment', 'file_size','The table applications has column file_size');
select has_column('ccbc_public', 'attachment', 'application_id','The table applications has column application_id');
select has_column('ccbc_public', 'attachment', 'application_status_id','The table applications has column application_status_id');
select has_column('ccbc_public', 'attachment', 'is_deleted','The table applications has column is_deleted');


select finish();
rollback;
