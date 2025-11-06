begin;

set jwt.claims.sub to 'mockUser@ccbc_auth_user';

insert into ccbc_public.ccbc_user
  (id, given_name, family_name, email_address, session_sub)
overriding system value
values
  (1, 'foo1', 'bar', 'foo1@bar.com', 'mockUser@ccbc_auth_user')
on conflict (id) do update set
  given_name = excluded.given_name,
  family_name = excluded.family_name,
  email_address = excluded.email_address,
  session_sub = excluded.session_sub;

select setval(
  'ccbc_public.ccbc_user_id_seq',
  (select coalesce(max(id), 1) from ccbc_public.ccbc_user),
  true
);

select mocks.set_mocked_time_in_transaction('2022-10-09 09:00:00-07'::timestamptz);

insert into ccbc_public.cbc_project(
	id, json_data, sharepoint_timestamp, created_at, updated_at)
	overriding system value values (7,
     $$[
            {
                "phase": 2,
                "intake": 1,
                "errorLog": [],
                "highwayKm": null,
                "projectType": "Transport",
                "reviewNotes": "Qtrly Report: Progress 0.39 -> 0.38",
                "transportKm": 124,
                "lastReviewed": "2023-07-11T00:00:00.000Z",
                "otherFunding": 265000,
                "projectTitle": "Project 1",
                "dateAnnounced": "2019-07-02T00:00:00.000Z",
                "projectNumber": 5555,
                "projectStatus": "Reporting Complete",
                "federalFunding": 555555,
                "householdCount": null,
                "applicantAmount": 555555,
                "bcFundingRequest": 5555555,
                "projectLocations": "Location 1",
                "milestoneComments": "Requested extension to March 31, 2024",
                "proposedStartDate": "2020-07-01T00:00:00.000Z",
                "primaryNewsRelease":
                  "https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html",
                "projectDescription": "Description 1",
                "totalProjectBudget": 5555555,
                "announcedByProvince": "YES",
                "dateAgreementSigned": "2021-02-24T00:00:00.000Z",
                "changeRequestPending": "No",
                "currentOperatingName": "Internet company 1",
                "federalFundingSource": "ISED-CTI",
                "transportProjectType": "Fibre",
                "indigenousCommunities": 5,
                "proposedCompletionDate": "2023-03-31T00:00:00.000Z",
                "constructionCompletedOn": null,
                "dateApplicationReceived": null,
                "reportingCompletionDate": null,
                "applicantContractualName": "Internet company 1",
                "dateConditionallyApproved": "2019-06-26T00:00:00.000Z",
                "eightThirtyMillionFunding": "No",
                "projectMilestoneCompleted": 0.5,
                "communitiesAndLocalesCount": 5,
                "connectedCoastNetworkDependant": "NO",
                "nditConditionalApprovalLetterSent": "YES",
                "bindingAgreementSignedNditRecipient": "YES"
            },
            {
                "phase": 2,
                "intake": 1,
                "errorLog": [],
                "highwayKm": null,
                "projectType": "Transport",
                "reviewNotes": "Qtrly Report: Progress 0.39 -> 0.38",
                "transportKm": 100,
                "lastReviewed": "2023-07-11T00:00:00.000Z",
                "otherFunding": 444444,
                "projectTitle": "Project 1",
                "dateAnnounced": "2019-07-02T00:00:00.000Z",
                "projectNumber": 4444,
                "projectStatus": "Agreement Signed",
                "federalFunding": 444444,
                "householdCount": null,
                "applicantAmount": 444444,
                "bcFundingRequest": 444444,
                "projectLocations": "Location 2",
                "milestoneComments": "Requested extension to March 31, 2024",
                "proposedStartDate": "2020-07-01T00:00:00.000Z",
                "primaryNewsRelease":
                  "https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html",
                "projectDescription": "Description 2",
                "totalProjectBudget": 444444,
                "announcedByProvince": "YES",
                "dateAgreementSigned": "2021-02-24T00:00:00.000Z",
                "changeRequestPending": "No",
                "currentOperatingName": "Internet company 2",
                "federalFundingSource": "ISED-CTI",
                "transportProjectType": "Fibre",
                "indigenousCommunities": 5,
                "proposedCompletionDate": "2023-03-31T00:00:00.000Z",
                "constructionCompletedOn": null,
                "dateApplicationReceived": null,
                "reportingCompletionDate": null,
                "applicantContractualName": "Internet company 2",
                "dateConditionallyApproved": "2019-06-26T00:00:00.000Z",
                "eightThirtyMillionFunding": "No",
                "projectMilestoneCompleted": 0.5,
                "communitiesAndLocalesCount": 5,
                "connectedCoastNetworkDependant": "NO",
                "nditConditionalApprovalLetterSent": "YES",
                "bindingAgreementSignedNditRecipient": "YES"
            },
            {
                "phase": 2,
                "intake": 1,
                "errorLog": [],
                "highwayKm": null,
                "projectType": "Transport",
                "reviewNotes": "Qtrly Report: Progress 0.39 -> 0.38",
                "transportKm": 99,
                "lastReviewed": "2023-07-11T00:00:00.000Z",
                "otherFunding": 33333,
                "projectTitle": "Project 3",
                "dateAnnounced": "2019-07-02T00:00:00.000Z",
                "projectNumber": 3333,
                "projectStatus": "Reporting Complete",
                "federalFunding": 333333,
                "householdCount": null,
                "applicantAmount": 33333,
                "bcFundingRequest": 333333,
                "projectLocations": "Location 3",
                "milestoneComments": "Requested extension to March 31, 2024",
                "proposedStartDate": "2020-07-01T00:00:00.000Z",
                "primaryNewsRelease":
                  "https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html",
                "projectDescription": "Description 2",
                "totalProjectBudget": 333333,
                "announcedByProvince": "YES",
                "dateAgreementSigned": "2021-02-24T00:00:00.000Z",
                "changeRequestPending": "No",
                "currentOperatingName": "Internet company 3",
                "federalFundingSource": "ISED-CTI",
                "transportProjectType": "Fibre",
                "indigenousCommunities": 3,
                "proposedCompletionDate": "2023-03-31T00:00:00.000Z",
                "constructionCompletedOn": null,
                "dateApplicationReceived": null,
                "reportingCompletionDate": null,
                "applicantContractualName": "Internet company 3",
                "dateConditionallyApproved": "2019-06-26T00:00:00.000Z",
                "eightThirtyMillionFunding": "No",
                "projectMilestoneCompleted": 0.5,
                "communitiesAndLocalesCount": 5,
                "connectedCoastNetworkDependant": "NO",
                "nditConditionalApprovalLetterSent": "YES",
                "bindingAgreementSignedNditRecipient": "YES"
            }
        ]$$,
        '2024-01-01 16:28:11.006719-07', '2024-01-02 16:28:11.006719-07', '2024-01-02 16:28:11.006719-07');

insert into ccbc_public.cbc(id, project_number, sharepoint_timestamp, created_at, updated_at)
  overriding system value values (1, 5555, '2024-01-01 16:28:11.006719-07', '2024-01-02 16:28:11.006719-07', '2024-01-02 16:28:11.006719-07');

insert into ccbc_public.cbc_data(id, cbc_id, project_number, json_data, sharepoint_timestamp, created_at, updated_at)
  overriding system value values (1, 1, 5555,
    $${
        "phase": 2,
        "intake": 1,
        "errorLog": [],
        "highwayKm": null,
        "projectType": "Transport",
        "reviewNotes": "Qtrly Report: Progress 0.39 -> 0.38",
        "transportKm": 124,
        "lastReviewed": "2023-07-11T00:00:00.000Z",
        "otherFunding": 265000,
        "projectTitle": "Project 1",
        "dateAnnounced": "2019-07-02T00:00:00.000Z",
        "projectNumber": 5555,
        "projectStatus": "Reporting Complete",
        "federalFunding": 555555,
        "householdCount": null,
        "applicantAmount": 555555,
        "bcFundingRequest": 5555555,
        "projectLocations": "Location 1",
        "milestoneComments": "Requested extension to March 31, 2024",
        "proposedStartDate": "2020-07-01T00:00:00.000Z",
        "primaryNewsRelease":
          "https://www.canada.ca/en/innovation-science-economic-development/news/2019/07/rural-communities-in-british-columbia-will-benefit-from-faster-internet.html",
        "projectDescription": "Description 1",
        "totalProjectBudget": 5555555,
        "announcedByProvince": "YES",
        "dateAgreementSigned": "2021-02-24T00:00:00.000Z",
        "changeRequestPending": "No",
        "currentOperatingName": "Internet company 1",
        "federalFundingSource": "ISED-CTI",
        "transportProjectType": "Fibre",
        "indigenousCommunities": 5,
        "proposedCompletionDate": "2023-03-31T00:00:00.000Z",
        "constructionCompletedOn": null,
        "dateApplicationReceived": null,
        "reportingCompletionDate": null,
        "applicantContractualName": "Internet company 1",
        "dateConditionallyApproved": "2019-06-26T00:00:00.000Z",
        "eightThirtyMillionFunding": "No",
        "projectMilestoneCompleted": 0.5,
        "communitiesAndLocalesCount": 5,
        "connectedCoastNetworkDependant": "NO",
        "nditConditionalApprovalLetterSent": "YES",
        "bindingAgreementSignedNditRecipient": "YES"
    }$$, '2024-01-01 16:28:11.006719-07', '2024-01-02 16:28:11.006719-07', '2024-01-02 16:28:11.006719-07');

reset jwt.claims.sub;

commit;
