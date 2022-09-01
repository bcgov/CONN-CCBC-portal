begin;

select plan(1);
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

select finish();

rollback;
