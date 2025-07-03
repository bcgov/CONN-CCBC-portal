BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Main update query for record_version
UPDATE ccbc_public.record_version
SET record = COALESCE(
  (
    SELECT jsonb_set(
      record,
      ARRAY['json_data'],
      COALESCE(
        (
          SELECT jsonb_object_agg(
            key,
            CASE
              WHEN key = ANY(ARRAY[
                'projectPlan',
                'techSolution',
                'organizationLocation',
                'contactInformation',
                'authorizedContact',
                'alternateContact',
                'projectInformation',
                'organizationProfile',
                'submission',
                'benefits',
                'otherFundingSources'
              ]) AND (record->'json_data') ? key THEN
                COALESCE(ccbc_public.anonymize_page_data(key, record->'json_data'->key), record->'json_data'->key)
              ELSE
                record->'json_data'->key
            END
          )
          FROM jsonb_object_keys(record->'json_data') AS key
        ),
        record->'json_data'
      )
    )
    WHERE record ? 'json_data'
    AND jsonb_typeof(record->'json_data') = 'object'
  ),
  record
)
WHERE table_name = 'form_data'
AND record IS NOT NULL
AND jsonb_typeof(record) = 'object';

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
