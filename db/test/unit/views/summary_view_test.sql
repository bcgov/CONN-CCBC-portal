begin;
select plan(5);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity;


insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));


-- View exists
select has_view(
  'ccbc_public', 'summary_view',
  'ccbc_public.summary_view should exist and be a view'
);

-- Columns
select has_column('ccbc_public', 'summary_view', 'intake_id','The summary_view has column intake_id');
select has_column('ccbc_public', 'summary_view', 'id','The summary_view has column id');
select has_column('ccbc_public', 'summary_view', 'ccbc_number','The summary_view has column ccbc_number');

-- Total number of columns

select results_eq(
  $$
  SELECT
    count(*)
  FROM
    information_schema.columns
  WHERE
    table_name = 'summary_view';
  $$,
  $$
    values (3::bigint)
  $$,
  'Summary_view should have 123 columns'
);

-- Test setup - first user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';


select ccbc_public.create_application();

-- Test setup - second user
set jwt.claims.sub to '11111111-1111-1111-1111-111111111113';

select ccbc_public.create_application();
select ccbc_public.create_application();

set role ccbc_analyst;

select results_eq(
  $$
    select count(*) from ccbc_public.summary_view;
  $$,
  $$
    values (3::bigint)
  $$,
  'Analyst should be able to see all applications'
);

select finish();
rollback;
