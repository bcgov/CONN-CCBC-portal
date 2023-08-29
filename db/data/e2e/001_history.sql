begin;

insert into ccbc_public.ccbc_user
  (id, given_name, family_name, email_address, session_sub) overriding system value values
  (2, 'Annie', 'Analyst', 'test@e2etesting.com', 'mockUser@idir');

  insert into ccbc_public.record_version(record_id, op, table_oid, table_schema, table_name, created_by, created_at, record)
        values
    -- status: conditionally approved
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'application_status', 2, now(),
    $${"id": 1, "status": "conditionally_approved", "created_at": "2022-08-19T09:01:00-07:00", "created_by": 2, "updated_at": "2022-08-19T09:01:00-07:00", "updated_by": 2, "archived_at": null, "archived_by": null, "change_reason": null, "application_id": 1}$$),
     -- Analyst Create RFI
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'rfi_data', 2, now(),
    $${"id": 1, "created_at": "2023-08-28T20:41:22.651077+00:00", "json_data": {"rfiType": ["Missing files or information"], "rfiDueBy": "2023-08-01", "rfiAdditionalFiles": {"logicalNetworkDiagramRfi": true, "eligibilityAndImpactsCalculatorRfi": true, "communityRuralDevelopmentBenefitsTemplateRfi": true}},  "created_by": null, "rfi_number": "CCBC-010001-1", "updated_at": "2023-08-28T20:41:22.651077+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "rfi_data_status_type_id": "draft", "application_id": 1}$$),
    -- Screening assessment
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
    $${"id": 1, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "screening"}$$),
    -- Technical assessment
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
    $${"id": 2, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "technical"}$$),
    -- GIS assessment
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
    $${"id": 3, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "gis"}$$),
    -- Financial risk assessment
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
    $${"id": 4, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "financialRisk"}$$),
    -- Project management assessment
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
    $${"id": 5, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "projectManagement"}$$),
    -- Permitting assessment
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
    $${"id": 6, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "permitting"}$$),
    -- Conditional approval
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'conditional_approval_data', 2, now(),
    $${"id": 1, "json_data": {"decision": {"ministerDecision": "Approved"}}, "created_at": "2023-08-28T21:59:47.677748+00:00", "created_by": null, "updated_at": "2023-08-28T2159:47.677748+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1}$$),
    -- Announcement
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'application_announcement', 2, now(),
    $$ {"id": 1, "json_data": {"announcementUrl": "testing.com", "announcementDate": "2023-08-01", "announcementType": "Primary"}, "created_at": "2023-08-28T22:03:45.450322+00:00", "created_by": null, "updated_at": "2023-08-28T22:03:45.450322+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "ccbc_numbers": "CCBC-010001"}$$),
    -- Statement of work
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'project_information_data', 2, now(),
    $${"id": 1, "file": "f77a14f5-95d1-435f-b337-4cedce94acfa", "file_name": "CCBC-010001-sow_excel.xlsx", "file_size": "4.04 MB", "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "created_at": "2023-08-28T22:10:37.923142+00:00", "created_by": null, "updated_at": "2023-08-28T22:10:37.923142+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "description": null, "application_id": 1, "application_status_id": null}$$),
    -- Change request
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'change_request_data', 2, now(),
    $${"id": 1, "json_data": {"dateApproved": "2023-08-01", "dateRequested": "2023-08-01", "amendmentNumber": 1, "levelOfAmendment": "Major Amendment", "descriptionOfChanges": "test changes", "statementOfWorkUpload": [{"id": 1, "name": "CCBC-010001-sow_excel.xlsx", "size": 4232056, "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "uuid": "648c1c7c-c498-4c58-9da3-bec51eb76a62"}]}, "created_at": "2023-08-28T22:15:57.950376+00:00", "created_by": null, "updated_at": "2023-08-28T22:15:57.950376+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "amendment_number": 1}$$),
    -- Edit application
    ('09990a12-547b-5fd4-a59b-e31ff2dd9d5e', 'INSERT', 123, 'ccbc_public', 'form_data', 2, now(),
    $${"id": 2, "json_data": {"submission": {"submissionDate": "2022-09-15", "submissionTitle": "Test title", "submissionCompletedBy": "Mr Test", "submissionCompletedFor": "Testing Incorporated"}, "projectInformation": {"projectTitle": "Test title"}, "organizationProfile": {"organizationName": "org name received"}}, "created_at": "2023-08-29T18:12:54.02826+00:00", "created_by": null, "updated_at": "2023-08-29T18:12:54.02826+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "form_schema_id": 1, "last_edited_page": null, "reason_for_change": "e2e testing", "form_data_status_type_id": "pending", "application_id": 1}$$);


commit;
