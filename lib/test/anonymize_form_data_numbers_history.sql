BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.record_version DISABLE TRIGGER ALL;

-- Main update query for record_version where table_name = 'form_data'
UPDATE ccbc_public.record_version
SET
  record = CASE
    WHEN record IS NOT NULL AND record ? 'json_data' THEN
      jsonb_set(
        record,
        '{json_data}',
        ccbc_public.anonymize_numeric_fields(
          record->'json_data',
          ARRAY[
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2223',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2324',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2425',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2526',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2627',
            'otherFundingSources,otherFundingSourcesArray,totalRequestedFundingPartner',
            'otherFundingSources,infrastructureBankFunding2223',
            'otherFundingSources,infrastructureBankFunding2324',
            'otherFundingSources,infrastructureBankFunding2425',
            'otherFundingSources,infrastructureBankFunding2526',
            'otherFundingSources,totalInfrastructureBankFunding',
            'projectFunding,fundingRequestedCCBC2223',
            'projectFunding,fundingRequestedCCBC2324',
            'projectFunding,fundingRequestedCCBC2425',
            'projectFunding,fundingRequestedCCBC2526',
            'projectFunding,fundingRequestedCCBC2627',
            'projectFunding,totalFundingRequestedCCBC',
            'projectFunding,totalApplicantContribution',
            'projectFunding,applicationContribution2223',
            'projectFunding,applicationContribution2324',
            'projectFunding,applicationContribution2425',
            'projectFunding,applicationContribution2526',
            'projectFunding,applicationContribution2627',
            'budgetDetails,totalProjectCost',
            'budgetDetails,totalEligibleCosts'
          ]::text[]
        )
      )
    ELSE record
  END,
  old_record = CASE
    WHEN old_record IS NOT NULL AND old_record ? 'json_data' THEN
      jsonb_set(
        old_record,
        '{json_data}',
        ccbc_public.anonymize_numeric_fields(
          old_record->'json_data',
          ARRAY[
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2223',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2324',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2425',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2526',
            'otherFundingSources,otherFundingSourcesArray,requestedFundingPartner2627',
            'otherFundingSources,otherFundingSourcesArray,totalRequestedFundingPartner',
            'otherFundingSources,infrastructureBankFunding2223',
            'otherFundingSources,infrastructureBankFunding2324',
            'otherFundingSources,infrastructureBankFunding2425',
            'otherFundingSources,infrastructureBankFunding2526',
            'otherFundingSources,totalInfrastructureBankFunding',
            'projectFunding,fundingRequestedCCBC2223',
            'projectFunding,fundingRequestedCCBC2324',
            'projectFunding,fundingRequestedCCBC2425',
            'projectFunding,fundingRequestedCCBC2526',
            'projectFunding,fundingRequestedCCBC2627',
            'projectFunding,totalFundingRequestedCCBC',
            'projectFunding,totalApplicantContribution',
            'projectFunding,applicationContribution2223',
            'projectFunding,applicationContribution2324',
            'projectFunding,applicationContribution2425',
            'projectFunding,applicationContribution2526',
            'projectFunding,applicationContribution2627',
            'budgetDetails,totalProjectCost',
            'budgetDetails,totalEligibleCosts'
          ]::text[]
        )
      )
    ELSE old_record
  END
WHERE table_name = 'form_data' AND (
  (record IS NOT NULL AND record ? 'json_data' AND record->'json_data' ? 'projectInformation' AND record->'json_data'->'projectInformation' ? 'projectTitle') OR
  (old_record IS NOT NULL AND old_record ? 'json_data' AND old_record->'json_data' ? 'projectInformation' AND old_record->'json_data'->'projectInformation' ? 'projectTitle')
);

-- Re-enable triggers
ALTER TABLE ccbc_public.record_version ENABLE TRIGGER ALL;

COMMIT;
