begin;

select plan(6);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake,
  ccbc_public.rfi_data,
  ccbc_public.application_analyst_lead
restart identity cascade;


select has_function(
  'ccbc_public', 'update_rfi', ARRAY['int','jsonb'],
  'Function update_rfi should exist'
);
-- setup test data

insert into
  ccbc_public.intake(id, open_timestamp, close_timestamp, ccbc_intake_number)
overriding system value
values
  (1, '2022-08-19 09:00:00 America/Vancouver','2023-11-06 09:00:00 America/Vancouver', 1);

set jwt.claims.sub to 'testCcbcAuthUser';
insert into ccbc_public.ccbc_user
  (given_name, family_name, email_address, session_sub) values
  ('foo1', 'bar', 'foo1@bar.com', 'testCcbcAuthUser');

select mocks.set_mocked_time_in_transaction('2022-08-19 09:00:00 America/Vancouver');

set role ccbc_auth_user;

select id, owner, intake_id, ccbc_number from ccbc_public.create_application();

update ccbc_public.application set ccbc_number='CCBC-010001' where id=1;

insert into ccbc_public.application_status (id, application_id, status,created_by, created_at)
overriding system value
values (2,1,'received',1,'2022-10-18 10:16:45.319172-07');

set role ccbc_analyst;

select ccbc_public.create_rfi(1, '{}'::jsonb);

-- Tests

select results_eq(
  $$
    select id, rfi_number, json_data, archived_at from ccbc_public.update_rfi(1, '{"asdf":"asdf"}'::jsonb)
  $$,
  $$
    values (2, 'CCBC-010001-1'::varchar, '{"asdf":"asdf"}'::jsonb, null::timestamp with time zone)
  $$,
  'Should return updated RFI with same RFI Number'
);

select results_eq(
  $$
    select archived_at from ccbc_public.rfi_data where id=1;
  $$,
  $$
    values ('2022-08-19 12:00:00-04'::timestamp with time zone)
  $$,
  'Previous RFI Data should be archived'
);


select function_privs_are(
  'ccbc_public', 'update_rfi', ARRAY['int','jsonb'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.update_rfi'
);

select function_privs_are(
  'ccbc_public', 'update_rfi', ARRAY['int','jsonb'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.update_rfi'
);

select function_privs_are(
  'ccbc_public', 'update_rfi', ARRAY['int','jsonb'], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.update_rfi'
);

select finish();

rollback;
