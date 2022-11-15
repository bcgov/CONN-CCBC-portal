begin;

select plan(9);

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.intake
restart identity;



-- table exists
select has_table(
  'ccbc_public', 'form_data',
  'ccbc_public.form_data should exist and be a table'
);
insert into ccbc_public.intake(open_timestamp, close_timestamp, ccbc_intake_number)
values('2022-03-01 09:00:00-07', '2022-05-01 09:00:00-07', 1),
      ('2022-05-01 09:00:01-07', '2022-06-01 09:00:00-07', 2);
select mocks.set_mocked_time_in_transaction((select open_timestamp from ccbc_public.intake limit 1));
-- Columns

select has_column('ccbc_public', 'form_data', 'id','The table application has column id');
select has_column('ccbc_public', 'form_data', 'json_data','The table application has column json_data');
select has_column('ccbc_public', 'form_data', 'last_edited_page','The table application has column json_data');
select has_column('ccbc_public', 'form_data', 'last_edited_page','The table application has column json_data');

set jwt.claims.sub to 'user1';

set role ccbc_auth_user;

select ccbc_public.create_application();


select results_eq(
  $$
    select json_data, id from ccbc_public.form_data;
  $$,
  $$
    values('{}'::jsonb, 1)
  $$,
  'Should be able to view your own form'
);

-- RLS tests


set jwt.claims.sub to 'user2';

select ccbc_public.create_application();

select * from ccbc_public.form_data where
id in (select form_data_id from ccbc_public.application_form_data where form_data_id=id);

select results_eq(
  $$
    select count(*) from ccbc_public.form_data;
  $$,
  $$
    values(1::bigint)
  $$,
  'Should only show form data related to owned applications'
);


reset role;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as $$
select false;
$$ language sql;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user;


set role ccbc_auth_user;

update ccbc_public.form_data set json_data = '{"asdf":"asdf"}'::jsonb where id = 2;


select results_eq(
  $$
    select json_data from ccbc_public.form_data where id=2;
  $$,
  $$
    values('{}'::jsonb)
  $$,
  'Values are not updated if it does not pass RLS for is editable'
);

reset role;

create or replace function ccbc_public.form_data_is_editable(form_data ccbc_public.form_data) returns boolean as $$
select true;
$$ language sql;

grant execute on function ccbc_public.form_data_is_editable to ccbc_auth_user;


set role ccbc_auth_user;


update ccbc_public.form_data set json_data = '{"asdf":"asdf"}'::jsonb where id = 2;

select results_eq(
  $$
    select json_data from ccbc_public.form_data where id=2;
  $$,
  $$
    values('{"asdf":"asdf"}'::jsonb)
  $$,
  'Values are updated if it passes RLS for is editable'
);

select finish();

rollback;
