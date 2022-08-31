begin;

select plan(2);
set jwt.claims.sub to '11111111-1111-1111-1111-111111111112';

set role ccbc_auth_user;

select results_eq(
  $$
    select id, owner, form_data, intake_id, ccbc_number from ccbc_public.create_application();
  $$,
  $$
    values (1,'11111111-1111-1111-1111-111111111112'::varchar, '{}'::jsonb, null::int, null::varchar)
  $$,
  'Should return newly created application'
);

select results_eq(
  $$
    select application_id, status from ccbc_public.application_status where application_id = 1; 
  $$,
  $$
    values (1, 'draft'::varchar)
  $$,
  'Should create draft status'
);

select finish();
rollback;