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
(1,'approved',1,'2022-10-17 10:16:45.319172-07');

insert into ccbc_public.form_data
(id, json_data, last_edited_page, form_data_status_type_id, created_by, created_at, updated_by, updated_at, form_schema_id)
overriding system value
values
(1,
'{"submission": {"submissionDate": "2022-10-09", "submissionCompletedFor": "Test org name", "submissionCompletedBy": "Test Applicant", "submissionTitle": "Summary Test With Milestones"}, "projectInformation": {"projectTitle": "Summary Test Application - With Milestones"}, "review": {"acknowledgeIncomplete": true}, "organizationProfile": {"organizationName": "Test org name"}, "projectFunding": {"totalFundingRequestedCCBC": 1000000, "totalApplicantContribution": 250000}, "budgetDetails": {"totalProjectCost": 1250000}, "projectPlan": {"projectStartDate": "2023-01-01", "projectCompletionDate": "2024-12-31"}, "benefits": {"numberOfHouseholds": 500, "householdsImpactedIndigenous": 150}, "acknowledgements": {"acknowledgementsList": ["The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project."]}}',
'projectInformation',
'pending',1,'2022-10-17 16:28:11.006719-07',1,'2022-10-17 16:28:26.105206-07', 1);

insert into ccbc_public.application_form_data
(form_data_id, application_id)
values (1,1);

-- Insert milestone data
insert into ccbc_public.application_milestone_excel_data
(id, json_data, application_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
(1,
'{"overallMilestoneProgress": 0.75}',
1, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

-- Insert conditional approval data
insert into ccbc_public.conditional_approval_data
(json_data, application_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
('{"decision": {"ministerDecision": "Approved", "ministerDate": "2022-11-15", "provincialRequested": 600000}, "isedDecisionObj": {"isedDecision": "Approved", "isedDate": "2022-11-10", "federalRequested": 400000}}',
1, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

-- Insert project information data
insert into ccbc_public.project_information_data
(json_data, application_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
('{"dateFundingAgreementSigned": "2022-12-01"}',
1, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

-- Insert SOW data
insert into ccbc_public.application_sow_data
(json_data, application_id, amendment_number, created_by, created_at, updated_by, updated_at)
overriding system value
values
('{"effectiveStartDate": "2023-01-15", "projectStartDate": "2023-02-01", "projectCompletionDate": "2024-11-30"}',
1, 0, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

-- Insert SOW Tab 1 data
insert into ccbc_public.sow_tab_1
(json_data, sow_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
('{"numberOfHouseholds": 600, "householdsImpactedIndigenous": 180}',
1, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

-- Insert SOW Tab 7 data
insert into ccbc_public.sow_tab_7
(json_data, sow_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
('{"summaryTable": {"amountRequestedFromProvince": 650000, "amountRequestedFromFederalGovernment": 350000, "totalFundingRequestedCCBC": 1000000, "totalApplicantContribution": 300000, "totalProjectCost": 1300000}}',
1, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

-- Insert SOW Tab 8 data
insert into ccbc_public.sow_tab_8
(json_data, sow_id, created_by, created_at, updated_by, updated_at)
overriding system value
values
('{"communitiesNumber": 6, "indigenousCommunitiesNumber": 2, "geoNames": [{"bcGeoName": "SOW Milestone Community 1", "geoNameId": "7001", "indigenous": "N", "impacted": "YES", "mapLink": "http://example.com/sowmap1"}, {"bcGeoName": "SOW Milestone Indigenous Community 1", "geoNameId": "7002", "indigenous": "Y", "impacted": "YES", "mapLink": "http://example.com/sowmap2"}]}',
1, 1, '2022-10-17 16:28:11.006719-07', 1, '2022-10-17 16:28:26.105206-07');

commit;
