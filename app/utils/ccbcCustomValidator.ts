const TEMPLATE_9_WARNING =
  'This value is informed from Template 9 which has not been received from the applicant.';
const template9Validation = {
  condition: (data) => !data?.template9Data,
  error: TEMPLATE_9_WARNING,
};

const CCBC_VALIDATIONS = {
  counts: {
    communities: {
      rules: [template9Validation],
    },
    indigenousCommunities: {
      rules: [template9Validation],
    },
    nonIndigenousCommunities: {
      rules: [template9Validation],
    },
    totalHouseholdsImpacted: {
      rules: [
        {
          condition: (data) => {
            return Number.isNaN(
              parseInt(
                data?.applicationData?.formData?.jsonData?.benefits
                  ?.numberOfHouseholds,
                10
              )
            );
          },
          error:
            'This value is informed from Template 1 which has not been received from the applicant.',
        },
      ],
    },
    numberOfIndigenousHouseholds: {
      rules: [
        {
          condition: (data) =>
            Number.isNaN(
              parseInt(
                data?.applicationData?.formData?.jsonData?.benefits
                  ?.householdsImpactedIndigenous,
                10
              )
            ),
          error:
            'This value is informed from Template 1 which has not been received from the applicant.',
        },
      ],
    },
  },
  locations: {
    benefitingCommunities: {
      rules: [template9Validation],
    },
    benefitingIndigenousCommunities: {
      rules: [template9Validation],
    },
    economicRegions: {
      rules: [
        {
          condition: (data) => data?.allApplicationErs?.edges?.length === 0,
          error: 'Coverage data requires updating in the Portal.',
        },
      ],
    },
    regionalDistricts: {
      rules: [
        {
          condition: (data) => data?.allApplicationRds?.edges?.length === 0,
          error: 'Coverage data requires updating in the Portal.',
        },
      ],
    },
  },
};

const validateRule = (rule, data) => {
  return rule?.condition?.(data) ? rule.error : null;
};

const customValidate = (data, key, fieldKey) => {
  const { rules } = CCBC_VALIDATIONS[key]?.[fieldKey] || {};
  return (
    rules?.map((rule) => validateRule(rule, data)).filter((error) => error) ||
    []
  );
};

export default customValidate;
