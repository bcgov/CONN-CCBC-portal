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
      $${"id": 2, "created_at": "2023-08-28T20:41:22.651077+00:00", "json_data": {"rfiType": ["Missing files or information"], "rfiDueBy": "2023-08-01", "rfiAdditionalFiles": {"logicalNetworkDiagramRfi": true, "eligibilityAndImpactsCalculatorRfi": true, "communityRuralDevelopmentBenefitsTemplateRfi": true}},  "created_by": null, "rfi_number": "CCBC-010001-1", "updated_at": "2023-08-28T20:41:22.651077+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "rfi_data_status_type_id": "draft", "application_id": 1}$$),
      -- Screening assessment
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      $${"id": 3, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "screening"}$$),
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      -- screening edit
      $${"id": 4, "created_at": "2023-08-29T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01", "assessmentTemplate": [{"id": 1, "name": "test.xls", "size": 0, "type": "application/vnd.ms-excel", "uuid": "814c2927-ce90-420c-b19a-c3d361650dd9", "uploadedAt": "2023-08-28T14:16:47.402-07:00"}]}, "created_by": null, "updated_at": "2023-08-29T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "screening"}$$),
      -- Technical assessment
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      $${"id": 5, "created_at": "2023-08-30T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-30T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "technical"}$$),
      -- GIS assessment
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      $${"id": 6, "created_at": "2023-08-31T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-08-31T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "gis"}$$),
      -- Financial risk assessment
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      $${"id": 7, "created_at": "2023-09-01T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-09-01T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "financialRisk"}$$),
      -- Project management assessment
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      $${"id": 8, "created_at": "2023-09-02T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-09-02T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "projectManagement"}$$),
      -- Permitting assessment
      ('09990a12-547b-5fd4-a59b-e31ff2dd9d2e', 'INSERT', 123, 'ccbc_public', 'assessment_data', 2, now(),
      $${"id": 9, "created_at": "2023-09-03T21:06:00.879937+00:00", "json_data": {"decision": "No decision", "nextStep": "Not started", "targetDate": "2023-08-01"}, "created_by": null, "updated_at": "2023-09-03T21:06:00.879937+00:00", "updated_by": null, "archived_at": null, "archived_by": null, "application_id": 1, "assessment_data_type": "permitting"}$$);



commit;
