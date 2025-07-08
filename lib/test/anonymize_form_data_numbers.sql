BEGIN;

-- Disable triggers to prevent interference during updates
ALTER TABLE ccbc_public.form_data DISABLE TRIGGER ALL;

-- Main update query for form_data
UPDATE ccbc_public.form_data
SET json_data = ccbc_public.anonymize_numeric_fields(json_data, ARRAY[
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
]::text[])
WHERE json_data IS NOT NULL
  AND json_data ? 'projectInformation'
  AND json_data->'projectInformation' ? 'projectTitle';

-- Re-enable triggers
ALTER TABLE ccbc_public.form_data ENABLE TRIGGER ALL;

COMMIT;
