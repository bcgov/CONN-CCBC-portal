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
(1,'draft',1,'2022-10-17 10:16:45.319172-07');

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
        "submissionTitle": "Tester bot"
     },
    "projectInformation": {"projectTitle": "Test application"},
    "review":{
        "acknowledgeIncomplete": true
    },
    "organizationProfile": {
        "organizationName": "Test org name"
    },
    "acknowledgements": {"acknowledgementsList": [
        "The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project.",
        "The Applicant acknowledges that the Program may collect and share Applicant information for purposes that include making enquiries of such persons, firms, corporations, federal and provincial government agencies/departments/ministries, and non-profit organizations as the Program deems necessary in order to reach a decision on this proposed project.",
        "The Applicant acknowledges that any person, who is required to be registered pursuant to the Lobbyists Transparency Act (British Columbia) or the Lobbying Act (Canada), including consultant and in-house lobbyists, must be registered pursuant to, and comply with, those Acts as applicable.",
        "The Applicant acknowledges that, where applicable, the Project may require an assessment under the Impact Assessment Act (Canada) or the Environmental Assessment Act (British Columbia).",
        "The Applicant recognizes that there is a duty to consult Indigenous groups if a funded Project may undertake infrastructure in, or affecting, an Indigenous community, and the Applicant understands that it must provide such information and assistance to the Province or Federal government in connection with such consultation as may reasonably be required, including, but not limited to, those obligations with respect to Indigenous consultation which may be set forth in any Funding Agreement.",
        "The Applicant acknowledges that any current or former public officer holder or public servant employed by the Applicant must comply with the provisions of the Standards of Conduct for BC Public Service employees, the Disclosing a Conflict of Interest: Employee Guideline & Disclosure Form (British Columbia), the Members’ Conflict of Interest Act (British Columbia), the Values and Ethics Code for the Public Service (Canada), the Policy on Conflict of Interest and Post-Employment (Canada), and the Conflict of Interest Act (Canada), as applicable.",
        "The Applicant understands that all costs incurred in the preparation and submission of the application shall be wholly absorbed by the Applicant.",
        "The Applicant understands that the Program reserves the right to make partial awards and to negotiate project scope changes with Applicants.",
        "The Applicant understands that the Program is a discretionary program subject to available funding, and that submission of a complete application, meeting any or all of the eligibility criteria, does not guarantee that funding will be granted. All Applicants whose Projects are approved for funding will be notified in writing.",
        "The Applicant acknowledges that it must ensure compliance with any applicable Canadian national security requirements as defined and/or administered by the Canadian security authorities, and any Provincial security requirements as defined and/or administered by the Province.",
        "The Applicant acknowledges that it must have the managerial and financial capacity to deliver this proposed project on time and within budget and to maintain the infrastructure and services on an ongoing basis for five years after project completion.",
        "The Applicant confirms that it is requesting the lowest possible Program contribution amount required to make this proposed Project financially viable.",
        "The Applicant acknowledges that information provided in this Application Form (including attachments) may be shared between the Province and the Government of Canada and other levels of government to promote the Program and maximize the benefits to Canadian citizens and permanent residents.",
        "The Applicant acknowledges that all activities required for this proposed Project must comply with all applicable federal, provincial, and territorial laws, regulations, municipal and other local by-laws.",
        "The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may affect its eligibility and may result in the revocation of funding approval.",
        "The Applicant acknowledges that information submitted in an application is subject to the Access to Information Act (Canada) or the Freedom of Information and Protection of Privacy Act (BC), as applicable.",
        "The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct as of the date of submission."
    ]}
}$$,
'projectInformation',
'pending',1,'2022-10-17 16:28:11.006719-07',1,'2022-10-17 16:28:26.105206-07', 1);

insert into ccbc_public.application_form_data
(form_data_id, application_id)
values (1,1);

commit;
