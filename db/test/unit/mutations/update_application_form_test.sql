begin;

select plan(4);

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
  'ccbc_public', 'update_application_form', ARRAY['int','jsonb','varchar'],
  'Function update_application_form should exist'
);


set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values ('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

select ccbc_public.create_application();

select ccbc_public.update_application_form(
  1,
  jsonb_build_object(
    'projectInformation', jsonb_build_object(
      'title', 'some title'
    )
  ),
  'projectInformation'
);

select results_eq(
  $$
    select
      json_data->'projectInformation'->>'title',
      json_data->'submission'->>'submissionDate',
      json_data->'submission'->>'submissionCompletedFor',
      last_edited_page
    from ccbc_public.form_data where id = 1
  $$,
  $$
    values
    ('some title', '2022-03-01', null::text, 'projectInformation'::varchar)
  $$,
  'update_application_form sets the submissionDate and last_edited_page'
);


select mocks.set_mocked_time_in_transaction((select open_timestamp + interval '1 day' from ccbc_public.intake limit 1));

select ccbc_public.update_application_form(
  1,
  jsonb_build_object(
    'projectInformation', jsonb_build_object(
      'title', 'some title'
    ),
    'organizationProfile', jsonb_build_object(
      'organizationName', 'my org'
    )
  ),
  'projectInformation'
);

select results_eq(
  $$
    select
      json_data->'projectInformation'->>'title',
      json_data->'submission'->>'submissionDate',
      json_data->'submission'->>'submissionCompletedFor',
      last_edited_page
    from ccbc_public.form_data where id = 1
  $$,
  $$
    values
    ('some title', '2022-03-02', 'my org', 'projectInformation'::varchar)
  $$,
  'update_application_form updates the submissionDate and sets submissionCompletedFor'
);


select function_privs_are(
  'ccbc_public', 'update_application_form', ARRAY['int','jsonb','varchar'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.update_application_form'
);

select finish();

rollback;
