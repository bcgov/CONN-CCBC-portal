begin;

select plan(5);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.application_analyst_lead
restart identity cascade;

select has_function(
  'ccbc_public', 'application_form_data',
  'Function application_form_data should exist'
);

insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1);

select mocks.set_mocked_time_in_transaction('2022-04-01 09:00:00-07'::timestamptz);
set jwt.claims.sub to 'testCcbcAuthUser';
set role ccbc_auth_user;

select ccbc_public.create_application();
update ccbc_public.form_data set json_data = '{ "projectInformation": {"projectTitle": "my title" }}'::jsonb;

select ccbc_public.create_application();

set jwt.claims.sub to 'testCcbcAuthUser2';

select ccbc_public.create_application();

set jwt.claims.sub to 'testCcbcAuthUser';

select results_eq (
  $$
    select id, json_data from ccbc_public.application_form_data(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id=1)
    );
  $$,
  $$
    values(1::int,'{"projectInformation": {"projectTitle": "my title"}}'::jsonb)
  $$,
  'ccbc_public.application_form_data retrieves the correct application form_data from the form_data table'
);

select results_eq (
  $$
    select id, json_data from ccbc_public.application_form_data(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id=2)
    );
  $$,
  $$
    values(2::int,'{}'::jsonb)
  $$,
  'ccbc_public.application_form_data retrieves the correct application form_data from the form_data table'
);

select results_eq (
  $$
        select id, json_data from ccbc_public.application_form_data(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id=3)
    );
  $$,
  $$
    values(null::int, null::jsonb)
  $$,
  'Cannot see the form_data from an application one does not own'
);

select function_privs_are(
  'ccbc_public', 'application_form_data', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_form_data(ccbc_public.application)'
);

select finish();

rollback;
