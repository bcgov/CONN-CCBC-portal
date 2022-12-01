begin;

select plan(3);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity;

select has_function('ccbc_public', 'create_assessment_form',
'Function create_assessment_form should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
set role ccbc_auth_user;

-- Set role to job_executor and put in test slug for assessment forms
set role ccbc_job_executor;
-- insert here to use for tests
insert into ccbc_public.form (id, slug, form_type, json_schema) overriding system value
 values (200, 'assessment', 'assessment', '{}'::jsonb) on conflict (id) do update set
 json_schema=excluded.json_schema, slug=excluded.slug, form_type = excluded.form_type;

set role ccbc_auth_user;

select ccbc_public.create_application();

select ccbc_public.create_application();

-- set two applications to received
insert into ccbc_public.application_status
 (application_id, status) values (1,'received'), (2, 'received');

-- set role to analyst and create assessment form
set role ccbc_analyst;
select ccbc_public.create_assessment_form('assessment'::varchar , '{}'::jsonb, 1);

select results_eq(
  $$
    select count(*) from ccbc_public.application_form_data where application_id = 1;
  $$,
  $$
    values(2::bigint);
  $$,
  'Should see two form_data entries in application_form_data for application 1'
);

select results_eq(
  $$
    select id, json_data, form_schema_id from ccbc_public.form_data where form_schema_id = 200;
  $$,
  $$
    values(3, '{}'::jsonb, 200);
  $$,
  'Should see only one form_data for assessment on application 1'
);


select finish();
rollback;
