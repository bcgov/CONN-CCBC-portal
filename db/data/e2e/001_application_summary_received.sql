begin;

select mocks.set_mocked_time_in_transaction('2022-10-09 09:00:00-07'::timestamptz);

delete from ccbc_public.record_version cascade;
delete from ccbc_public.intake_users;
delete from ccbc_public.ccbc_user cascade;

set jwt.claims.sub to 'mockUser@ccbc_auth_user';
insert into ccbc_public.ccbc_user
  (id, given_name, family_name, email_address, session_sub) overriding system value values
  (1, 'foo1', 'bar', 'foo1@bar.com', 'mockUser@ccbc_auth_user');

insert into ccbc_public.intake_users
  (id, intake_id, user_id, created_by, created_at, updated_by, updated_at) overriding system value values
  (1, 1, 1, 1, '2022-10-17 10:16:45.319172-07', 1, '2022-10-17 10:16:45.319172-07');

insert into ccbc_public.application
(id, ccbc_number,owner,intake_id,created_by, created_at,updated_by, updated_at)
overriding system value
values
(1,'CCBC-010001', 'mockUser@ccbc_auth_user',1,1,'2022-10-17 10:16:45.319172-07',1,'2022-10-17 10:16:45.319172-07');

insert into ccbc_public.application_status
( application_id, status,created_by, created_at)
overriding system value
values
(1,'received',1,'2022-10-17 10:16:45.319172-07');

insert into ccbc_public.form_data
(id, json_data, last_edited_page, form_data_status_type_id, created_by, created_at, updated_by, updated_at, form_schema_id)
overriding system value
values
(1,
$${
    "submission": {
        "submissionDate": "2022-10-09",
        "submissionCompletedFor": "Test org name",
        "submissionCompletedBy": "Test Applicant",
        "submissionTitle": "Summary Test Received"
     },
    "projectInformation": {"projectTitle": "Summary Test Application - Received Status"},
    "review":{
        "acknowledgeIncomplete": true
    },
    "organizationProfile": {
        "organizationName": "Test org name"
    },
    "projectFunding": {
        "totalFundingRequestedCCBC": 1000000,
        "totalApplicantContribution": 250000
    },
    "budgetDetails": {
        "totalProjectCost": 1250000
    },
    "projectPlan": {
        "projectStartDate": "2023-01-01",
        "projectCompletionDate": "2024-12-31"
    },
    "benefits": {
        "numberOfHouseholds": 500,
        "householdsImpactedIndigenous": 150
    },
    "acknowledgements": {"acknowledgementsList": [
        "The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project."
    ]}
}$$,
'projectInformation',
'pending',1,'2022-10-17 16:28:11.006719-07',1,'2022-10-17 16:28:26.105206-07', 1);

insert into ccbc_public.application_form_data
(form_data_id, application_id)
values (1,1);

commit;
