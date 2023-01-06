begin;
select plan(3);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.assessment_data
restart identity cascade;

select has_function('ccbc_public', 'application_assessment_form',
'Function application_assessment_form should exist');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
set role ccbc_auth_user;

select ccbc_public.create_application();

select ccbc_public.create_application();

insert into ccbc_public.application_status
 (application_id, status) values (1,'received'), (2, 'received');

-- Set role to job_executor and put in test slug for assessment forms
set role ccbc_job_executor;
-- insert here to use for tests
insert into ccbc_public.form (id, slug, form_type, json_schema) overriding system value
 values (200, 'assessment', 'assessment', '{}'::jsonb) on conflict (id) do update set
 json_schema=excluded.json_schema, slug=excluded.slug, form_type = excluded.form_type;

-- set role to analyst and create assessment form
set role ccbc_analyst;
select ccbc_public.create_assessment_form('screening'::varchar , '{}'::jsonb, 1);

-- form_data id is '3' here because we have more than one application
select results_eq(
  $$
    select id, json_data, assessment_data_type from ccbc_public.application_assessment_form(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1), 'screening'
    );
  $$,
  $$
    values(1, '{}'::jsonb, 'screening'::varchar);
  $$,
  'Should return the newly created assessment form'
);

select ccbc_public.create_assessment_form('screening'::varchar, '{"asdf":3}'::jsonb, 1);

select results_eq(
  $$
    select id, json_data, assessment_data_type from ccbc_public.application_assessment_form(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1), 'screening'
    );
  $$,
  $$
    values(2, '{"asdf":3}'::jsonb, 'screening'::varchar);
  $$,
  'Should return the newly created assessment form'
);




select finish();
rollback;
