BEGIN;

-- Disable triggers to avoid interference
ALTER TABLE ccbc_public.form_data DISABLE TRIGGER ALL;

-- Update json_data with transformed/anonymized fields
UPDATE ccbc_public.form_data
SET json_data = json_data || (
  SELECT jsonb_object_agg(
    page_key,
    CASE
      WHEN page_key = 'projectPlan' AND json_data ? 'projectPlan' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                json_data->'projectPlan',
                '{relationshipManagerApplicant}',
                COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'relationshipManagerApplicant')::text)), 'null'::jsonb)
              ),
              '{overviewProjectManagementTeam}',
              COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'overviewProjectManagementTeam')::text)), 'null'::jsonb)
            ),
            '{overviewOfProjectParticipants}',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'overviewOfProjectParticipants')::text)), 'null'::jsonb)
          ),
          '{operationalPlan}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectPlan'->>'operationalPlan')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'techSolution' AND json_data ? 'techSolution' THEN
        jsonb_set(
          jsonb_set(
            json_data->'techSolution',
            '{systemDesign}',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'techSolution'->>'systemDesign')::text)), 'null'::jsonb)
          ),
          '{scalability}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'techSolution'->>'scalability')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'organizationLocation' AND json_data ? 'organizationLocation' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  json_data->'organizationLocation',
                  '{streetNumber}',
                  COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'streetNumber')::text)), 'null'::jsonb)
                ),
                '{streetName}',
                COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'streetName')::text)), 'null'::jsonb)
              ),
              '{POBox}',
              COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'POBox')::text)), 'null'::jsonb)
            ),
            '{city}',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'city')::text)), 'null'::jsonb)
          ),
          '{mailingAddress}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationLocation'->>'mailingAddress')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'contactInformation' AND json_data ? 'contactInformation' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              json_data->'contactInformation',
              '{contactTelephoneNumber}',
              COALESCE(to_jsonb(ccbc_public.anonymize_phone_number((json_data->'contactInformation'->>'contactTelephoneNumber')::text)), 'null'::jsonb)
            ),
            '{contactEmail}',
            COALESCE(to_jsonb(ccbc_public.anonymize_email((json_data->'contactInformation'->>'contactEmail')::text)), 'null'::jsonb)
          ),
          '{contactWebsite}',
          COALESCE(to_jsonb(ccbc_public.anonymize_website((json_data->'contactInformation'->>'contactWebsite')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'authorizedContact' AND json_data ? 'authorizedContact' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  json_data->'authorizedContact',
                  '{authFamilyName}',
                  COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'authorizedContact'->>'authFamilyName')::text)), 'null'::jsonb)
                ),
                '{authGivenName}',
                COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'authorizedContact'->>'authGivenName')::text)), 'null'::jsonb)
              ),
              '{authPositionTitle}',
              COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'authorizedContact'->>'authPositionTitle')::text)), 'null'::jsonb)
            ),
            '{authEmail}',
            COALESCE(to_jsonb(ccbc_public.anonymize_email((json_data->'authorizedContact'->>'authEmail')::text)), 'null'::jsonb)
          ),
          '{authTelephone}',
          COALESCE(to_jsonb(ccbc_public.anonymize_phone_number((json_data->'authorizedContact'->>'authTelephone')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'alternateContact' AND json_data ? 'alternateContact' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  json_data->'alternateContact',
                  '{altFamilyName}',
                  COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'alternateContact'->>'altFamilyName')::text)), 'null'::jsonb)
                ),
                '{altGivenName}',
                COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'alternateContact'->>'altGivenName')::text)), 'null'::jsonb)
              ),
              '{altPositionTitle}',
              COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'alternateContact'->>'altPositionTitle')::text)), 'null'::jsonb)
            ),
            '{altEmail}',
            COALESCE(to_jsonb(ccbc_public.anonymize_email((json_data->'alternateContact'->>'altEmail')::text)), 'null'::jsonb)
          ),
          '{altTelephone}',
          COALESCE(to_jsonb(ccbc_public.anonymize_phone_number((json_data->'alternateContact'->>'altTelephone')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'projectInformation' AND json_data ? 'projectInformation' THEN
        jsonb_set(
          jsonb_set(
            json_data->'projectInformation',
            '{geographicAreaDescription}',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectInformation'->>'geographicAreaDescription')::text)), 'null'::jsonb)
          ),
          '{projectDescription}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'projectInformation'->>'projectDescription')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'organizationProfile' AND json_data ? 'organizationProfile' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  json_data->'organizationProfile',
                  '{organizationName}',
                  COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'organizationProfile'->>'organizationName')::text)), 'null'::jsonb)
                ),
                '{operatingName}',
                COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'organizationProfile'->>'operatingName')::text)), 'null'::jsonb)
              ),
              '{parentOrgName}',
              COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'organizationProfile'->>'parentOrgName')::text)), 'null'::jsonb)
            ),
            '{organizationOverview}',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationProfile'->>'organizationOverview')::text)), 'null'::jsonb)
          ),
          '{indigenousEntityDesc}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'organizationProfile'->>'indigenousEntityDesc')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'submission' AND json_data ? 'submission' THEN
        jsonb_set(
          jsonb_set(
            jsonb_set(
              json_data->'submission',
              '{submissionCompletedFor}',
              COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((json_data->'submission'->>'submissionCompletedFor')::text)), 'null'::jsonb)
            ),
            '{submissionCompletedBy}',
            COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'submission'->>'submissionCompletedBy')::text)), 'null'::jsonb)
          ),
          '{submissionTitle}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'submission'->>'submissionTitle')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'benefits' AND json_data ? 'benefits' THEN
        jsonb_set(
          json_data->'benefits',
          '{projectBenefits}',
          COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((json_data->'benefits'->>'projectBenefits')::text)), 'null'::jsonb)
        )

      WHEN page_key = 'otherFundingSources' AND json_data ? 'otherFundingSources' AND json_data->'otherFundingSources' ? 'otherFundingSourcesArray' THEN
        jsonb_set(
          json_data->'otherFundingSources',
          '{otherFundingSourcesArray}',
          COALESCE(
            (
              SELECT jsonb_agg(
                jsonb_set(
                  jsonb_set(
                    elem,
                    '{fundingPartnersName}',
                    COALESCE(to_jsonb(ccbc_public.obfuscate_company_name((elem->>'fundingPartnersName')::text)), 'null'::jsonb)
                  ),
                  '{fundingSourceContactInfo}',
                  COALESCE(to_jsonb(ccbc_public.generate_lorem_ipsum((elem->>'fundingSourceContactInfo')::text)), 'null'::jsonb)
                )
              )
              FROM jsonb_array_elements(json_data->'otherFundingSources'->'otherFundingSourcesArray') elem
            ),
            json_data->'otherFundingSources'->'otherFundingSourcesArray'
          )
        )

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
