begin;

select plan(1);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.application_analyst_lead
restart identity cascade;

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

set role ccbc_admin;

select results_eq(
  $$
    select id, reason_for_change from ccbc_public.create_new_form_data(1::int,'{}'::jsonb, 'reason for change'::varchar, 1::int);
  $$,
  $$
    values (2::int,'reason for change'::varchar)
  $$,
  'Should return newly created form data'
);

select finish();
rollback;
