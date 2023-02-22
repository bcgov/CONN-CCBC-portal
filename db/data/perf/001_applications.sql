begin;

truncate table
  ccbc_public.application,
  ccbc_public.application_status,
  ccbc_public.attachment,
  ccbc_public.form_data,
  ccbc_public.application_form_data,
  ccbc_public.application_analyst_lead
restart identity cascade;

select mocks.set_mocked_time_in_transaction((select open_timestamp + interval '1 minute' from ccbc_public.intake where ccbc_intake_number = 1));
set role ccbc_auth_user;
set jwt.claims.sub to 'mockUser@ccbc_auth_user';
insert into ccbc_public.ccbc_user
  (id, given_name, family_name, email_address, session_sub) overriding system value values
  (1, 'foo1', 'bar', 'foo1@bar.com', 'mockUser@ccbc_auth_user');
  
do
$do_block$
declare
appId integer;
begin

for appNum in 1..100 loop

  select id into appId
  from ccbc_public.create_application();

  update ccbc_public.form_data
  set json_data = format($$
  {
    "projectInformation": {"projectTitle": "Test app %s"}
  }
  $$, appNum)::jsonb
  where id = (select form_data_id from ccbc_public.application_form_data where application_id = appId);

end loop;

end
$do_block$;

commit;
