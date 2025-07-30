BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Main update query for record_version where table_name = 'application_sow_data'
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
              WHEN key = 'projectTitle' AND (record->'json_data') ? key THEN
                to_jsonb(
                  (ccbc_public.anonymize_jsonb_field(
                    jsonb_build_object('projectTitle', record->'json_data'->>'projectTitle'),
                    'projectTitle',
                    'ccbc_public.anonymize_project_title'
                  ) ->> 'projectTitle')::text
                )
              WHEN key = 'organizationName' AND (record->'json_data') ? key THEN
                to_jsonb(
                  (ccbc_public.anonymize_jsonb_field(
                    jsonb_build_object('organizationName', record->'json_data'->>'organizationName'),
                    'organizationName',
                    'ccbc_public.obfuscate_company_name'
                  ) ->> 'organizationName')::text
                )
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
WHERE table_name = 'application_sow_data'
AND record IS NOT NULL
AND jsonb_typeof(record) = 'object';

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
