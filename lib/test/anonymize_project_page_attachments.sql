BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.conditional_approval_data DISABLE TRIGGER ALL;
ALTER TABLE ccbc_public.project_information_data DISABLE TRIGGER ALL;
ALTER TABLE ccbc_public.application_community_progress_report_Data DISABLE TRIGGER ALL;
ALTER TABLE ccbc_public.application_milestone_data DISABLE TRIGGER ALL;
ALTER TABLE ccbc_public.application_claims_data DISABLE TRIGGER ALL;

-- Main update queries

UPDATE ccbc_public.conditional_approval_data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'letterOfApproval'
);

UPDATE ccbc_public.project_information_data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'sowWirelessUpload' OR
  json_data ? 'finalizedMapUpload' OR
  json_data ? 'statementOfWorkUpload' OR
  json_data ? 'fundingAgreementUpload'
);

UPDATE ccbc_public.application_community_progress_report_Data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'progressReportFile'
);

UPDATE ccbc_public.application_milestone_data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'milestoneFile'
);

UPDATE ccbc_public.application_claims_data
SET json_data = ccbc_public.anonymize_filenames(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'claimsFile'
);

-- Re-enable triggers
ALTER TABLE ccbc_public.conditional_approval_data ENABLE TRIGGER ALL;
ALTER TABLE ccbc_public.project_information_data ENABLE TRIGGER ALL;
ALTER TABLE ccbc_public.application_community_progress_report_Data ENABLE TRIGGER ALL;
ALTER TABLE ccbc_public.application_milestone_data ENABLE TRIGGER ALL;
ALTER TABLE ccbc_public.application_claims_data ENABLE TRIGGER ALL;

COMMIT;
