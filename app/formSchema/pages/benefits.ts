const benefits = {
  benefits: {
    title: 'Benefits',
    type: 'object',
    description:
      'Quantify any estimation or claim about the effects of the proposed project to the targeted areas',
    required: ['projectBenefits', 'numberOfHouseholds'],
    properties: {
      projectBenefits: {
        type: 'string',
      },
      numberOfHouseholds: {
        title:
          'Total number of households targeted by this project. This value should match the value in Template 1.',
        type: 'number',
      },
    },
  },
};

export default benefits;
