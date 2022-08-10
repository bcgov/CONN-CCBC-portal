const calculateEmployment = (people, hours, months) => {
  const result = people * (hours / 35) * (months / 12);
  return Number(result.toFixed(1)) || null;
};

const calculateProjectEmployment = (formData) => {
  const people = Number(formData.numberOfEmployeesToWork) || 0;
  const hours = Number(formData.hoursOfEmploymentPerWeek) || 0;
  const months = Number(formData.personMonthsToBeCreated) || 0;

  formData.estimatedFTECreation = calculateEmployment(people, hours, months);
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

export { calculateProjectEmployment, calculateContractorEmployment };
