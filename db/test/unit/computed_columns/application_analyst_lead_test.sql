begin;

select plan(5);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.application_analyst_lead
restart identity cascade;


select function_privs_are(
  'ccbc_public', 'application_analyst_lead', ARRAY['ccbc_public.application'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.application_analyst_lead(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_analyst_lead', ARRAY['ccbc_public.application'], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.application_analyst_lead(ccbc_public.application)'
);

select function_privs_are(
  'ccbc_public', 'application_analyst_lead', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_analyst_lead(ccbc_public.application)'
);

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2022-11-06 09:00:00 America/Vancouver', 1);

select mocks.set_mocked_time_in_transaction('2022-08-20 09:00:00 America/Vancouver'::timestamptz);

set jwt.claims.sub to 'test';
set role ccbc_auth_user;

select ccbc_public.create_application();

insert into ccbc_public.application_status
(id, application_id, status,created_by, created_at)
overriding system value
values
(2,1,'received',1,'2022-10-18 10:16:45.319172-07');


set role ccbc_admin;

insert into ccbc_public.application_analyst_lead (application_id, analyst_id) VALUES (1, 1);
insert into ccbc_public.application_analyst_lead (application_id, analyst_id) VALUES (1, 2);

select is (
  (
    select ccbc_public.application_analyst_lead(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id = 1)
    )
  ),
  'Harpreet Bains',
  'ccbc_public.application_analyst_lead retrieves the analyst lead'
);

insert into ccbc_public.application_analyst_lead (application_id, analyst_id) VALUES (1, null);


select is (
  (
    select ccbc_public.application_analyst_lead(
      (select row(application.*)::ccbc_public.application from ccbc_public.application where id = 1)
    )
  ),
  NULL,
  'ccbc_public.application_analyst_lead returns correct value when analyst_id is null'
);

select finish();

rollback;
