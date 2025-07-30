BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Anonymize assessment_data records in record_version table
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' AND (
      record->'json_data' ? 'notesAndConsiderations' OR
      record->'json_data' ? 'commentsOnCoverageData' OR
      record->'json_data' ? 'commentsOnHouseholdCounts' OR
      record->'json_data' ? 'commentsOnOverbuild' OR
      record->'json_data' ? 'commentsOnOverlap' OR
      record->'json_data' ? 'completedAssessment' OR
      record->'json_data' ? 'assessmentTemplate' OR
      record->'json_data' ? 'otherFiles'
    ) THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_assessment_data_json(record->'json_data'),
        false
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' AND (
      old_record->'json_data' ? 'notesAndConsiderations' OR
      old_record->'json_data' ? 'commentsOnCoverageData' OR
      old_record->'json_data' ? 'commentsOnHouseholdCounts' OR
      old_record->'json_data' ? 'commentsOnOverbuild' OR
      old_record->'json_data' ? 'commentsOnOverlap' OR
      old_record->'json_data' ? 'completedAssessment' OR
      old_record->'json_data' ? 'assessmentTemplate' OR
      old_record->'json_data' ? 'otherFiles'
    ) THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_assessment_data_json(old_record->'json_data'),
        false
      )
    ELSE old_record
  END
WHERE table_name = 'assessment_data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND (
    record->'json_data' ? 'notesAndConsiderations' OR
    record->'json_data' ? 'commentsOnCoverageData' OR
    record->'json_data' ? 'commentsOnHouseholdCounts' OR
    record->'json_data' ? 'commentsOnOverbuild' OR
    record->'json_data' ? 'commentsOnOverlap' OR
    record->'json_data' ? 'completedAssessment' OR
    record->'json_data' ? 'assessmentTemplate' OR
    record->'json_data' ? 'otherFiles'
  )) OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND (
    old_record->'json_data' ? 'notesAndConsiderations' OR
    old_record->'json_data' ? 'commentsOnCoverageData' OR
    old_record->'json_data' ? 'commentsOnHouseholdCounts' OR
    old_record->'json_data' ? 'commentsOnOverbuild' OR
    old_record->'json_data' ? 'commentsOnOverlap' OR
    old_record->'json_data' ? 'completedAssessment' OR
    old_record->'json_data' ? 'assessmentTemplate' OR
    old_record->'json_data' ? 'otherFiles'
  ))
);

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
