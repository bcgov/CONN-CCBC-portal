BEGIN;

-- Disable triggers to avoid interference
ALTER TABLE ccbc_public.form_data DISABLE TRIGGER ALL;

-- Update json_data with transformed/anonymized fields
UPDATE ccbc_public.form_data
SET json_data = (
  SELECT jsonb_object_agg(
    page_key,
    CASE
      WHEN page_key = 'projectPlan' AND json_data ? 'projectPlan' THEN
        jsonb_set(
          json_data->'projectPlan',
          '{}',
          jsonb_build_object(
            'relationshipManagerApplicant',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'relationshipManagerApplicant')::text)), json_data->'projectPlan'->'relationshipManagerApplicant', 'null'::jsonb),
            'overviewProjectManagementTeam',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'overviewProjectManagementTeam')::text)), json_data->'projectPlan'->'overviewProjectManagementTeam', 'null'::jsonb),
            'overviewOfProjectParticipants',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'overviewOfProjectParticipants')::text)), json_data->'projectPlan'->'overviewOfProjectParticipants', 'null'::jsonb),
            'operationalPlan',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'operationalPlan')::text)), json_data->'projectPlan'->'operationalPlan', 'null'::jsonb)
          ) || (json_data->'projectPlan' - 'relationshipManagerApplicant'::text - 'overviewProjectManagementTeam'::text - 'overviewOfProjectParticipants'::text - 'operationalPlan'::text)
        )

      WHEN page_key = 'techSolution' AND json_data ? 'techSolution' THEN
        jsonb_set(
          json_data->'techSolution',
          '{}',
          jsonb_build_object(
            'systemDesign',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'techSolution'->>'systemDesign')::text)), json_data->'techSolution'->'systemDesign', 'null'::jsonb),
            'scalability',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'techSolution'->>'scalability')::text)), json_data->'techSolution'->'scalability', 'null'::jsonb)
          ) || (json_data->'techSolution' - 'systemDesign'::text - 'scalability'::text)
        )

      WHEN page_key = 'organizationLocation' AND json_data ? 'organizationLocation' THEN
        jsonb_set(
          json_data->'organizationLocation',
          '{}',
          jsonb_build_object(
            'streetNumber',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'streetNumber')::text)), json_data->'organizationLocation'->'streetNumber', 'null'::jsonb),
            'streetName',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'streetName')::text)), json_data->'organizationLocation'->'streetName', 'null'::jsonb),
            'POBox',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'POBox')::text)), json_data->'organizationLocation'->'POBox', 'null'::jsonb),
            'city',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'city')::text)), json_data->'organizationLocation'->'city', 'null'::jsonb),
            'mailingAddress',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'mailingAddress')::text)), json_data->'organizationLocation'->'mailingAddress', 'null'::jsonb)
          ) || (json_data->'organizationLocation' - 'streetNumber'::text - 'streetName'::text - 'POBox'::text - 'city'::text - 'mailingAddress'::text)
        )

      WHEN page_key = 'contactInformation' AND json_data ? 'contactInformation' THEN
        jsonb_set(
          json_data->'contactInformation',
          '{}',
          jsonb_build_object(
            'contactTelephoneNumber',
            COALESCE(to_jsonb(ccbc_public.anonymize_phone_number((json_data->'contactInformation'->>'contactTelephoneNumber')::text)), json_data->'contactInformation'->'contactTelephoneNumber', 'null'::jsonb),
            'contactEmail',
            COALESCE(to_jsonb(ccbc_public.anonymize_email((json_data->'contactInformation'->>'contactEmail')::text)), json_data->'contactInformation'->'contactEmail', 'null'::jsonb),
            'contactWebsite',
            COALESCE(to_jsonb(ccbc_public.anonymize_website((json_data->'contactInformation'->>'contactWebsite')::text)), json_data->'contactInformation'->'contactWebsite', 'null'::jsonb)
          ) || (json_data->'contactInformation' - 'contactTelephoneNumber'::text - 'contactEmail'::text - 'contactWebsite'::text)
        )

      WHEN page_key = 'authorizedContact' AND json_data ? 'authorizedContact' THEN
        jsonb_set(
          json_data->'authorizedContact',
          '{}',
          jsonb_build_object(
            'authFamilyName',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'authorizedContact'->>'authFamilyName')::text)), json_data->'authorizedContact'->'authFamilyName', 'null'::jsonb),
            'authGivenName',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'authorizedContact'->>'authGivenName')::text)), json_data->'authorizedContact'->'authGivenName', 'null'::jsonb),
            'authPositionTitle',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'authorizedContact'->>'authPositionTitle')::text)), json_data->'authorizedContact'->'authPositionTitle', 'null'::jsonb),
            'authEmail',
            COALESCE(to_jsonb(ccbc_public.anonymize_email((json_data->'authorizedContact'->>'authEmail')::text)), json_data->'authorizedContact'->'authEmail', 'null'::jsonb),
            'authTelephone',
            COALESCE(to_jsonb(ccbc_public.anonymize_phone_number((json_data->'authorizedContact'->>'authTelephone')::text)), json_data->'authorizedContact'->'authTelephone', 'null'::jsonb)
          ) || (json_data->'authorizedContact' - 'authFamilyName'::text - 'authGivenName'::text - 'authPositionTitle'::text - 'authEmail'::text - 'authTelephone'::text)
        )

      WHEN page_key = 'alternateContact' AND json_data ? 'alternateContact' THEN
        jsonb_set(
          json_data->'alternateContact',
          '{}',
          jsonb_build_object(
            'altFamilyName',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'alternateContact'->>'altFamilyName')::text)), json_data->'alternateContact'->'altFamilyName', 'null'::jsonb),
            'altGivenName',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'alternateContact'->>'altGivenName')::text)), json_data->'alternateContact'->'altGivenName', 'null'::jsonb),
            'altPositionTitle',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'alternateContact'->>'altPositionTitle')::text)), json_data->'alternateContact'->'altPositionTitle', 'null'::jsonb),
            'altEmail',
            COALESCE(to_jsonb(ccbc_public.anonymize_email((json_data->'alternateContact'->>'altEmail')::text)), json_data->'alternateContact'->'altEmail', 'null'::jsonb),
            'altTelephone',
            COALESCE(to_jsonb(ccbc_public.anonymize_phone_number((json_data->'alternateContact'->>'altTelephone')::text)), json_data->'alternateContact'->'altTelephone', 'null'::jsonb)
          ) || (json_data->'alternateContact' - 'altFamilyName'::text - 'altGivenName'::text - 'altPositionTitle'::text - 'altEmail'::text - 'altTelephone'::text)
        )

      WHEN page_key = 'projectInformation' AND json_data ? 'projectInformation' THEN
        jsonb_set(
          json_data->'projectInformation',
          '{}',
          jsonb_build_object(
            'geographicAreaDescription',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectInformation'->>'geographicAreaDescription')::text)), json_data->'projectInformation'->'geographicAreaDescription', 'null'::jsonb),
            'projectDescription',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectInformation'->>'projectDescription')::text)), json_data->'projectInformation'->'projectDescription', 'null'::jsonb)
          ) || (json_data->'projectInformation' - 'geographicAreaDescription'::text - 'projectDescription'::text)
        )

      WHEN page_key = 'organizationProfile' AND json_data ? 'organizationProfile' THEN
        jsonb_set(
          json_data->'organizationProfile',
          '{}',
          jsonb_build_object(
            'organizationName',
            COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'organizationProfile'->>'organizationName')::text)), json_data->'organizationProfile'->'organizationName', 'null'::jsonb),
            'operatingName',
            COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'organizationProfile'->>'operatingName')::text)), json_data->'organizationProfile'->'operatingName', 'null'::jsonb),
            'parentOrgName',
            COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'organizationProfile'->>'parentOrgName')::text)), json_data->'organizationProfile'->'parentOrgName', 'null'::jsonb),
            'organizationOverview',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationProfile'->>'organizationOverview')::text)), json_data->'organizationProfile'->'organizationOverview', 'null'::jsonb),
            'indigenousEntityDesc',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationProfile'->>'indigenousEntityDesc')::text)), json_data->'organizationProfile'->'indigenousEntityDesc', 'null'::jsonb)
          ) || (json_data->'organizationProfile' - 'organizationName'::text - 'operatingName'::text - 'parentOrgName'::text - 'organizationOverview'::text - 'indigenousEntityDesc'::text)
        )

      WHEN page_key = 'submission' AND json_data ? 'submission' THEN
        jsonb_set(
          json_data->'submission',
          '{}',
          jsonb_build_object(
            'submissionCompletedFor',
            COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'submission'->>'submissionCompletedFor')::text)), json_data->'submission'->'submissionCompletedFor', 'null'::jsonb),
            'submissionCompletedBy',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'submission'->>'submissionCompletedBy')::text)), json_data->'submission'->'submissionCompletedBy', 'null'::jsonb),
            'submissionTitle',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'submission'->>'submissionTitle')::text)), json_data->'submission'->'submissionTitle', 'null'::jsonb)
          ) || (json_data->'submission' - 'submissionCompletedFor'::text - 'submissionCompletedBy'::text - 'submissionTitle'::text)
        )

      WHEN page_key = 'benefits' AND json_data ? 'benefits' THEN
        jsonb_set(
          json_data->'benefits',
          '{}',
          jsonb_build_object(
            'projectBenefits',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'benefits'->>'projectBenefits')::text)), json_data->'benefits'->'projectBenefits', 'null'::jsonb)
          ) || (json_data->'benefits' - 'projectBenefits'::text)
        )

      WHEN page_key = 'otherFundingSources' AND json_data ? 'otherFundingSources' AND json_data->'otherFundingSources' ? 'otherFundingSourcesArray' THEN
        jsonb_set(
          json_data->'otherFundingSources',
          '{otherFundingSourcesArray}',
          COALESCE(
            (
              SELECT jsonb_agg(
                jsonb_set(
                  elem,
                  '{fundingPartnersName}',
                  COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((elem->>'fundingPartnersName')::text)), elem->'fundingPartnersName', 'null'::jsonb)
                ) || jsonb_set(
                  elem,
                  '{fundingSourceContactInfo}',
                  COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((elem->>'fundingSourceContactInfo')::text)), elem->'fundingSourceContactInfo', 'null'::jsonb)
                )
              )
              FROM jsonb_array_elements(json_data->'otherFundingSources'->'otherFundingSourcesArray') elem
            ),
            json_data->'otherFundingSources'->'otherFundingSourcesArray'
          )
        ) || (json_data->'otherFundingSources' - 'otherFundingSourcesArray'::text)

      ELSE json_data->page_key
    END
  )
  FROM unnest(ARRAY[
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
  ]) AS page_key
)
WHERE json_data IS NOT NULL;

-- Re-enable triggers
ALTER TABLE ccbc_public.form_data ENABLE TRIGGER ALL;

COMMIT;
