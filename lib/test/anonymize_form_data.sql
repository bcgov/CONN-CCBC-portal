BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.form_data DISABLE TRIGGER ALL;

-- Main update query with preservation of all keys
UPDATE ccbc_public.form_data
SET json_data = COALESCE(
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
        ]) AND json_data ? key THEN
          COALESCE(ccbc_public.anonymize_page_data(key, json_data->key), json_data->key)
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
ALTER TABLE ccbc_public.form_data ENABLE TRIGGER ALL;

COMMIT;
