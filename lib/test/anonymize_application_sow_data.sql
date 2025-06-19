BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.application_sow_data DISABLE TRIGGER ALL;

-- Main update query for application_sow_data
UPDATE ccbc_public.application_sow_data
SET json_data = COALESCE(
  (
    SELECT jsonb_object_agg(
      key,
      CASE
        WHEN key = 'projectTitle' AND json_data ? key THEN
          to_jsonb(
            (ccbc_public.anonymize_jsonb_field(
              jsonb_build_object('projectTitle', json_data->>'projectTitle'),
              'projectTitle',
              'ccbc_public.anonymize_project_title'
            ) ->> 'projectTitle')::text
          )
        WHEN key = 'organizationName' AND json_data ? key THEN
          to_jsonb(
            (ccbc_public.anonymize_jsonb_field(
              jsonb_build_object('organizationName', json_data->>'organizationName'),
              'organizationName',
              'ccbc_public.obfuscate_company_name'
            ) ->> 'organizationName')::text
          )
        ELSE
          json_data->key
      END
    )
    FROM jsonb_object_keys(json_data) AS key
  ),
  json_data
)
WHERE json_data IS NOT NULL
AND jsonb_typeof(json_data) = 'object';

-- Re-enable triggers
ALTER TABLE ccbc_public.application_sow_data ENABLE TRIGGER ALL;

COMMIT;
