begin;
select plan(17);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead,
  ccbc_public.application_rfi_data,
  ccbc_public.rfi_data
restart identity cascade;

select has_table('ccbc_public', 'assessment_data', 'table ccbc_public.assessment_data exists');
select has_column('ccbc_public', 'assessment_data', 'id', 'table ccbc_public.assessment_data has id column');
select has_column('ccbc_public', 'assessment_data', 'assessment_data_type', 'table ccbc_public.assessment_data has assessment_data_type column');
select has_column('ccbc_public', 'assessment_data', 'application_id', 'table ccbc_public.assessment_data has application_id column');
select has_column('ccbc_public', 'assessment_data', 'json_data', 'table ccbc_public.assessment_data has json_data column');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';

set role ccbc_auth_user;

select ccbc_public.create_application();


-- ccbc_guest
set role ccbc_auth_user;

select throws_like(
  $$
    select * from ccbc_public.assessment_data
  $$,
  'permission denied%',
  'ccbc_guest cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.assessment_data (application_id, assessment_data_type) values (1, 'screening');
  $$,
  'permission denied%',
  'ccbc_guest cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.assessment_data where id=1
  $$,
  'permission denied%',
    'ccbc_guest cannot delete rows from table_analyst'
);

-- ccbc_auth_user
set role ccbc_auth_user;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select throws_like(
  $$
    select * from ccbc_public.assessment_data
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);

select throws_like(
  $$
    insert into ccbc_public.assessment_data (application_id, assessment_data_type) values (1, 'screening');
  $$,
  'permission denied%',
  'ccbc_auth_user cannot insert'
);

select throws_like(
  $$
    delete from ccbc_public.assessment_data where id=1
  $$,
  'permission denied%',
    'ccbc_auth_user cannot delete rows from table_analyst'
);

reset role;

-- ccbc_admin
set role ccbc_admin;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
    insert into ccbc_public.assessment_data (application_id, assessment_data_type) values (1, 'screening');
  $$,
  'ccbc_admin can insert'
);

select throws_like(
  $$
    delete from ccbc_public.assessment_data where id=1
  $$,
  'permission denied%',
    'ccbc_admin cannot delete rows from table_analyst'
);

select lives_ok(
  $$
    update ccbc_public.assessment_data
    set assessment_data_type = 'technical'
    where id=1
  $$,
  'ccbc_admin can update'
);


reset role;


-- ccbc_analyst
set role ccbc_analyst;
set jwt.claims.sub to '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$
    insert into ccbc_public.assessment_data (application_id, assessment_data_type) values (1, 'screening');
  $$,
  'ccbc_admin can insert'
);

select throws_like(
  $$
    delete from ccbc_public.assessment_data where id=1
  $$,
  'permission denied%',
    'ccbc_analyst cannot delete rows from table_analyst'
);

select lives_ok(
  $$
    update ccbc_public.assessment_data
    set assessment_data_type = 'technical'
    where id=1
  $$,
    'ccbc_analyst cannot update'
);

select finish();
rollback;
