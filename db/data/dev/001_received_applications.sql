begin;

set jwt.claims.sub to 'dev-user';

select ccbc_public.create_application();

UPDATE ccbc_public.form_data SET
 json_data = '{ "projectInformation": {"projectTitle": "Recieved Application Title" }, "acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"},  "organizationProfile": {"organizationName": "org name received" }}'::jsonb;

select ccbc_public.submit_application(1);

insert into ccbc_public.application_status (application_id, status) values (1, 'received');

select ccbc_public.create_application();

UPDATE ccbc_public.form_data SET
 json_data = '{ "projectInformation": {"projectTitle": "Submitted Application Title" }, "acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"},  "organizationProfile": {"organizationName": "org name submitted" }}'::jsonb
 where id=2;

select ccbc_public.submit_application(2);

select ccbc_public.create_application();

UPDATE ccbc_public.form_data SET
 json_data = '{ "projectInformation": {"projectTitle": "Withdrawn Application Title" }, "acknowledgements": { "acknowledgementsList": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] }, "submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"},  "organizationProfile": {"organizationName": "org name withdrawn" }}'::jsonb
 where id=3;

select ccbc_public.submit_application(3);

select ccbc_public.withdraw_application(3);
-- create a draft application
select ccbc_public.create_application();


commit;
