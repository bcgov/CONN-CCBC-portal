begin;

select plan(2);

select function_privs_are(
  'ccbc_public', 'application_status', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_status(ccbc_public.application)'
);
select function_privs_are(
  'ccbc_public', 'application_status', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_status(ccbc_public.application)'
);

select finish();

rollback;
