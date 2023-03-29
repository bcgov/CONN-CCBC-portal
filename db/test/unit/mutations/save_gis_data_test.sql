begin;

select plan(4);
truncate table
  ccbc_public.gis_data
restart identity cascade;

set jwt.claims.sub to 'testCcbcAdminUser';

set role to ccbc_admin;
select results_eq(
  $$
    select id, json_data, archived_at from ccbc_public.save_gis_data('{"asdf":"asdf"}'::jsonb)
  $$,
  $$
    values (1,'{"asdf":"asdf"}'::jsonb, null::timestamp with time zone)
  $$,
  'Should return inserted record'
);


select function_privs_are(
  'ccbc_public', 'save_gis_data', ARRAY['jsonb'], 'ccbc_admin', ARRAY['EXECUTE']::text[],
  'ccbc_admin can execute ccbc_public.save_gis_data()'
);

select function_privs_are(
  'ccbc_public', 'save_gis_data', ARRAY['jsonb'], 'ccbc_auth_user', ARRAY[]::text[],
  'ccbc_auth_user cannot execute ccbc_public.save_gis_data()'
);

select function_privs_are(
  'ccbc_public', 'save_gis_data', ARRAY['jsonb'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.save_gis_data()'
);

select finish();
rollback;
