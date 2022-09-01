begin;

select plan(3);
set jwt.claims.sub to 'testCcbcAuthUser';

set role ccbc_auth_user;

select ccbc_public.create_application();
update ccbc_public.application set form_data = '{ "projectInformation": {"projectTitle": "my title" }}'::jsonb;

select is (
  (
    select ccbc_public.application_project_name(
      (select row(application.*)::ccbc_public.application from ccbc_public.application)
    )
  ),
  'my title',
  'ccbc_public.application_project_name retrieves the application name from the form_data'
);

select function_privs_are(
  'ccbc_public', 'application_project_name', ARRAY['ccbc_public.application'], 'ccbc_auth_user', ARRAY['EXECUTE'],
  'ccbc_auth_user can execute ccbc_public.application_project_name(ccbc_public.application)'
);
select function_privs_are(
  'ccbc_public', 'application_project_name', ARRAY['ccbc_public.application'], 'ccbc_guest', ARRAY[]::text[],
  'ccbc_guest cannot execute ccbc_public.application_project_name(ccbc_public.application)'
);

select finish();

rollback;
