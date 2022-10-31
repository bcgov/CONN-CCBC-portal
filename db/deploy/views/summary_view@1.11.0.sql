-- Deploy ccbc:views/summary_view to pg

BEGIN;

CREATE OR REPLACE VIEW ccbc_public.summary_view AS 
SELECT a.intake_id, f.id, a.ccbc_number, f.last_edited_page, f.form_data_status_type_id,  
    f.created_by, f.created_at, f.updated_by, f.updated_at, f.archived_by, f.archived_at,
  json_data->'review' as review,
  json_data->'mapping' ->> 'geographicCoverageMap' as geographic_Coverage_Map,
  json_data->'mapping' ->> 'upgradedNetworkInfrastructure' as upgraded_Network_Infrastructure,
  json_data->'benefits' ->> 'projectBenefits' as project_Benefits,
  json_data->'benefits' ->> 'numberOfHouseholds' as number_Of_Households,
  json_data->'benefits' ->> 'householdsImpactedIndigenous' as households_Impacted_Indigenous,
  json_data->'submission' ->> 'submissionDate' as submission_Date,
  json_data->'submission' ->> 'submissionTitle' as submission_Title,
  json_data->'submission' ->> 'submissionCompletedBy' as submission_Completed_By,
  json_data->'submission' ->> 'submissionCompletedFor' as submission_Completed_For,
  json_data->'projectArea' ->> 'geographicArea' as geographic_Area,
  json_data->'projectArea' ->> 'provincesTerritories' as provinces_Territories,
  json_data->'projectArea' ->> 'projectSpanMultipleLocations' as project_Span_Multiple_Locations,
  json_data->'projectPlan' ->> 'operationalPlan' as operational_Plan,
  json_data->'projectPlan' ->> 'projectStartDate' as project_Start_Date,
  json_data->'projectPlan' ->> 'projectCompletionDate' as project_Completion_Date,
  json_data->'projectPlan' ->> 'relationshipManagerApplicant' as relationship_Manager_Applicant,
  json_data->'projectPlan' ->> 'overviewOfProjectParticipants' as overview_Of_Project_Participants,
  json_data->'projectPlan' ->> 'overviewProjectManagementTeam' as overview_Project_Management_Team,
  json_data->'declarations' ->> 'declarationsList' as declarations_List,
  json_data->'techSolution' ->> 'scalability' as scalability,
  json_data->'techSolution' ->> 'systemDesign' as system_Design,
  json_data->'techSolution' ->> 'backboneTechnology' as backbone_Technology,
  json_data->'techSolution' ->> 'lastMileTechnology' as last_Mile_Technology,
  json_data->'budgetDetails' ->> 'totalProjectCost' as total_Project_Cost,
  json_data->'budgetDetails' ->> 'totalEligibleCosts' as total_Eligible_Costs,
  json_data->'projectFunding' ->> 'fundingRequestedCCBC2223' as funding_Requested_CCBC_2223,
  json_data->'projectFunding' ->> 'fundingRequestedCCBC2324' as funding_Requested_CCBC_2324,
  json_data->'projectFunding' ->> 'fundingRequestedCCBC2425' as funding_Requested_CCBC_2425,
  json_data->'projectFunding' ->> 'fundingRequestedCCBC2526' as funding_Requested_CCBC_2526,
  json_data->'projectFunding' ->> 'fundingRequestedCCBC2627' as funding_Requested_CCBC_2627,
  json_data->'projectFunding' ->> 'totalFundingRequestedCCBC' as total_Funding_Requested_CCBC,
  json_data->'projectFunding' ->> 'totalApplicantContribution' as total_Applicant_Contribution,
  json_data->'projectFunding' ->> 'applicationContribution2223' as application_Contribution_2223,
  json_data->'projectFunding' ->> 'applicationContribution2324' as application_Contribution_2324,
  json_data->'projectFunding' ->> 'applicationContribution2425' as application_Contribution_2425,
  json_data->'projectFunding' ->> 'applicationContribution2526' as application_Contribution_2526,
  json_data->'projectFunding' ->> 'applicationContribution2627' as application_Contribution_2627,
  json_data->'projectFunding' ->> 'infrastructureBankFunding2223' as infrastructure_Bank_Funding_2223,
  json_data->'projectFunding' ->> 'infrastructureBankFunding2324' as infrastructure_Bank_Funding_2324,
  json_data->'projectFunding' ->> 'infrastructureBankFunding2425' as infrastructure_Bank_Funding_2425,
  json_data->'projectFunding' ->> 'infrastructureBankFunding2526' as infrastructure_Bank_Funding_2526,
  json_data->'projectFunding' ->> 'totalInfrastructureBankFunding' as total_Infrastructure_Bank_Funding,
  json_data->'templateUploads' ->> 'detailedBudget' as detailed_Budget,
  json_data->'templateUploads' ->> 'equipmentDetails' as equipment_Details,
  json_data->'templateUploads' ->> 'financialForecast' as financial_Forecast,
  json_data->'templateUploads' ->> 'lastMileIspOffering' as last_Mile_Isp_Offering,
  json_data->'templateUploads' ->> 'popWholeSalePricing' as pop_Whole_Sale_Pricing,
  json_data->'templateUploads' ->> 'eligibilityAndImpactsCalculator' as eligibility_And_Impacts_Calculator,
  json_data->'templateUploads' ->> 'communityRuralDevelopmentBenefitsTemplate' as community_Rural_Development_Benefits_Template,
  json_data->'alternateContact' ->> 'altEmail' as alt_Email,
  json_data->'alternateContact' ->> 'altExtension' as alt_Extension,
  json_data->'alternateContact' ->> 'altGivenName' as alt_Given_Name,
  json_data->'alternateContact' ->> 'altTelephone' as alt_Telephone,
  json_data->'alternateContact' ->> 'altFamilyName' as alt_Family_Name,
  json_data->'alternateContact' ->> 'altPostionTitle' as alt_Postion_Title,
  json_data->'alternateContact' ->> 'isAltContactSigningOfficer' as is_Alt_Contact_Signing_Officer,
  json_data->'authorizedContact' ->> 'authEmail' as auth_Email,
  json_data->'authorizedContact' ->> 'authExtension' as authExtension,
  json_data->'authorizedContact' ->> 'authGivenName' as auth_Given_Name,
  json_data->'authorizedContact' ->> 'authTelephone' as auth_Telephone,
  json_data->'authorizedContact' ->> 'authFamilyName' as auth_Family_Name,
  json_data->'authorizedContact' ->> 'authPostionTitle' as auth_Postion_Title,
  json_data->'authorizedContact' ->> 'isAuthContactSigningOfficer' as is_Auth_Contact_Signing_Officer,
  json_data->'contactInformation' ->> 'contactEmail' as contact_Email,
  json_data->'contactInformation' ->> 'contactWebsite' as contact_Website,
  json_data->'contactInformation' ->> 'contactExtension' as contact_Extension,
  json_data->'contactInformation' ->> 'contactTelephoneNumber' as contact_Telephone_Number,
  json_data->'projectInformation' ->> 'projectTitle' as project_Title,
  json_data->'projectInformation' ->> 'projectDescription' as project_Description,
  json_data->'organizationProfile' ->> 'isSubsidiary' as is_Subsidiary,
  json_data->'organizationProfile' ->> 'operatingName' as operating_Name,
  json_data->'organizationProfile' ->> 'parentOrgName' as parent_Org_Name,
  json_data->'organizationProfile' ->> 'businessNumber' as business_Number,
  json_data->'organizationProfile' ->> 'isNameLegalName' as is_Name_Legal_Name,
  json_data->'organizationProfile' ->> 'organizationName' as organization_Name,
  json_data->'organizationProfile' ->> 'isIndigenousEntity' as is_Indigenous_Entity,
  json_data->'organizationProfile' ->> 'typeOfOrganization' as type_Of_Organization,
  json_data->'organizationProfile' ->> 'orgRegistrationDate' as org_Registration_Date,
  json_data->'organizationProfile' ->> 'indigenousEntityDesc' as indigenous_Entity_Desc,
  json_data->'organizationProfile' ->> 'organizationOverview' as organization_Overview,
  json_data->'otherFundingSources' ->> 'otherFundingSources' as other_Funding_Sources,
  json_data->'supportingDocuments' ->> 'copiesOfRegistration' as copies_Of_Registration,
  json_data->'supportingDocuments' ->> 'evidenceOfConnectivitySpeeds' as evidence_Of_Connectivity_Speeds,
  json_data->'organizationLocation' ->> 'city' as city,
  json_data->'organizationLocation' ->> 'POBox' as POBox,
  json_data->'organizationLocation' ->> 'province' as province,
  json_data->'organizationLocation' ->> 'postalCode' as postal_Code,
  json_data->'organizationLocation' ->> 'streetName' as street_Name,
  json_data->'organizationLocation' ->> 'unitNumber' as unit_Number,
  json_data->'organizationLocation' ->> 'streetNumber' as street_Number,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'cityMailing' as city_mailing,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'POBoxMailing' as POBox_mailing,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'provinceMailing' as province_mailing,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'postalCodeMailing' as postal_code_mailing,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'streetNameMailing' as street_name_mailing,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'unitNumberMailing' as unit_number_mailing,
  json_data->'organizationLocation' -> 'mailingAddress' ->> 'streetNumberMailing' as street_number_mailing,
  json_data->'organizationLocation' ->> 'isMailingAddress' as is_Mailing_Address,
  json_data->'existingNetworkCoverage' ->> 'hasPassiveInfrastructure' as has_Passive_Infrastructure,
  json_data->'existingNetworkCoverage' ->> 'isInfrastuctureAvailable' as is_Infrastructure_Available,
  json_data->'existingNetworkCoverage' ->> 'hasProvidedExitingNetworkCoverage' as has_Provided_Exiting_Network_Coverage,
  json_data->'existingNetworkCoverage' ->> 'requiresThirdPartyInfrastructureAccess' as requires_Third_Party_Infrastructure_Access,
  json_data->'estimatedProjectEmployment' ->> 'currentEmployment' as current_Employment,
  json_data->'estimatedProjectEmployment' ->> 'numberOfEmployeesToWork' as number_Of_Employees_To_Work,
  json_data->'estimatedProjectEmployment' ->> 'personMonthsToBeCreated' as person_Months_To_Be_Created,
  json_data->'estimatedProjectEmployment' ->> 'estimatedDirectEmployees' as estimated_Direct_Employees,
  json_data->'estimatedProjectEmployment' ->> 'hoursOfEmploymentPerWeek' as hours_Of_Employment_Per_Week,
  json_data->'estimatedProjectEmployment' ->> 'estimatedContractorLabour' as estimated_Contractor_Labour,
  json_data->'estimatedProjectEmployment' ->> 'numberOfContractorsToWork' as number_Of_Contractors_To_Work,
  json_data->'estimatedProjectEmployment' ->> 'contractorPersonMonthsToBeCreated' as contractor_Person_Months_To_Be_Created,
  json_data->'estimatedProjectEmployment' ->> 'hoursOfContractorEmploymentPerWeek' as hours_Of_Contractor_Employment_Per_Week
  
FROM ccbc_public.application a 
    inner join ccbc_public.application_form_data afd on a.id = afd.application_id
    inner join ccbc_public.form_data f on f.id = afd.form_data_id
    where ccbc_public.application_status(a) <> 'draft';
    ;

-- comments
    comment on view ccbc_public.summary_view is 'View containing the list of applications';
    comment on column ccbc_public.summary_view.id is 'Primary key ID for the application';
    comment on column ccbc_public.summary_view.ccbc_number is 'Reference number assigned to the application';
    comment on column ccbc_public.summary_view.form_data_status_type_id is 'The status of the form';
    comment on column ccbc_public.summary_view.last_edited_page is 'Column saving the key of the last edited form page';
    comment on column ccbc_public.summary_view.created_by is 'created by user id';
    comment on column ccbc_public.summary_view.created_at is 'created at timestamp';
    comment on column ccbc_public.summary_view.updated_by is 'updated by user id';
    comment on column ccbc_public.summary_view.updated_at is 'updated at timestamp';
    comment on column ccbc_public.summary_view.archived_by is 'archived by user id';
    comment on column ccbc_public.summary_view.archived_at is 'archived at timestamp';
    comment on column ccbc_public.summary_view.intake_id is 'Application Intake Number, used as the prefix for CCBC reference number';

    grant select on ccbc_public.summary_view to ccbc_analyst, ccbc_admin;

COMMIT;
