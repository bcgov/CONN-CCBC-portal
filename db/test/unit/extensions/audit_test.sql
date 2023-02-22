begin;

select plan(8);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.application_analyst_lead,
  ccbc_public.application_rfi_data,
  ccbc_public.record_version
restart identity cascade;

-- Init test
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', '11111111-1111-1111-1111-111111111112'),
  ('foo2', 'bar', 'foo2@bar.com', '11111111-1111-1111-1111-111111111113'),
  ('foo3', 'bar', 'foo3@bar.com', '11111111-1111-1111-1111-111111111114');

set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

create table ccbc_public.test_audited_table (
  id integer primary key generated always as identity,
  test_name varchar(1000),
  created_at timestamp with time zone not null default now(),
  created_by int references ccbc_public.ccbc_user,
  updated_at timestamp with time zone not null default now(),
  updated_by int references ccbc_public.ccbc_user,
  archived_at timestamp with time zone,
  archived_by int references ccbc_public.ccbc_user
);

create table ccbc_public.test_table_no_audit (
  id integer primary key generated always as identity,
  test_name varchar(1000),
  created_at timestamp with time zone not null default now(),
  created_by int references ccbc_public.ccbc_user,
  updated_at timestamp with time zone not null default now(),
  updated_by int references ccbc_public.ccbc_user,
  archived_at timestamp with time zone,
  archived_by int references ccbc_public.ccbc_user
);

create trigger _100_timestamps
  before insert or update on ccbc_public.test_audited_table
  for each row
  execute procedure ccbc_private.update_timestamps();

create trigger _100_timestamps
  before insert or update on ccbc_public.test_table_no_audit
  for each row
  execute procedure ccbc_private.update_timestamps();

select audit.enable_tracking('ccbc_public.test_audited_table'::regclass);

select has_function(
  'audit', 'to_record_id',
  'Function audit.to_record_id should exist'
);

select has_function(
  'audit', 'insert_update_delete_trigger',
  'Function audit.insert_update_delete_trigger should exist'
);

-- Records insert operation
insert into ccbc_public.test_audited_table (test_name) values ('create');
select is (
  (select created_by from ccbc_public.record_version where table_name='test_audited_table' and op='INSERT'),
  (select id from ccbc_public.ccbc_user where session_sub='11111111-1111-1111-1111-111111111112'),
  'trigger sets created_by on insert'
);

-- Records update opertaion
update ccbc_public.test_audited_table set test_name = 'update';
select is (
  (select created_by from ccbc_public.record_version where table_name='test_audited_table' and op='UPDATE'),
  (select id from ccbc_public.ccbc_user where session_sub='11111111-1111-1111-1111-111111111112'),
  'trigger on update recorded opertaion in record_version table'
);

-- disable audit

select audit.disable_tracking('ccbc_public.test_audited_table'::regclass);
insert into ccbc_public.test_audited_table (test_name) values ('create again');
-- no new insert records
select is (
  (select count(*)::int from ccbc_public.record_version where table_name='test_audited_table' and op='INSERT'),
  (1),
  'trigger on insert disabled'
);

-- no new update records
update ccbc_public.test_audited_table set test_name = 'update';
select is (
  (select count(*)::int from ccbc_public.record_version where table_name='test_audited_table' and op='UPDATE'),
  (1),
  'trigger on update disabled'
);

-- Does not record insert on non-audited table
insert into ccbc_public.test_table_no_audit (test_name) values ('create');
select is (
  (select count(*)::int from ccbc_public.record_version where table_name='test_table_no_audit' and op='INSERT'),
  (0),
  'trigger on insert is not set'
); 

-- Does not record update on non-audited table
update ccbc_public.test_audited_table set test_name = 'update';
select is (
  (select count(*)::int from ccbc_public.record_version where table_name='test_table_no_audit' and op='UPDATE'),
  (0),
  'trigger on update is not set'
); 

select * from finish();

rollback;
