begin;

select plan(9);


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
  'ccbc_public', 'form_data_is_editable',
  'Function form_data_is_editable should exist'
);


insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-07-01 09:00:01-07', '2022-09-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));

set jwt.claims.sub to 'testCcbcAuthUser';
select ccbc_public.create_application();

update ccbc_public.form_data set form_data_status_type_id = 'committed';
update ccbc_public.application set intake_id = 1;
insert into ccbc_public.application_status (application_id, status) VALUES (1,'submitted');

set role ccbc_auth_user;
select ccbc_public.create_application();

select results_eq (
  $$
    select ccbc_public.form_data_is_editable(ccbc_public.form_data.*)
    from ccbc_public.form_data where id = 1;
  $$,
  $$
    values('t'::boolean)
  $$,
  'Current form is editable as it is still an open intake and submitted'
);

select results_eq (
  $$
    select ccbc_public.form_data_is_editable(ccbc_public.form_data.*)
    from ccbc_public.form_data where id = 2;
  $$,
  $$
    values('t'::boolean)
  $$,
  'Current form is editable as it is a draft'
);

-- set to time after close date
set role to postgres;
select mocks.set_mocked_time_in_transaction((select close_timestamp + interval '1 day' from ccbc_public.intake limit 1));
set role to ccbc_auth_user;
select results_eq (
  $$
    select ccbc_public.form_data_is_editable(ccbc_public.form_data.*)
    from ccbc_public.form_data where id = 1;
  $$,
  $$
    values('f'::boolean)
  $$,
  'Current form is not editable as there is no open intake and it is submitted'
);

select results_eq (
  $$
    select ccbc_public.form_data_is_editable(ccbc_public.form_data.*)
    from ccbc_public.form_data where id = 2;
  $$,
  $$
    values('f'::boolean)
  $$,
  'Current form is not editable as it is a draft, and there is no open intake'
);

insert into ccbc_public.application_status (application_id, status) VALUES (1, 'withdrawn');
reset role;
select mocks.set_mocked_time_in_transaction((select open_timestamp + interval '1 day' from ccbc_public.intake limit 1));
set role ccbc_auth_user;
select results_eq (
  $$
    select ccbc_public.form_data_is_editable(ccbc_public.form_data.*)
    from ccbc_public.form_data where id=1;
  $$,
  $$
    values('f'::boolean)
  $$,
  'Form is uneditable though intake is open as it is withdrawn'
);

select function_privs_are(
  'ccbc_public', 'form_data_is_editable', ARRAY['ccbc_public.form_data'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.form_data_is_editable(ccbc_public.form_data)'
);

select function_privs_are(
  'ccbc_public', 'form_data_is_editable', ARRAY['ccbc_public.form_data'], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.form_data_is_editable(ccbc_public.form_data)'
);

select function_privs_are(
  'ccbc_public', 'form_data_is_editable', ARRAY['ccbc_public.form_data'], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.form_data_is_editable(ccbc_public.form_data)'
);


rollback;
