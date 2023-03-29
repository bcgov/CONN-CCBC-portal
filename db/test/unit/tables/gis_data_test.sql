begin;

select plan(4);

truncate table
  ccbc_public.gis_data
restart identity cascade;

-- table exists
select has_table(
  'ccbc_public', 'gis_data',
  'ccbc_public.gis_data should exist and be a table'
);

-- Columns

select has_column('ccbc_public', 'gis_data', 'id','The table application has column id');
select has_column('ccbc_public', 'gis_data', 'json_data','The table application has column json_data');

set jwt.claims.sub to 'testCcbcAdminUser';

set role to ccbc_admin;
select ccbc_public.save_gis_data('{}'::jsonb);

select results_eq(
  $$
    select json_data, id from ccbc_public.gis_data;
  $$,
  $$
    values('{}'::jsonb, 1)
  $$,
  'Should be able to view your own entry'
);

select finish();

rollback;
