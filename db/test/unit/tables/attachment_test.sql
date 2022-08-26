begin;

select plan(17);

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

-- Privileges
select table_privs_are(
  'ccbc_public', 'attachment', 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest has no privileges from attachment table'
);

select table_privs_are(
  'ccbc_public', 'attachment', 'ccbc_auth_user', ARRAY['SELECT', 'INSERT', 'UPDATE'],
  'ccbc_auth_user can select, insert and update from attachment table'
);

--RLS
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('user1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('user2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111113'),
  ('user3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111114');

set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

insert into ccbc_public.application
  (ccbc_number, owner, form_data, status, last_edited_page) values
  ('CCBC-010001', '11111111-1111-1111-1111-111111111112','{}','draft','projectArea');

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';
insert into ccbc_public.application
  (ccbc_number, owner, form_data,status,last_edited_page) values
  ('CCBC-010002', '11111111-1111-1111-1111-111111111113','{}','draft','projectArea'),
  ('CCBC-010003', '11111111-1111-1111-1111-111111111113','{}','draft','projectArea');

set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';
select lives_ok(
  $$
    insert into ccbc_public.attachment(file_name, application_id) values ('foo', (select id from ccbc_public.application where ccbc_number='CCBC-010001'))
  $$,
  'ccbc_auth_user can insert attachments for their own applications'
);

select lives_ok(
  $$
    update ccbc_public.attachment set file_name='baz' where file_name='foo'
  $$,
  'ccbc_auth_user can update attachments for their own applications'
);

select is(
  (select count(*) from ccbc_public.attachment),
  (1::bigint),
  'ccbc_auth_user can select attachments for their own applications'
);

set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';

select throws_like(
  $$
    insert into ccbc_public.attachment(file_name, application_id) values ('bar', (select id from ccbc_public.application where ccbc_number='CCBC-010001'))
  $$,
  'new row violates row-level security policy for table "attachment"',
  'ccbc_auth_user cannot insert attachments for applications they do not own'
);

select lives_ok(
  $$
    update ccbc_public.attachment set file_name='foo' where file_name='baz'
  $$,
  'ccbc_auth_user cannot update attachments for applications they do not own'
);

select is(
  (select count(*) from ccbc_public.attachment),
  (0::bigint),
  'ccbc_auth_user cannot select attachments for applications they do not own'
);

select finish();
rollback;
