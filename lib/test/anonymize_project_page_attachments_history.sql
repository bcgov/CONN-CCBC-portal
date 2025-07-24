BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Anonymize conditional_approval_data records
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'letterOfApproval' THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_filenames(record->'json_data'),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'letterOfApproval' THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_filenames(old_record->'json_data'),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'conditional_approval_data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'letterOfApproval') OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'letterOfApproval')
);

-- Anonymize project_information_data records
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' AND (
      record->'json_data' ? 'sowWirelessUpload' OR
      record->'json_data' ? 'finalizedMapUpload' OR
      record->'json_data' ? 'statementOfWorkUpload' OR
      record->'json_data' ? 'fundingAgreementUpload'
    ) THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_filenames(record->'json_data'),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' AND (
      old_record->'json_data' ? 'sowWirelessUpload' OR
      old_record->'json_data' ? 'finalizedMapUpload' OR
      old_record->'json_data' ? 'statementOfWorkUpload' OR
      old_record->'json_data' ? 'fundingAgreementUpload'
    ) THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_filenames(old_record->'json_data'),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'project_information_data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND (
    record->'json_data' ? 'sowWirelessUpload' OR
    record->'json_data' ? 'finalizedMapUpload' OR
    record->'json_data' ? 'statementOfWorkUpload' OR
    record->'json_data' ? 'fundingAgreementUpload'
  )) OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND (
    old_record->'json_data' ? 'sowWirelessUpload' OR
    old_record->'json_data' ? 'finalizedMapUpload' OR
    old_record->'json_data' ? 'statementOfWorkUpload' OR
    old_record->'json_data' ? 'fundingAgreementUpload'
  ))
);

-- Anonymize application_community_progress_report_Data records
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'progressReportFile' THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_filenames(record->'json_data'),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'progressReportFile' THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_filenames(old_record->'json_data'),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'application_community_progress_report_Data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'progressReportFile') OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'progressReportFile')
);

-- Anonymize application_milestone_data records
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'milestoneFile' THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_filenames(record->'json_data'),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'milestoneFile' THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_filenames(old_record->'json_data'),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'application_milestone_data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'milestoneFile') OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'milestoneFile')
);

-- Anonymize application_claims_data records
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'claimsFile' THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_filenames(record->'json_data'),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'claimsFile' THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_filenames(old_record->'json_data'),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'application_claims_data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'claimsFile') OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'claimsFile')
);

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
