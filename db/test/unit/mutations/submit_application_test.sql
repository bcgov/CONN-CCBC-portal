begin;

select plan(14);
truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead
restart identity cascade;


select has_function(
  'ccbc_public', 'submit_application', ARRAY['int','int'],
  'Function submit_application should exist'
);

-- must initially hydrate the test data here, as it's used when submitting
insert into ccbc_public.form (slug, json_schema) values ('intake1schema',
'{ "properties": {
  "acknowledgements": {
    "properties": {
      "acknowledgementsList": {
        "items": {
           "enum": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
          }
        }
      }
    }
  }
}'::jsonb) on conflict (slug) do update set json_schema=excluded.json_schema, slug=excluded.slug;

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

select ccbc_public.create_intake('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07');
select ccbc_public.create_intake('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07');
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

do
$$
begin
for i in 1..10 loop

  perform ccbc_public.create_application();

end loop ;

end;
$$;

UPDATE ccbc_public.form_data SET
 json_data = '{"acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}}'
 where id = 1;

 UPDATE ccbc_public.form_data SET
 json_data ='{"acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}}'
 where id = 4;

 UPDATE ccbc_public.form_data SET
 json_data ='{"submission": {"submissionDate": "", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}}'
 where id = 5;

 UPDATE ccbc_public.form_data SET
 json_data ='{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}}'
 where id = 6;

UPDATE ccbc_public.form_data SET
json_data ='{"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "", "submissionCompletedFor": "Testing Incorporated"}}'
where id = 7;

UPDATE ccbc_public.form_data SET
json_data ='{"acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] },"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": ""}}'
where id = 8;

UPDATE ccbc_public.form_data SET
json_data = '{"acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] },"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}}'
where id = 9;

insert into ccbc_public.application_status(application_id, status)
values
  (2, 'submitted'),
  (3, 'withdrawn');

select mocks.set_mocked_time_in_transaction((select open_timestamp - interval '1 second' from ccbc_public.intake limit 1));


select throws_like(
  $$
    select ccbc_public.submit_application(1,1)
  $$,
  'There is no open intake, the application cannot be submitted',
  'Throws an exception when there is no open intake'
);

select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

select throws_like(
  $$
    select ccbc_public.submit_application(3,1)
  $$,
  'The application cannot be submitted as it has the following status: withdrawn',
  'Throws an exception when the application is withdrawn'
);

select results_eq(
  $$
    select application.id, application.ccbc_number, application_status.status , application.intake_id
    from ccbc_public.submit_application(2,1) as application,
     ccbc_public.application_status as application_status
     where application.id = application_status.application_id
     and application_status.status='submitted'
  $$,
  $$
    values (2, null::varchar, 'submitted'::varchar, null::int)
  $$,
  'Returns the application without changing it if already submitted'
);

select results_eq(
  $$
    select id, ccbc_number, intake_id from ccbc_public.submit_application(1,1)
  $$,
  $$
    values (1, 'CCBC-010001'::varchar, 1)
  $$,
  'Returns the application with an intake number if in draft'
);

select results_eq(
  $$
    select application_id, status from ccbc_public.application_status
      where application_id=1 and status='submitted'
  $$,
  $$
    values (1, 'submitted'::varchar)
  $$,
  'An application has been updated to submitted after'
);

select results_eq(
  $$
    select id, ccbc_number, intake_id from ccbc_public.submit_application(4,1)
  $$,
  $$
    values (4, 'CCBC-010002'::varchar, 1)
  $$,
  'Increases the ccbc number when submitting applications'
);

select throws_like(
  $$
    select ccbc_public.submit_application(5,1)
  $$,
  'The application cannot be submitted as the submission field submission_date is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(6,1)
  $$,
  'The application cannot be submitted as the submission field submission_title is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(7,1)
  $$,
  'The application cannot be submitted as the submission field submission_completed_by is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(8,1)
  $$,
  'The application cannot be submitted as the submission field submission_completed_for is null or empty'
);

select throws_like(
  $$
    select ccbc_public.submit_application(9,1)
  $$,
  'The application cannot be submitted as there are unchecked acknowledgements'
);

select function_privs_are(
  'ccbc_public', 'submit_application', ARRAY['int','int']::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.submit_application'
);

select function_privs_are(
  'ccbc_public', 'submit_application', ARRAY['int','int'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.submit_application'
);

-- TODO: check if form_data is set as committed

select finish();

rollback;
