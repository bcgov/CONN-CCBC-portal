const estimatedProjectEmployment = {
  estimatedProjectEmployment: {
    title: 'Estimated project employment',
    description:
      'Please note: Full-time equivalent (FTE) job creation is aggregated from information provided below. 1.0 FTE is equal to 1 new position working 35 hours/week for 12 months/year.',
    type: 'object',
    required: ['currentEmployment'],
    properties: {
      currentEmployment: {
        title: `Current employment: Total number of people employed by the organization`,
        type: 'string',
      },

      estimatedDirectEmployees: {
        type: 'object',
        required: [
          'numberOfEmployeesToWork',
          'hoursOfEmploymentPerWeek',
          'personMonthsToBeCreated',
        ],
        properties: {
          numberOfEmployeesToWork: {
            title: `Number of people to work on the project`,
            type: 'string',
          },
          hoursOfEmploymentPerWeek: {
            title: `Hours of employment per week (average hours/week)`,
            type: 'string',
          },
          personMonthsToBeCreated: {
            title: `Total person months of employment to be created (average months/year)`,
            type: 'string',
          },
        },
      },
      estimatedContractorLabour: {
        type: 'object',
        required: [
          'numberOfContractorsToWork',
          'hoursOfContractorEmploymentPerWeek',
          'contractorPersonMonthsToBeCreated',
        ],
        properties: {
          numberOfContractorsToWork: {
            title: `Number of people to work on the project`,
            type: 'string',
          },
          hoursOfContractorEmploymentPerWeek: {
            title: `Hours of employment per week (average hours/week)`,
            type: 'string',
          },
          contractorPersonMonthsToBeCreated: {
            title: `Total person months of employment to be created (average months/year)`,
            type: 'string',
          },
        },
      },
    },
  },
};

export default estimatedProjectEmployment;
