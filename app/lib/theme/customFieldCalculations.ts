const calculateEmployment = (people, hours, months) => {
  const result = people * (hours / 35) * (months / 12);
  return Number(result.toFixed(1)) || Number(result.toFixed(2)) || null;
};

const calculateFunding = (...values: number[]) => {
  const result = values.reduce((sum, value) => sum + (value || 0), 0);
  return Number(result.toFixed(2)) || null;
};

const calculateProjectEmployment = (formData) => {
  const people = Number(formData.numberOfEmployeesToWork) || 0;
  const hours = Number(formData.hoursOfEmploymentPerWeek) || 0;
  const months = Number(formData.personMonthsToBeCreated) || 0;

  formData.estimatedFTECreation =
    calculateEmployment(people, hours, months) || 0;
  return formData;
};

const calculateContractorEmployment = (formData) => {
  const people = Number(formData.numberOfContractorsToWork) || 0;
  const hours = Number(formData.hoursOfContractorEmploymentPerWeek) || 0;
  const months = Number(formData.contractorPersonMonthsToBeCreated) || 0;

  formData.estimatedFTEContractorCreation = calculateEmployment(
    people,
    hours,
    months
  );
  return formData;
};

const calculateFundingRequestedCCBC = (formData) => {
  const fundingRequestedCCBC2223 =
    Number(formData.fundingRequestedCCBC2223) || 0;
  const fundingRequestedCCBC2324 =
    Number(formData.fundingRequestedCCBC2324) || 0;
  const fundingRequestedCCBC2425 =
    Number(formData.fundingRequestedCCBC2425) || 0;
  const fundingRequestedCCBC2526 =
    Number(formData.fundingRequestedCCBC2526) || 0;
  const fundingRequestedCCBC2627 =
    Number(formData.fundingRequestedCCBC2627) || 0;
  const fundingRequestedCCBC2728 =
    Number(formData.fundingRequestedCCBC2728) || 0;
  const fundingRequestedCCBC2829 =
    Number(formData.fundingRequestedCCBC2829) || 0;

  formData.totalFundingRequestedCCBC = calculateFunding(
    fundingRequestedCCBC2223,
    fundingRequestedCCBC2324,
    fundingRequestedCCBC2425,
    fundingRequestedCCBC2526,
    fundingRequestedCCBC2627,
    fundingRequestedCCBC2728,
    fundingRequestedCCBC2829
  );

  return formData;
};

const calculateApplicantFunding = (formData) => {
  const applicationContribution2223 =
    Number(formData.applicationContribution2223) || 0;
  const applicationContribution2324 =
    Number(formData.applicationContribution2324) || 0;
  const applicationContribution2425 =
    Number(formData.applicationContribution2425) || 0;
  const applicationContribution2526 =
    Number(formData.applicationContribution2526) || 0;
  const applicationContribution2627 =
    Number(formData.applicationContribution2627) || 0;
  const applicationContribution2728 =
    Number(formData.applicationContribution2728) || 0;
  const applicationContribution2829 =
    Number(formData.applicationContribution2829) || 0;

  formData.totalApplicantContribution = calculateFunding(
    applicationContribution2223,
    applicationContribution2324,
    applicationContribution2425,
    applicationContribution2526,
    applicationContribution2627,
    applicationContribution2728,
    applicationContribution2829
  );

  return formData;
};

const calculateInfrastructureFunding = (formData) => {
  const infrastructureBankFunding2223 =
    Number(formData.infrastructureBankFunding2223) || 0;
  const infrastructureBankFunding2324 =
    Number(formData.infrastructureBankFunding2324) || 0;
  const infrastructureBankFunding2425 =
    Number(formData.infrastructureBankFunding2425) || 0;
  const infrastructureBankFunding2526 =
    Number(formData.infrastructureBankFunding2526) || 0;
  const infrastructureBankFunding2627 =
    Number(formData.infrastructureBankFunding2627) || 0;
  const infrastructureBankFunding2728 =
    Number(formData.infrastructureBankFunding2728) || 0;
  const infrastructureBankFunding2829 =
    Number(formData.infrastructureBankFunding2829) || 0;

  formData.totalInfrastructureBankFunding = calculateFunding(
    infrastructureBankFunding2223,
    infrastructureBankFunding2324,
    infrastructureBankFunding2425,
    infrastructureBankFunding2526,
    infrastructureBankFunding2627,
    infrastructureBankFunding2728,
    infrastructureBankFunding2829
  );

  return formData;
};

const calculateFundingPartner = (formData) => {
  const newFormData = JSON.parse(JSON.stringify(formData));

  newFormData.otherFundingSourcesArray &&
    newFormData.otherFundingSourcesArray.forEach((item) => {
      const requestedFundingPartner2223 =
        Number(item.requestedFundingPartner2223) || 0;
      const requestedFundingPartner2324 =
        Number(item.requestedFundingPartner2324) || 0;
      const requestedFundingPartner2425 =
        Number(item.requestedFundingPartner2425) || 0;
      const requestedFundingPartner2526 =
        Number(item.requestedFundingPartner2526) || 0;
      const requestedFundingPartner2627 =
        Number(item.requestedFundingPartner2627) || 0;
      const requestedFundingPartner2728 =
        Number(item.requestedFundingPartner2728) || 0;
      const requestedFundingPartner2829 =
        Number(item.requestedFundingPartner2829) || 0;

      item.totalRequestedFundingPartner = calculateFunding(
        requestedFundingPartner2223,
        requestedFundingPartner2324,
        requestedFundingPartner2425,
        requestedFundingPartner2526,
        requestedFundingPartner2627,
        requestedFundingPartner2728,
        requestedFundingPartner2829
      );
    });

  return newFormData;
};

export {
  calculateApplicantFunding,
  calculateContractorEmployment,
  calculateFundingPartner,
  calculateFundingRequestedCCBC,
  calculateInfrastructureFunding,
  calculateProjectEmployment,
};
