BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.assessment_data DISABLE TRIGGER ALL;

-- Anonymize assessment_data table
UPDATE ccbc_public.assessment_data
SET json_data = ccbc_public.anonymize_assessment_data_json(json_data)
WHERE json_data IS NOT NULL AND (
  json_data ? 'notesAndConsiderations' OR
  json_data ? 'commentsOnCoverageData' OR
  json_data ? 'commentsOnHouseholdCounts' OR
  json_data ? 'commentsOnOverbuild' OR
  json_data ? 'commentsOnOverlap' OR
  json_data ? 'completedAssessment' OR
  json_data ? 'assessmentTemplate' OR
  json_data ? 'otherFiles'
);

-- Re-enable triggers
ALTER TABLE ccbc_public.assessment_data ENABLE TRIGGER ALL;

COMMIT;
