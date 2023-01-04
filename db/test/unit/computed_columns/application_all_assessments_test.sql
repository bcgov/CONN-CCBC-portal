begin;
select plan(5);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity cascade;

select has_function('ccbc_public', 'application_all_assessments',
'Function application_all_assessments should exist');

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
insert into ccbc_public.form (slug, form_type, json_schema) overriding system value
 values ('gis', 'assessment', '{}'::jsonb) on conflict (id) do update set
 json_schema=excluded.json_schema, slug=excluded.slug, form_type = excluded.form_type;

insert into ccbc_public.form (slug, form_type, json_schema) overriding system value
 values ('screening', 'assessment', '{}'::jsonb) on conflict (id) do update set
 json_schema=excluded.json_schema, slug=excluded.slug, form_type = excluded.form_type;

insert into ccbc_public.form (slug, form_type, json_schema) overriding system value
 values ('technical', 'assessment', '{}'::jsonb) on conflict (id) do update set
 json_schema=excluded.json_schema, slug=excluded.slug, form_type = excluded.form_type;

-- set role to analyst and create assessment form
set role ccbc_analyst;

select ccbc_public.create_assessment_form('gis'::varchar , '{}'::jsonb, 1);
select ccbc_public.create_assessment_form('screening'::varchar , '{}'::jsonb, 1);

-- Insert assessments forms from another application to make sure we are only getting the correct ones
select ccbc_public.create_assessment_form('gis'::varchar , '{}'::jsonb, 2);
select ccbc_public.create_assessment_form('screening'::varchar , '{}'::jsonb, 2);
select ccbc_public.create_assessment_form('technical'::varchar , '{}'::jsonb, 2);

select results_eq(
  $$
    select count(*) from ccbc_public.application_all_assessments(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1)
    );
  $$,
  ARRAY['2'::bigint],
    'Return 3 rows of assessment for that application'
);

-- Insert more assessments of the same type
select ccbc_public.create_assessment_form('gis'::varchar , '{}'::jsonb, 1);
select ccbc_public.create_assessment_form('screening'::varchar , '{}'::jsonb, 1);

-- Insert new assessment
select ccbc_public.create_assessment_form('technical'::varchar , '{}'::jsonb, 1);

select results_eq(
  $$
    select count(*) from ccbc_public.application_all_assessments(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1)
    );
  $$,
  ARRAY['3'::bigint],
    'Return 3 rows of assessment for that application'
);

set role ccbc_auth_user;

select throws_like(
  $$
     select count(*) from ccbc_public.application_all_assessments(
      (select row(application.*)::ccbc_public.application
       from ccbc_public.application where id=1)
    )
  $$,
  'permission denied%',
  'ccbc_auth_user cannot select'
);


select throws_like(
  $$
     select ccbc_public.create_assessment_form('technical'::varchar , '{}'::jsonb, 1)
  $$,
  'permission denied%',
  'ccbc_auth_user cannot insert'
);

select finish();
rollback;
