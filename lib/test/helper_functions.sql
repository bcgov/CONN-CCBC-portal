-- Function to anonymize a single JSONB field if it exists
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_jsonb_field(
  input_jsonb jsonb,
  field_name text,
  anonymize_function text
) RETURNS jsonb AS $$
DECLARE
  result_text text;
  schema_name text := 'ccbc_public';
  func_name text;
  func_oid oid;
BEGIN
  IF input_jsonb IS NULL THEN
    RETURN input_jsonb;
  END IF;

  IF input_jsonb ? field_name THEN
    -- Extract function name (assume format ccbc_public.function_name)
    IF anonymize_function ~ '^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$' THEN
      schema_name := split_part(anonymize_function, '.', 1);
      func_name := split_part(anonymize_function, '.', 2);
    ELSE
      func_name := anonymize_function;
    END IF;

    -- Validate that the function exists in the specified schema
    SELECT p.oid INTO func_oid
    FROM pg_catalog.pg_proc p
    JOIN pg_catalog.pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = func_name
    AND n.nspname = schema_name
    AND p.pronargs = 1
    AND p.proargtypes[0] = 'text'::regtype;

    IF func_oid IS NOT NULL THEN
      -- Execute the function dynamically with schema prefix
      EXECUTE format('SELECT %I.%I(%L)', schema_name, func_name, input_jsonb->>field_name) INTO result_text;
      RETURN jsonb_set(
        input_jsonb,
        ARRAY[field_name],
        COALESCE(to_jsonb(result_text), 'null'::jsonb)
      );
    ELSE
      -- Log warning and skip anonymization
      RAISE NOTICE 'Function %.% does not exist for field %; skipping anonymization.',
        schema_name, func_name, field_name;
      RETURN input_jsonb;
    END IF;
  END IF;
  RETURN input_jsonb;
END;
$$ LANGUAGE plpgsql;

-- Function to process a specific page key and its fields (used for form data anonymization)
CREATE OR REPLACE FUNCTION ccbc_public.anonymize_page_data(
  page_key text,
  input_jsonb jsonb
) RETURNS jsonb AS $$
DECLARE
  result_jsonb jsonb := input_jsonb;
BEGIN
  IF input_jsonb IS NULL THEN
    RETURN input_jsonb;
  END IF;

  CASE page_key
    WHEN 'projectPlan' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'relationshipManagerApplicant', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'overviewProjectManagementTeam', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'overviewOfProjectParticipants', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'operationalPlan', 'ccbc_public.generate_lorem_ipsum');
    WHEN 'techSolution' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'systemDesign', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'scalability', 'ccbc_public.generate_lorem_ipsum');
    WHEN 'organizationLocation' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'streetNumber', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'streetName', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'POBox', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'city', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'mailingAddress', 'ccbc_public.generate_lorem_ipsum');
    WHEN 'contactInformation' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'contactTelephoneNumber', 'ccbc_public.anonymize_phone_number');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'contactEmail', 'ccbc_public.anonymize_email');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'contactWebsite', 'ccbc_public.anonymize_website');
    WHEN 'benefits' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'projectBenefits', 'ccbc_public.generate_lorem_ipsum');
    WHEN 'authorizedContact' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'authFamilyName', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'authGivenName', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'authPositionTitle', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'authEmail', 'ccbc_public.anonymize_email');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'authTelephone', 'ccbc_public.anonymize_phone_number');
    WHEN 'alternateContact' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'altFamilyName', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'altGivenName', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'altPositionTitle', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'altEmail', 'ccbc_public.anonymize_email');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'altTelephone', 'ccbc_public.anonymize_phone_number');
    WHEN 'projectInformation' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'geographicAreaDescription', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'projectDescription', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'projectTitle', 'ccbc_public.anonymize_project_title');
    WHEN 'organizationProfile' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'organizationName', 'ccbc_public.obfuscate_company_name');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'operatingName', 'ccbc_public.obfuscate_company_name');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'parentOrgName', 'ccbc_public.obfuscate_company_name');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'organizationOverview', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'indigenousEntityDesc', 'ccbc_public.generate_lorem_ipsum');
    WHEN 'submission' THEN
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'submissionCompletedFor', 'ccbc_public.obfuscate_company_name');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'submissionCompletedBy', 'ccbc_public.generate_lorem_ipsum');
      result_jsonb := ccbc_public.anonymize_jsonb_field(result_jsonb, 'submissionTitle', 'ccbc_public.generate_lorem_ipsum');
    WHEN 'otherFundingSources' THEN
      IF result_jsonb ? 'otherFundingSourcesArray' THEN
        result_jsonb := jsonb_set(
          result_jsonb,
          ARRAY['otherFundingSourcesArray'],
          COALESCE(
            (
              SELECT jsonb_agg(
                ccbc_public.anonymize_jsonb_field(
                  ccbc_public.anonymize_jsonb_field(elem, 'fundingPartnersName', 'ccbc_public.obfuscate_company_name'),
                  'fundingSourceContactInfo',
                  'ccbc_public.generate_lorem_ipsum'
                )
              )
              FROM jsonb_array_elements(result_jsonb->'otherFundingSourcesArray') elem
            ),
            result_jsonb->'otherFundingSourcesArray'
          )
        );
      END IF;
  END CASE;
  RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;
