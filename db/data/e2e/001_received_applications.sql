begin;

do $$

declare _application_id int;
declare _form_data_id int;
declare received_application_status_id int;
begin

set jwt.claims.sub to 'mockUser@ccbc_auth_user';
insert into ccbc_public.ccbc_user
  (id, given_name, family_name, email_address, session_sub) overriding system value values
  (1, 'foo1', 'bar', 'foo1@bar.com', 'mockUser@ccbc_auth_user');

set jwt.claims.sub to 'e2e-user';

select application_id into received_application_status_id
from ccbc_public.application_status where status = 'received';

if received_application_status_id is not null then
 return;
end if;

perform mocks.set_mocked_time_in_transaction((select open_timestamp + interval '1 minute' from ccbc_public.intake where ccbc_intake_number = 1));
select id from ccbc_public.create_application() into _application_id;

select form_data_id into _form_data_id from ccbc_public.application_form_data
where application_id = _application_id limit 1;

update ccbc_public.form_data set
 json_data = '{ "projectInformation": {"projectTitle": "Recieved Application Title" }, "acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"},  "organizationProfile": {"organizationName": "org name received" }}'::jsonb
 where id=_form_data_id;

perform ccbc_public.submit_application(_application_id, 1);

insert into ccbc_public.application_status (application_id, status) values (_application_id, 'received');

select id from ccbc_public.create_application() into _application_id;

select form_data_id into _form_data_id from ccbc_public.application_form_data
where application_id = _application_id limit 1;

update ccbc_public.form_data set
 json_data = '{ "projectInformation": {"projectTitle": "Submitted Application Title" }, "acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"},  "organizationProfile": {"organizationName": "org name submitted" }}'::jsonb
 where id=_form_data_id;

perform ccbc_public.submit_application(_application_id, 1);

select id from ccbc_public.create_application() into _application_id;

select form_data_id into _form_data_id from ccbc_public.application_form_data
where application_id = _application_id limit 1;

update ccbc_public.form_data set
 json_data = '{ "projectInformation": {"projectTitle": "Withdrawn Application Title" }, "acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"},  "organizationProfile": {"organizationName": "org name withdrawn" }}'::jsonb
 where id=_form_data_id;

perform ccbc_public.submit_application(_application_id, 1);

perform ccbc_public.withdraw_application(_application_id);
-- create a draft application
perform ccbc_public.create_application();
end
$$ language plpgsql;
commit;
