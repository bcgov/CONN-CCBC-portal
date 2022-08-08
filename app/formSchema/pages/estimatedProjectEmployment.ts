const estimatedProjectEmployment = {
  estimatedProjectEmployment: {
    title: 'Estimated project employment',
    description:
      'Please note: Full-time equivalent (FTE) job creation is aggregated from information provided below. 1.0 FTE is equal to 1 new position working 35 hours/week for 12 months/year.',
    type: 'object',
    required: [
      'currentEmployment',
      'numberOfEmployeesToWork',
      'hoursOfEmploymentPerWeek',
      'personMonthsToBeCreated',
      'numberOfContractorsToWork',
      'hoursOfContractorEmploymentPerWeek',
      'contractorPersonMonthsToBeCreated',
    ],
    properties: {
      currentEmployment: {
        title: `Current employment: Total number of people employed by the organization`,
        type: 'number',
      },
      numberOfEmployeesToWork: {
        title: 'Number of people to work on the project',
        type: 'number',
      },
      hoursOfEmploymentPerWeek: {
        title: `Hours of employment per week (average)`,
        type: 'number',
      },
      personMonthsToBeCreated: {
        title: `Total person months of employment to be created (average)`,
        type: 'number',
      },
      estimatedFTECreation: {
        title: `Total estimated full-time equivalent (FTE) Job Creation`,
        type: 'number',
        readOnly: true,
      },
      numberOfContractorsToWork: {
        title: 'Number of people to work on the project',

        type: 'number',
      },
      hoursOfContractorEmploymentPerWeek: {
        title: `Hours of employment per week (average)`,
        type: 'number',
      },
      contractorPersonMonthsToBeCreated: {
        title: `Total person months of employment to be created (average)`,
        type: 'number',
      },
      estimatedFTEContractorCreation: {
        title: `Total estimated full-time equivalent (FTE) Job Creation`,
        type: 'number',
        readOnly: true,
      },
    },
  },
};

export default estimatedProjectEmployment;
