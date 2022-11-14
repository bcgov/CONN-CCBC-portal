begin;

select plan(3);

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

select finish();

rollback;
