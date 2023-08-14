begin;

select plan(9);

select has_function('ccbc_public', 'open_intake',
 'function ccbc_public.open_intake exists');

-- setup intake table, since there is no guarantee that an intake will be available when running the test

delete from ccbc_public.intake;

insert into ccbc_public.intake
    (open_timestamp, close_timestamp, ccbc_intake_number)
    values (now(), now() + interval '10 days', 10);

-- ccbc_auth_user
set role ccbc_auth_user;
select concat('current user is: ', (select current_user));

select results_eq(
    $$
        select ccbc_intake_number from ccbc_public.open_intake();
    $$
    , ARRAY[10::int],
    'Current intake number is displayed for ccbc_auth_user'
    );

-- ccbc_guest
set role ccbc_guest;
select concat('current user is: ', (select current_user));

select results_eq(
    $$
        select ccbc_intake_number from ccbc_public.open_intake();
    $$
    , ARRAY[10::int],
    'Current intake number is displayed for guest'
    );

set role postgres;
update ccbc_public.intake set archived_at = now() where ccbc_intake_number = 10;

set role ccbc_auth_user;

select results_eq(
    $$
        select ccbc_intake_number from ccbc_public.open_intake();
    $$
    , ARRAY[null::int],
    'Current intake number is null when current intake is archived'
    );

-- no open intakes should return null
-- set role with enough permissions to delete from intake table
set role postgres;
delete from ccbc_public.intake;

insert into ccbc_public.intake
    (open_timestamp, close_timestamp, ccbc_intake_number)
    values (now() - interval '11 days', now() - interval '2 days', 10);

-- set role back to guest user
set role ccbc_guest;

select is(
    (select ccbc_intake_number from ccbc_public.open_intake())
    ,
    null
    ,
    'Open intake should return null when no intakes are available'
);

select function_privs_are(
  'ccbc_public', 'open_intake', ARRAY[]::text[], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.open_intake()'
);

select function_privs_are(
  'ccbc_public', 'open_intake', ARRAY[]::text[], 'ccbc_guest', ARRAY['EXECUTE'],
  'ccbc_guest can execute ccbc_public.open_intake()'
);

select function_privs_are(
  'ccbc_public', 'open_intake', ARRAY[]::text[], 'ccbc_admin', ARRAY['EXECUTE'],
  'ccbc_admin can execute ccbc_public.open_intake()'
);

select function_privs_are(
  'ccbc_public', 'open_intake', ARRAY[]::text[], 'ccbc_analyst', ARRAY['EXECUTE'],
  'ccbc_analyst can execute ccbc_public.open_intake()'
);

select finish();
rollback;
